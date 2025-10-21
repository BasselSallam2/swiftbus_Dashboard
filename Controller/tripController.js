import prisma from "../prisma/prisma.js";
import pkg from "rrule";
const { RRule } = pkg;
import { ticketMapper } from "../util/MyticketsMapper.js";


function convertToMMDDYYYY(dateString) {
    const [year, month, day] = dateString.split("-");
    return `${month}/${day}/${year}`;
}

function convertTo12HourFormat(time) {
  let [hours, minutes] = time.split(":").map(Number);
  let period = hours >= 12 ? "PM" : "AM";

  // Convert hours from 24-hour to 12-hour format
  hours = hours % 12 || 12;

  return `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

function updateRRule(inputString) {
  // Split the input string into DTSTART and the rest of the rule
  const [dtstart, rrule] = inputString.split("\n");

  // Check if DTSTART is already present
  if (rrule.includes("DTSTART=")) {
    return inputString; // Return as is if DTSTART already exists
  }

  // Insert DTSTART at the correct position after "FREQ=DAILY;"
  let updatedRRule = rrule.replace(
    "FREQ=DAILY;",
    `FREQ=DAILY;DTSTART=${dtstart};`
  );

  return updatedRRule;
}

function parseRRule(rruleString) {
  const ruleParts = rruleString.split(";");
  let from = null,
    to = null,
    excludedDays = [];

  ruleParts.forEach((part) => {
    const [key, value] = part.split("=");

    if (key === "DTSTART") {
      from = value.substring(0, 8); // Extract YYYYMMDD format
      from = `${from.substring(0, 4)}-${from.substring(4, 6)}-${from.substring(
        6,
        8
      )}`;
    }

    if (key === "UNTIL") {
      to = value.substring(0, 8); // Extract YYYYMMDD format
      to = `${to.substring(0, 4)}-${to.substring(4, 6)}-${to.substring(6, 8)}`;
    }

    if (key === "BYDAY") {
      const allDays = {
        MO: "Monday",
        TU: "Tuesday",
        WE: "Wednesday",
        TH: "Thursday",
        FR: "Friday",
        SA: "Saturday",
        SU: "Sunday",
      };

      const includedDays = value.split(",").map((day) => allDays[day]);
      const allDaysArray = Object.values(allDays);

      excludedDays = allDaysArray.filter((day) => !includedDays.includes(day));
    }
  });

  return {
    from,
    to,
    Holidays: excludedDays,
  };
}

function generateRRule(from, to, excludedDays) {
  const daysMap = {
    Sunday: RRule.SU,
    Monday: RRule.MO,
    Tuesday: RRule.TU,
    Wednesday: RRule.WE,
    Thursday: RRule.TH,
    Friday: RRule.FR,
    Saturday: RRule.SA,
  };

  // Convert excluded days to RRule format
  const byDay = Object.keys(daysMap)
    .filter((day) => !excludedDays.includes(day))
    .map((day) => daysMap[day]);

  // Create RRule
  const rule = new RRule({
    freq: RRule.DAILY,
    dtstart: new Date(
      Date.UTC(
        parseInt(from.substring(0, 4)),
        parseInt(from.substring(5, 7)) - 1,
        parseInt(from.substring(8, 10)),
        0,
        0,
        0
      )
    ),
    until: new Date(
      Date.UTC(
        parseInt(to.substring(0, 4)),
        parseInt(to.substring(5, 7)) - 1,
        parseInt(to.substring(8, 10)),
        23,
        59,
        59
      )
    ),
    byweekday: byDay,
  });

  let rrule = rule.toString().replace("DTSTART:", "").replace("RRULE:", "");

  return updateRRule(rrule);
}

export const ViewTrips = async (req, res, next) => {
  try {
    const trips = await prisma.trip.findMany({ where : {isDeleted : false} ,
      include: { Bus: true, StationDetails: { include: { station: true } } },
    });

    const mappedTrips = await Promise.all(
      trips.map(async (trip) => {
        const routeIds = Array.isArray(trip.routes)
          ? trip.routes.map((route) => route.toString())
          : [];

        let CityRoutes = await Promise.all(
          routeIds.map(
            async (route) =>
              (
                await prisma.city.findUnique({
                  where: { id: route },
                  select: { name: true },
                })
              ).name
          )
        );
        let stationRoutes = [];

        trip.StationDetails.forEach((station) => {
          stationRoutes.push({
            name: station.station.name,
            time: station.arrivaleTime,
          });
        });

        stationRoutes.sort((a, b) => {
          const parseTime = (timeStr) => {
            const [time, modifier] = timeStr.split(" ");
            let [hours, minutes] = time.split(":").map(Number);

            if (modifier === "PM" && hours !== 12) hours += 12;
            if (modifier === "AM" && hours === 12) hours = 0;

            return hours * 60 + minutes;
          };

          return parseTime(a.time) - parseTime(b.time);
        });

        let stationArray = [];
        stationRoutes.forEach((station) => {
          stationArray.push(station.name);
        });

        let triptime = parseRRule(trip.rrule);

        return {
          id: trip.id,
          bus: trip.Bus.type,
          cityRoutes: CityRoutes,
          stationRoutes: stationArray,
          from: triptime.from,
          to: triptime.to,
          holidays: triptime.Holidays,
          inactive: trip.inactive ,
        };
      })
    );

    res.render("ViewTrips", { trips: mappedTrips });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const AddTripsForm = async (req, res, next) => {
  try {
    let trip = {} ; let data = {} ;
    const cities = await prisma.city.findMany({where:{isDeleted : false}});
    const stations = await prisma.station.findMany({where : {isDeleted : false}});
    const buses = await prisma.bus.findMany();

    res.render("AddTrip", { cities, stations, buses , trip , data});
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const AddTrips = async (req, res, next) => {
  const {
    dateFrom,
    dateTo,
    selectedDays,
    cityRoutes,
    stationNames,
    arriveTimes,
    costRoutes,
    normalfare,
    specialfare,
    twowaydiscount,
    payment,
    cashlimit,
    expireHours,
    bus,
    seats,
  } = req.body;

  try {
    console.log(req.body);
    const rrule = generateRRule(dateFrom, dateTo, selectedDays);
    let paymentarray = payment.split(",");

    const Trip = await prisma.trip.create({
      data: {
        rrule: rrule,
        routes: cityRoutes,
        payment: paymentarray,
        cahslimit: +cashlimit,
        expireHours: +expireHours,
        avaliableseats: +seats,
        busid: bus,
      },
    });

    let stationtime;
    for (let index in arriveTimes) {
      stationtime = convertTo12HourFormat(arriveTimes[index]);

      await prisma.stationDetails.create({
        data: {
          trip_id: Trip.id,
          arrivaleTime: stationtime,
          stationId: stationNames[index],
        },
      });
    }

    let costindex = 0;

    for (let index = 0; index < cityRoutes.length; index++) {
      for (let y = index + 1; y < cityRoutes.length; y++) {
        if (
          costindex >= normalfare.length ||
          costindex >= specialfare.length ||
          costindex >= twowaydiscount.length
        ) {
          console.error("Index out of bounds for fare arrays");
          return; // Stop execution to prevent errors
        }

        await prisma.cost.create({
          data: {
            trip_id: Trip.id,
            fromCityId: cityRoutes[index],
            toCityId: cityRoutes[y],
            fare: +normalfare[costindex], // Convert string to number
            specialfare: +specialfare[costindex], // Convert string to number
            twowaydiscount: +twowaydiscount[costindex], // Convert string to number
          },
        });

        costindex++;
      }
    }

    res.redirect("/trip");
  } catch (error) {
    console.log(error);
    next(error);
  }
};


export const EditTripform = async (req , res , next) => {
    const {ID} = req.params ;
    try {
        const trip = await prisma.trip.findUnique({where : {id: ID} , include:{Bus : true , StationDetails : true , cost : true} }) ;
        const cities = await prisma.city.findMany({where : {isDeleted : false}});
        const stations = await prisma.station.findMany({where : {isDeleted : false}});
        const buses = await prisma.bus.findMany();

        let convertedRrule = parseRRule(trip.rrule) ;

        const paymentArray = Array.isArray(trip.payment)
          ? trip.payment.map((payment) => payment.toString())
          : [];

          const routeIds = Array.isArray(trip.routes)
          ? trip.routes.map((route) => route.toString())
          : [];

        let CityRoutes = await Promise.all(
          routeIds.map(
            async (route) =>
              (
                await prisma.city.findUnique({
                  where: { id: route },
                  select: { name: true },
                })
              ).name
          )
        );

        let tripStations = trip.StationDetails.map((station) => {
            return station.id
        })

        let stationIDs = trip.StationDetails.map((station) => station.stationId);

        let StationsTime = trip.StationDetails.map((station) => {
            return station.arrivaleTime;
        });

        let stationNames = await Promise.all(
          stationIDs.map(async (id) => {
            const station = await prisma.station.findUnique({
              where: { id: id },
              select: { name: true },
            });
            return station.name;
          })
        );


        let price = await Promise.all(
            trip.cost.map(async (trip) => {

              const fromcity = await prisma.city.findUnique({
                where: { id: trip.fromCityId },
                select: { name: true },
              });

              const tocity = await prisma.city.findUnique({
                where: { id: trip.toCityId },
                select: { name: true },
              });

              return {
                fromcity:fromcity.name ,
                tocity: tocity.name ,
                fare: trip.fare ,
                specialfare:trip.specialfare ,
                twowaydiscount : trip.twowaydiscount,
                
              }
            })
          );

       

        
     

      

             
        

        let data = {
            from : convertedRrule.from ,
            to: convertedRrule.to ,
            holidays: convertedRrule.Holidays,
            payment: paymentArray ,
            cashlimit: trip.cahslimit ,
            expirehours : trip.expireHours ,
            bus : trip.Bus.type ,
            seats : trip.avaliableseats ,
            cityRoutes : CityRoutes ,
            stationIds:stationNames ,
            arrivalTimes: StationsTime ,
            cost: price ,
            inactive : trip.inactive
            

        }
    

        res.render("AddTrip", { cities, stations, buses , trip , data });
    }

    catch(error) {
        console.log(error) ;
        next(error) ;
    }

}


export const editTrip = async (req , res , next) => {

    const {
      dateFrom,
      dateTo,
      selectedDays,
      payment,
      cashlimit,
      expireHours,
      bus,
      seats,
      cityRoutes,
      stationNames,
      arriveTimes,
      normalfare,
      specialfare,
      twowaydiscount,
      inactive
    } = req.body;
    try {

    
    const rrule = generateRRule(dateFrom, dateTo, selectedDays.split(","));
    let paymentarray = payment.split(",");

    await prisma.trip.update({
      where: { id: req.params.ID },
      data: {
        rrule: rrule,
        routes: cityRoutes,
        payment: paymentarray,
        cahslimit: +cashlimit,
        expireHours: +expireHours,
        avaliableseats: +seats,
        busid: bus,
        inactive: inactive === 'on'
      },
    });

    await prisma.stationDetails.deleteMany({
      where: { trip_id: req.params.ID }
    });

    for (let index in arriveTimes) {
      const stationtime = convertTo12HourFormat(arriveTimes[index]);

      await prisma.stationDetails.create({
        data: {
          trip_id: req.params.ID,
          arrivaleTime: stationtime,
          stationId: stationNames[index],
        },
      });
    }

    await prisma.cost.deleteMany({
      where: { trip_id: req.params.ID }
    });

    let costindex = 0;

    for (let index = 0; index < cityRoutes.length; index++) {
      for (let y = index + 1; y < cityRoutes.length; y++) {
        await prisma.cost.create({
          data: {
            trip_id: req.params.ID,
            fromCityId: cityRoutes[index],
            toCityId: cityRoutes[y],
            fare: +normalfare[costindex],
            specialfare: +specialfare[costindex],
            twowaydiscount: +twowaydiscount[costindex],
          },
        });

        costindex++;
      }
    }

    res.redirect("/trip");
    }

catch(error) {

}

}


export const deletetrip = async (req , res , next) => {
    const {ID} = req.params ;
    try {
        const trip = await prisma.trip.update({where:{id:ID} , data : {
            inactive : true ,
            isDeleted: true
            
        }})


        res.redirect("/trip") ;
        
    }

    catch(error) {
        console.log(error) ;
        next(error) ;
    }
}



export const ViewTickets = async (req, res, next) => {

  const {ID} = req.params ;
 
  let TicketsType = `trip ${ID} Tickets` ;
  const Tickets = await prisma.ticket.findMany({
    where: {
      OR: [
        { trip_id: ID },
        { Back_trip_id: ID }
      ]
    },
    include: { voucher: true, BookEmployeeID: true, CoustmerID: true, trip: true, back_trip: true, CancelEmployeeID: true },
  });

const TicketsMapped = await ticketMapper(Tickets);
    
  
  res.render("viewBookedTickets" , {tickets: TicketsMapped , TicketsType }) ;
};

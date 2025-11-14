import prisma from "../prisma/prisma.js";
import { AgentMapper } from "../util/service/AgentMapper.js";

export const Landing = async (req, res, next) => {
  try{

  
const currentUser = req.user ;
if(!currentUser.role.includes("Admin")){
let isAdmin = false;

const Reservations = await prisma.reservation.findMany({
      include: {
        Trips: { include: { Bus: true } },
      },
    });

    const MappedReservations = await Promise.all(
      Reservations.map(async (reserve) => {
        const routeIds = Array.isArray(reserve.Trips.routes)
          ? reserve.Trips.routes.map((route) => route.toString())
          : [];

        const tripDetails = (
          await prisma.stationDetails.findMany({
            where: { trip_id: reserve.Trips.id },
          })
        ).sort((a, b) => {
          return parseTime12h(a.arrivaleTime) - parseTime12h(b.arrivaleTime);
        });

        const tripTime = [
          tripDetails[0].arrivaleTime,
          tripDetails[tripDetails.length - 1].arrivaleTime,
        ];

        let Route = await Promise.all(
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

        return {
          id: reserve.id,
          trip_id: reserve.trip_id,
          trip_date: reserve.trip_date,
          reservedSeats_counter: reserve.reservedSeats_counter,
          reservedSeats: reserve.reservedSeats,
          available_seats:
            reserve.Trips.avaliableseats - reserve.reservedSeats_counter,
          bus: reserve.Trips.Bus.type,
          route_names: Route,
          trip_time: tripTime,
        };
      })
    );
    const Agent = await prisma.employee.findUnique({
      where: { id: currentUser.employeeID },
      include: { User: true, tickets_id: { include: { CoustmerID: true , CancelEmployeeID : true } } },
    });

    const AgentData = await AgentMapper(Agent);
    const needtobesetteled = AgentData.totalsales-AgentData.neededcommetions-AgentData.setteled;
    return res.render("landing", {
    currentUser,
    reservations: MappedReservations,
    needtobesetteled,
    isAdmin
});

}else {

  const Agents = await prisma.employee.findMany({
  where: { type: "Agent" , isDeleted: false },  
  include: {
    User: true,
    tickets_id: { 
      include: { 
        CoustmerID: true,
        CancelEmployeeID: true 
      } 
    }
  }
});


const AgentsMapped = await Promise.all(
  Agents.map(async (agent) => {
    const data = await AgentMapper(agent);

    const needtobesetteled =
      data.totalsales - data.neededcommetions - (data.setteled || 0);

    return {
      id: agent.id,
      name: agent.name,
      phone: agent.phone,
      percentage: agent.percentage,
      totalsales: data.totalsales,
      neededcommetions: data.neededcommetions,
      setteled: data.setteled || 0,
      needtobesetteled, // الرقم النهائي
    };
  })
);

 return res.render("landing", { AgentsMapped, isAdmin: true });


}






  // let totalmoney = 0;
  // let numberpassenger;
  // let numbertrips;

  // let booked_tickes = 0;
  // let pending_tickets = 0;
  // let cancelled_tickets = 0;
  // let total_cash = 0;
  // let total_wallet = 0;
  // let total_visa = 0;
  // let total_sales = 0;
  // let percentage = 0;
  // let commission = 0;
  // let Collected = 0;

  // let CancelledTickets = 0;
  // let PendingTickets = 0;
  // let AbsentTickets = 0;
  // let PartialPaidTickets = 0;
  // let RefundedTickets = 0;
  // let BookedTickets = 0;
  // let visaWeb = 0;
  // let WalletWeb = 0;
  // let cashWeb = 0;
  // let visaAgents = 0;
  // let WalletAgents = 0;
  // let cashAgents = 0;

  // const { role, type, employeeID } = req.user;

  // if (role.includes("Admin")) {
  //   const alltickets = await prisma.ticket.findMany();

  //   alltickets.forEach((ticket) => {
  //     if (ticket.status === "Booked") BookedTickets += 1;
  //     if (ticket.status === "Cancelled") CancelledTickets += 1;
  //     if (ticket.status === "Pending") PendingTickets += 1;
  //     if (ticket.status === "Absent") AbsentTickets += 1;
  //     if (ticket.status === "Refunded") RefundedTickets += 1;
  //     if (ticket.status === "Partial Paid") PartialPaidTickets += 1;

  //     if (
  //       !ticket.book_id &&
  //       (ticket.status == "Booked" || ticket.status == "Absent") &&
  //       ticket.paymentMethod == "visa"
  //     )
  //       visaWeb += ticket.price;
  //     if (
  //       ticket.book_id &&
  //       (ticket.status == "Booked" || ticket.status == "Absent") &&
  //       ticket.paymentMethod == "visa"
  //     )
  //       visaAgents += ticket.price;

  //     if (
  //       !ticket.book_id &&
  //       (ticket.status == "Booked" || ticket.status == "Absent") &&
  //       ticket.paymentMethod == "cash"
  //     )
  //       cashWeb += ticket.price;
  //     if (
  //       ticket.book_id &&
  //       (ticket.status == "Booked" || ticket.status == "Absent") &&
  //       ticket.paymentMethod == "cash"
  //     )
  //       cashAgents += ticket.price;

  //     if (
  //       !ticket.book_id &&
  //       (ticket.status == "Booked" || ticket.status == "Absent") &&
  //       ticket.paymentMethod == "VFcash"
  //     )
  //       WalletWeb += ticket.price;
  //     if (
  //       ticket.book_id &&
  //       (ticket.status == "Booked" || ticket.status == "Absent") &&
  //       ticket.paymentMethod == "VFcash"
  //     )
  //       WalletAgents += ticket.price;
  //   });

  //   totalmoney =
  //     visaWeb + visaAgents + cashWeb + cashAgents + WalletWeb + WalletAgents;

  //   const trips = await prisma.trip.findMany();
  //   numbertrips = trips.length;

  //   const passengers = await prisma.coustmer.findMany();
  //   numberpassenger = passengers.length;
  // }

  // if (type == "Agent") {
  //   const Agent = await prisma.employee.findUnique({
  //     where: { id: employeeID },
  //   });

  //   percentage = Agent.percentage;
  //   Collected = Agent.setteled;

  //   const booked = await prisma.ticket.findMany({
  //     where: { status: "Booked", book_id: employeeID },
  //   });
  //   booked_tickes = booked.length;
  //   const pendning = await prisma.ticket.findMany({
  //     where: { status: "Pending", book_id: employeeID },
  //   });
  //   pending_tickets = pendning.length;
  //   const canclled = await prisma.ticket.findMany({
  //     where: { status: { in: ["Cancelled", "Absent"] }, book_id: employeeID },
  //   });
  //   cancelled_tickets = canclled.length;

  //   let bookedmap = booked.map((ticket) => {
  //     if (ticket.paymentMethod == "cash") total_cash = +ticket.price;
  //     if (ticket.paymentMethod == "visa") total_visa = +ticket.price;
  //     if (ticket.paymentMethod == "VFcash") total_wallet = +ticket.price;
  //   });

  //   total_sales = total_cash + total_visa + total_wallet;
  //   commission = total_sales * (Agent.percentage / 100);
  // }

  // res.render("landing", {
  //   numberpassenger,
  //   totalmoney,
  //   numbertrips,
  //   booked_tickes,
  //   pending_tickets,
  //   cancelled_tickets,
  //   total_cash,
  //   total_wallet,
  //   total_visa,
  //   total_sales,
  //   percentage,
  //   commission,
  //   Collected,
  //   CancelledTickets,
  //   PendingTickets,
  //   AbsentTickets,
  //   PartialPaidTickets,
  //   RefundedTickets,
  //   BookedTickets,
  //   visaWeb,
  //   WalletWeb,
  //   cashWeb,
  //   visaAgents,
  //   WalletAgents,
  //   cashAgents,
  // });
}
catch(error) {
  console.log(error);
  next(error);
}
};


function parseTime12h(timeStr) {
  const [time, modifier] = timeStr.split(" "); // ["2:15", "AM"]
  let [hours, minutes] = time.split(":").map(Number);

  if (modifier === "PM" && hours !== 12) {
    hours += 12;
  }
  if (modifier === "AM" && hours === 12) {
    hours = 0;
  }

  return hours * 60 + minutes; // total minutes
}
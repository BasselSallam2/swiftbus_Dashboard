import prisma from "../prisma/prisma.js";

export const GetCoustmerEditForm = async (req, res, next) => {
  try {
    const { customerid } = req.params;
    const customer = await prisma.coustmer.findUnique({
      where: { id: customerid },
      select: { id: true, name: true, phone: true },
    });
    res.render("EditCustomer", { customer });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const EditCoustmer = async (req, res, next) => {
  try {
    const { customerid } = req.params;
    const { name, phone } = req.body;
    console.log(name, phone);
    const customer = await prisma.coustmer.update({
      where: { id: customerid },
      data: { name: name, phone: phone },
    });
    res.redirect("/coustmer");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const GetCoustmers = async (req, res, next) => {
  try {
    const coustmers = await prisma.coustmer.findMany({
      include: {
        tickets: {
          where: {
            status: {
              not: "Cancelled",
            },
          },
        },
      },
    });

    const coustmerMapped = await Promise.all(
      coustmers.map(async (coustmer) => {
        let CancelledTickets = 0;
        let numberTickets = 0;
        let numberSeats = 0;
        let money = 0;

        const CANCELLEDTickets = await prisma.coustmer.findUnique({
          where: { id: coustmer.id },
          include: { tickets: { where: { status: "Cancelled" } } },
        });

        CancelledTickets = CANCELLEDTickets.tickets.length;

        for (let Coustmer of coustmer.tickets) {
          if (Coustmer.Back_trip_id && Coustmer.Back_trip_id.length > 0) {
            numberTickets += 2;
          } else {
            numberTickets++;
          }

          numberSeats =
            numberSeats +
            Coustmer.seatsCounter +
            (Coustmer.Back_seatsCounter || 0);
        }

        coustmer.tickets.forEach((ticket) => {
          money += ticket.price;
        });

        return {
          name: coustmer.name,
          phone: coustmer.phone,
          id: coustmer.id,
          tickets: numberTickets,
          seats: numberSeats,
          price: money,
          cancel: CancelledTickets,
        };
      })
    );

    res.render("viewCoustmer", { coustmer: coustmerMapped });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const CoustmerTicket = async (req, res, next) => {
  try {
    const { coustmerid } = req.params;

    const coustmer = await prisma.coustmer.findUnique({
      where: { id: coustmerid },
      include: {
        tickets: {
          include: {
            voucher: true,
            BookEmployeeID: true,
            CoustmerID: true,
            CancelEmployeeID: true,
          },
        },
      },
    });

    const TicketsMapped = await Promise.all(
      coustmer.tickets.map(async (ticket) => {
        const cityRoutes = Array.isArray(ticket.CityRoutes)
          ? ticket.CityRoutes.map((route) => route.toString())
          : [];

        let CityRoutes = await Promise.all(
          cityRoutes.map(async (city) => {
            const cityData = await prisma.city.findUnique({
              where: { id: city },
              select: { name: true },
            });
            return cityData ? cityData.name : null;
          })
        );

        const stationRoutes = Array.isArray(ticket.StationRoutes)
          ? ticket.StationRoutes.map((route) => route.toString())
          : [];

        // let StationRoutes = await Promise.all(
        //   stationRoutes.map(async (station) => {
        //     const stationData = await prisma.station.findUnique({
        //       where: { id: station },
        //       select: { name: true },
        //     });
        //     return stationData ? stationData.name : null;
        //   })
        // );

        let StationRoutes = ticket.StationRoutes;

        let BackRoute = null;
        let BackRouteID = null;
        let BackRouteArray = null;
        const GoRouteID = (
          await prisma.trip.findUnique({
            where: { id: ticket.trip_id },
            select: { routes: true },
          })
        ).routes;
        const GoRouteArray = JSON.parse(
          typeof GoRouteID === "string" ? GoRouteID : JSON.stringify(GoRouteID)
        );
        const GoRoute = await Promise.all(
          GoRouteArray.map(async (route) => {
            const routeData = await prisma.city.findUnique({
              where: { id: route },
              select: { name: true },
            });
            return routeData ? routeData.name : null;
          })
        );

        if (ticket.Back_trip_id) {
          BackRouteID = (
            await prisma.trip.findUnique({
              where: { id: ticket.Back_trip_id },
              select: { routes: true },
            })
          ).routes;
          BackRouteArray = JSON.parse(
            typeof BackRouteID === "string"
              ? BackRouteID
              : JSON.stringify(BackRouteID)
          );
          BackRoute = await Promise.all(
            BackRouteArray.map(async (route) => {
              const routeData = await prisma.city.findUnique({
                where: { id: route },
                select: { name: true },
              });
              return routeData ? routeData.name : null;
            })
          );
        }

        let currentmoney;
        if (ticket.status == "Booked") {
          currentmoney = ticket.price;
        } else if (ticket.status == "Refunded") {
          if (ticket.settledprice > 0) {
            currentmoney = ticket.settledprice - ticket.refundAmount;
          }
        } else if (ticket.status == "Partial Paid") {
          currentmoney = ticket.settledprice;
        } else if (ticket.status == "Cancelled" || ticket.status == "Absent") {
          if (ticket.settledprice > 0) {
            currentmoney = ticket.settledprice;
          } else {
            currentmoney = ticket.price;
          }
        } else if (ticket.status == "Pending") {
          currentmoney = 0;
        }

        return {
          id: ticket.id,
          code: ticket.ticket_code,
          trip_go_id: ticket.trip_id,
          trip_go_route: GoRoute,
          trip_back_id: ticket.Back_trip_id,
          trip_back_route: BackRoute,
          trip_date: ticket.trip_date,
          back_trip_date: ticket.Back_trip_date,
          status: ticket.status,
          paymentmethod: ticket.paymentMethod,
          seatsCounter: ticket.seatsCounter,
          Back_seatsCounter: ticket.Back_seatsCounter,
          seats: ticket.seats,
          Backseats: ticket.Backseats,
          takeoff: ticket.takeoff,
          Back_takeoff: ticket.Back_takeoff,
          price: ticket.price,
          settled: ticket.settledprice,
          CreatedAt: ticket.CreatedAt
            ? new Date(
                new Date(ticket.CreatedAt).getTime() + 2 * 60 * 60 * 1000
              )
                .toISOString()
                .slice(0, 19)
                .replace("T", " ")
            : null,
          GoStation: StationRoutes[0],
          BackStation: StationRoutes[1],
          voucher: ticket.voucher?.code ?? null,
          BookEmpolyee: ticket.BookEmployeeID?.name ?? null,
          CancellEmployee: ticket.CancelEmployeeID?.name ?? null,
          coustmer_name: ticket.CoustmerID?.name ?? null,
          coustmer_phone: ticket.CoustmerID?.phone ?? null,
          cancelReason: ticket.cancelReason ?? null,
          refunded: ticket.refundAmount,
          currentmoney: currentmoney,
        };
      })
    );

    res.render("viewCoustmerTicket", { tickets: TicketsMapped });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const EditCoustmerTicketForm = async (req, res, next) => {
  try {
    let CancelPermetion = req.user.role.includes("Cancel");
    let BookPermetion = req.user.role.includes("Book");
    const { ticketid } = req.params;
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketid },
      select: {
        id: true,
        status: true,
        cancelReason: true,
        settledprice: true,
        refundAmount: true,
      },
    });

    res.render("EditCoustmerTicket", {
      ticket,
      CancelPermetion,
      BookPermetion,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const EditCoustmerTicket = async (req, res, next) => {
  try {
    const { ticketid } = req.params;
    const { status, cancellationReason, settledAmount, refundAmount } =
      req.body;
    const { name } = req.user;

    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketid },
      include: { CoustmerID: true, GoReservation: true, BackReservation: true },
    });

    if (status == "Cancelled" || status == "Refunded") {
      if (ticket.GoReservation) {
        let GoReservation = await prisma.reservation.findUnique({
          where: { id: ticket.GoReservation.id },
        });

        let SeatsCounter = ticket.seatsCounter;

        const ReservedSeats = Array.isArray(GoReservation.reservedSeats)
          ? GoReservation.reservedSeats.map((route) =>
              parseInt(route.toString())
            )
          : [];

        const TicketSeats = Array.isArray(ticket.seats)
          ? ticket.seats.map((route) => parseInt(route.toString()))
          : [];

        const newSeats = ReservedSeats.filter(
          (num) => !TicketSeats.includes(num)
        );

        if (newSeats.length > 0) {
          await prisma.reservation.update({
            where: { id: GoReservation.id },
            data: {
              reservedSeats_counter:
                GoReservation.reservedSeats_counter - SeatsCounter,
              reservedSeats: newSeats,
            },
          });
        } else {
          await prisma.ticket.update({
            where: { id: ticket.id },
            data: {
              reservation_id: null,
            },
          });

          await prisma.reservation.delete({
            where: { id: ticket.GoReservation.id },
          });
        }
      }

      if (ticket.BackReservation) {
        let BackReservation = await prisma.reservation.findUnique({
          where: { id: ticket.BackReservation.id },
        });

        let SeatsCounter = ticket.Back_seatsCounter;

        const ReservedSeats = Array.isArray(BackReservation.reservedSeats)
          ? BackReservation.reservedSeats.map((route) =>
              parseInt(route.toString())
            )
          : [];

        const TicketSeats = Array.isArray(ticket.Backseats)
          ? ticket.Backseats.map((route) => parseInt(route.toString()))
          : [];

        const newSeats = ReservedSeats.filter(
          (num) => !TicketSeats.includes(num)
        );

        if (newSeats.length > 0) {
          await prisma.reservation.update({
            where: { id: BackReservation.id },
            data: {
              reservedSeats_counter:
                BackReservation.reservedSeats_counter - SeatsCounter,
              reservedSeats: newSeats,
            },
          });
        } else {
          await prisma.ticket.update({
            where: { id: ticket.id },
            data: {
              Backreservation_id: null,
            },
          });

          await prisma.reservation.delete({
            where: { id: ticket.BackReservation.id },
          });
        }
      }
    }

    await prisma.ticket.update({
      where: { id: ticketid },
      data: {
        status: status,
        cancelReason: cancellationReason
          ? cancellationReason
          : ticket.cancelReason,
        settledprice: settledAmount ? +settledAmount : ticket.settledprice,
        refundAmount: refundAmount ? +refundAmount : ticket.refundAmount,
        lastedit: name,
        cancel_id: status === "Cancelled" ? req.user.employeeID : null,
      },
    });

    res.redirect(`/coustmer/${ticket.CoustmerID.id}`);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

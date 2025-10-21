import prisma from "../prisma/prisma.js";

export const ticketMapper = async (Tickets) => {
  const ResultTickets = Tickets.map(async (ticket) => {
    const TripRoutes = Array.isArray(ticket.trip.routes)
      ? ticket.trip.routes.map((route) => route.toString())
      : [];

    let tripRoutes = await Promise.all(
      TripRoutes.map(async (city) => {
        const cityData = await prisma.city.findUnique({
          where: { id: city },
          select: { name: true },
        });
        return cityData ? cityData.name : null;
      })
    );

    let BackTripRoutes;
    let BacktripRoutes;

    if (ticket.Back_trip_id) {
      BackTripRoutes = Array.isArray(ticket.back_trip.routes)
        ? ticket.back_trip.routes.map((route) => route.toString())
        : [];

      BacktripRoutes = await Promise.all(
        BackTripRoutes.map(async (city) => {
          const cityData = await prisma.city.findUnique({
            where: { id: city },
            select: { name: true },
          });
          return cityData ? cityData.name : null;
        })
      );
    }

    return {
      id: ticket.id,
      code: ticket.ticket_code,
      trip_go_id: ticket.trip_id,
      tripBackId: ticket.Back_trip_id,
      trip_date: ticket.trip_date,
      back_trip_date: ticket.Back_trip_date,
      trip_go_route: tripRoutes,
      trip_back_route: BacktripRoutes,
      status: ticket.status,
      paymentmethod: ticket.paymentMethod,
      seatsCounter: ticket.seatsCounter,
      Back_seatsCounter: ticket.Back_seatsCounter,
      seats: ticket.seats,
      Backseats: ticket.Backseats,
      GoStation: ticket.StationRoutes[0],
      BackStation: ticket.StationRoutes[1],
      Back_takeoff: ticket.Back_takeoff,
      price: ticket.price,
      CreatedAt: ticket.CreatedAt
        ? new Date(new Date(ticket.CreatedAt).getTime() + 2 * 60 * 60 * 1000)
            .toISOString()
            .slice(0, 19)
            .replace("T", " ")
        : null,
      voucher: ticket.voucher?.code ?? null,
      BookEmpolyee: ticket.BookEmployeeID?.name ?? null,
      CancellEmployee: ticket.CancelEmployeeID?.name ?? null,
      cancelReason: ticket.cancelReason,
      coustmer_name: ticket.CoustmerID.name,
      coustmer_phone: ticket.CoustmerID.phone,
      settled: ticket.settledprice,
      refundAmount: ticket.refundAmount,
      payId: ticket.pay_id,
    };
  });

  return Promise.all(ResultTickets);
};

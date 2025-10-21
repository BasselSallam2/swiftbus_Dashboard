import prisma from "../prisma/prisma.js";

export const Landing = async (req, res, next) => {



  let totalmoney = 0;
  let numberpassenger;
  let numbertrips;

  let booked_tickes = 0;
  let pending_tickets = 0;
  let cancelled_tickets = 0;
  let total_cash = 0;
  let total_wallet = 0;
  let total_visa = 0;
  let total_sales = 0;
  let percentage = 0;
  let commission = 0;
  let Collected = 0;

  let CancelledTickets = 0;
  let PendingTickets = 0;
  let AbsentTickets = 0;
  let PartialPaidTickets = 0;
  let RefundedTickets = 0;
  let BookedTickets = 0;
  let visaWeb = 0;
  let WalletWeb = 0;
  let cashWeb = 0;
  let visaAgents = 0;
  let WalletAgents = 0;
  let cashAgents = 0;

  const { role, type, employeeID } = req.user;

  if (role.includes("Admin")) {
    const alltickets = await prisma.ticket.findMany();

    alltickets.forEach((ticket) => {
      if (ticket.status === "Booked") BookedTickets += 1;
      if (ticket.status === "Cancelled") CancelledTickets += 1;
      if (ticket.status === "Pending") PendingTickets += 1;
      if (ticket.status === "Absent") AbsentTickets += 1;
      if (ticket.status === "Refunded") RefundedTickets += 1;
      if (ticket.status === "Partial Paid") PartialPaidTickets += 1;

      if (
        !ticket.book_id &&
        (ticket.status == "Booked" || ticket.status == "Absent") &&
        ticket.paymentMethod == "visa"
      )
        visaWeb += ticket.price;
      if (
        ticket.book_id &&
        (ticket.status == "Booked" || ticket.status == "Absent") &&
        ticket.paymentMethod == "visa"
      )
        visaAgents += ticket.price;

      if (
        !ticket.book_id &&
        (ticket.status == "Booked" || ticket.status == "Absent") &&
        ticket.paymentMethod == "cash"
      )
        cashWeb += ticket.price;
      if (
        ticket.book_id &&
        (ticket.status == "Booked" || ticket.status == "Absent") &&
        ticket.paymentMethod == "cash"
      )
        cashAgents += ticket.price;

      if (
        !ticket.book_id &&
        (ticket.status == "Booked" || ticket.status == "Absent") &&
        ticket.paymentMethod == "VFcash"
      )
        WalletWeb += ticket.price;
      if (
        ticket.book_id &&
        (ticket.status == "Booked" || ticket.status == "Absent") &&
        ticket.paymentMethod == "VFcash"
      )
        WalletAgents += ticket.price;
    });

    totalmoney =
      visaWeb + visaAgents + cashWeb + cashAgents + WalletWeb + WalletAgents;

    const trips = await prisma.trip.findMany();
    numbertrips = trips.length;

    const passengers = await prisma.coustmer.findMany();
    numberpassenger = passengers.length;
  }

  if (type == "Agent") {
    const Agent = await prisma.employee.findUnique({
      where: { id: employeeID },
    });

    percentage = Agent.percentage;
    Collected = Agent.setteled;

    const booked = await prisma.ticket.findMany({
      where: { status: "Booked", book_id: employeeID },
    });
    booked_tickes = booked.length;
    const pendning = await prisma.ticket.findMany({
      where: { status: "Pending", book_id: employeeID },
    });
    pending_tickets = pendning.length;
    const canclled = await prisma.ticket.findMany({
      where: { status: { in: ["Cancelled", "Absent"] }, book_id: employeeID },
    });
    cancelled_tickets = canclled.length;

    let bookedmap = booked.map((ticket) => {
      if (ticket.paymentMethod == "cash") total_cash = +ticket.price;
      if (ticket.paymentMethod == "visa") total_visa = +ticket.price;
      if (ticket.paymentMethod == "VFcash") total_wallet = +ticket.price;
    });

    total_sales = total_cash + total_visa + total_wallet;
    commission = total_sales * (Agent.percentage / 100);
  }

  res.render("landing", {
    numberpassenger,
    totalmoney,
    numbertrips,
    booked_tickes,
    pending_tickets,
    cancelled_tickets,
    total_cash,
    total_wallet,
    total_visa,
    total_sales,
    percentage,
    commission,
    Collected,
    CancelledTickets,
    PendingTickets,
    AbsentTickets,
    PartialPaidTickets,
    RefundedTickets,
    BookedTickets,
    visaWeb,
    WalletWeb,
    cashWeb,
    visaAgents,
    WalletAgents,
    cashAgents,
  });
};

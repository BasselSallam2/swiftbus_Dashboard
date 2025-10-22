import { notEqual } from "assert";
import prisma from "../prisma/prisma.js";
import { ticketMapper } from "../util/MyticketsMapper.js";

export const ViewTickets = async (req, res, next) => {
  let TicketsType = "Booked Tickets";
  let user = req.user;
  if (user.role.includes("Admin")) {
    var Tickets = await prisma.ticket.findMany({
      where: {
        status: {
          in: ["Booked"],
        },
      },
      include: {
        voucher: true,
        BookEmployeeID: true,
        CoustmerID: true,
        trip: true,
        back_trip: true,
        CancelEmployeeID: true,
      },
    });
  } else {
    var Tickets = await prisma.ticket.findMany({
      where: {
        status: {
          in: ["Booked"],
        },
        BookEmployeeID: {
          id: user.employeeID,
        },
      },
      include: {
        voucher: true,
        BookEmployeeID: true,
        CoustmerID: true,
        trip: true,
        back_trip: true,
        CancelEmployeeID: true,
      },
    });
  }

  const TicketsMapped = await ticketMapper(Tickets);

  res.render("viewBookedTickets", { tickets: TicketsMapped, TicketsType });
};

export const ViewAllTickets = async (req, res, next) => {
  let TicketsType = "All Tickets";
  let user = req.user;
  if (user.role.includes("Admin")) {
    var Tickets = await prisma.ticket.findMany({
      where: {
        status: { notIn: ["Cancelled"] },
      },
      include: {
        voucher: true,
        BookEmployeeID: true,
        CoustmerID: true,
        trip: true,
        back_trip: true,
        CancelEmployeeID: true,
      },
    });
  }else{
    var Tickets = await prisma.ticket.findMany({
      where: {
        status: { notIn: ["Cancelled"] },
        BookEmployeeID: {
          id: user.employeeID,
        },
      },
      
      include: {
        voucher: true,
        BookEmployeeID: true,
        CoustmerID: true,
        trip: true,
        back_trip: true,
        CancelEmployeeID: true,
      },
    });
  }

  const TicketsMapped = await ticketMapper(Tickets);

  res.render("viewBookedTickets", { tickets: TicketsMapped, TicketsType });
};

export const myTickets = async (req, res, next) => {
  const user = req.user;

  let TicketsType = "All Tickets";
  const Tickets = await prisma.ticket.findMany({
    where: {
      status: { notIn: ["Cancelled"] },
      OR: [{ BookEmployeeID: { id: user.employeeID } }],
    },
    include: {
      voucher: true,
      BookEmployeeID: true,
      CoustmerID: true,
      trip: true,
      back_trip: true,
      CancelEmployeeID: true,
    },
  });

  const TicketsMapped = await ticketMapper(Tickets);

  res.render("viewBookedTickets", { tickets: TicketsMapped, TicketsType });
};

export const ViewCancelTickets = async (req, res, next) => {
  let TicketsType = "Cancelled Tickets";
  let user = req.user;
  if(user.role.includes("Admin")){
  
  var Tickets = await prisma.ticket.findMany({
    where: {
      status: {
        in: ["Cancelled"],
      },
    },
    include: {
      voucher: true,
      BookEmployeeID: true,
      CoustmerID: true,
      trip: true,
      back_trip: true,
      CancelEmployeeID: true,
    },
  });
}else {
  var Tickets = await prisma.ticket.findMany({
    where: {
      status: {
        in: ["Cancelled"],
      },
      BookEmployeeID: {
        id: user.employeeID,
      },
    },
    include: {
      voucher: true,
      BookEmployeeID: true,
      CoustmerID: true,
      trip: true,
      back_trip: true,
      CancelEmployeeID: true,
    },
  });
}

  const TicketsMapped = await ticketMapper(Tickets);

  res.render("viewBookedTickets", { tickets: TicketsMapped, TicketsType });
};

export const viewRefundedTickets = async (req, res, next) => {
  let TicketsType = "Refunded Tickets";
  let user = req.user;
  if(user.role.includes("Admin")){
  var Tickets = await prisma.ticket.findMany({
    where: {
      status: {
        in: ["Refunded"],
      },
    },
    include: {
      voucher: true,
      BookEmployeeID: true,
      CoustmerID: true,
      trip: true,
      back_trip: true,
      CancelEmployeeID: true,
    },
  });
}else{
  var Tickets = await prisma.ticket.findMany({
    where: {
      status: {
        in: ["Refunded"],
      },
      BookEmployeeID: {
        id: user.employeeID,
      },
    },
    include: {
      voucher: true,
      BookEmployeeID: true,
      CoustmerID: true,
      trip: true,
      back_trip: true,
      CancelEmployeeID: true,
    },
  });
}

  const TicketsMapped = await ticketMapper(Tickets);

  res.render("viewBookedTickets", { tickets: TicketsMapped, TicketsType });
};

export const viewAbsentTickets = async (req, res, next) => {
  let TicketsType = "Absent Tickets";
  let user = req.user;
  if(user.role.includes("Admin")){
  var Tickets = await prisma.ticket.findMany({
    where: {
      status: {
        in: ["Absent"],
      },
    },
    include: {
      voucher: true,
      BookEmployeeID: true,
      CoustmerID: true,
      trip: true,
      back_trip: true,
      CancelEmployeeID: true,
    },
  });
}else{
  var Tickets = await prisma.ticket.findMany({
    where: {
      status: {
        in: ["Absent"],
      },
      BookEmployeeID: {
        id: user.employeeID,
      },
    },
    include: {
      voucher: true,
      BookEmployeeID: true,
      CoustmerID: true,
      trip: true,
      back_trip: true,
      CancelEmployeeID: true,
    },
  });
}

  const TicketsMapped = await ticketMapper(Tickets);

  res.render("viewBookedTickets", { tickets: TicketsMapped, TicketsType });
};

export const viewPendingTickets = async (req, res, next) => {
  let TicketsType = "Pending Tickets";
  let user = req.user;
  if(user.role.includes("Admin")){
  var Tickets = await prisma.ticket.findMany({
    where: {
      status: {
        in: ["Pending"],
      },
    },
    include: {
      voucher: true,
      BookEmployeeID: true,
      CoustmerID: true,
      trip: true,
      back_trip: true,
      CancelEmployeeID: true,
    },
  });
}else{
  var Tickets = await prisma.ticket.findMany({
    where: {
      status: {
        in: ["Pending"],
      },
      BookEmployeeID: {
        id: user.employeeID,
      },
    },
    include: {
      voucher: true,
      BookEmployeeID: true,
      CoustmerID: true,
      trip: true,
      back_trip: true,
      CancelEmployeeID: true,
    },
  });
}

  const TicketsMapped = await ticketMapper(Tickets);

  res.render("viewBookedTickets", { tickets: TicketsMapped, TicketsType });
};

// export const cancellTicket = async (req, res, next) => {
//     try {
//     const { ticketID } = req.params;
//     let { id, role } = req.user;
//     let { cancelreason } = req.body;

// //   let id = "138c87d0-7270-44f5-91a9-859e9dcad525" ;
// //   let role = ["Book" , "Cancel"] ;
// //   let cancelreason = "DODO" ;

//   if (role.includes("Cancel")) {
//     const Ticket = await prisma.ticket.update({
//       where: { id: ticketID },
//       include: { GoReservation: true, BackReservation: true },
//       data: { status: "Cancelled", cancelReason: cancelreason, cancel_id: id },
//     });

//     let seatsArray = Array.isArray(Ticket.GoReservation.reservedSeats)
//       ? [...Ticket.GoReservation.reservedSeats]
//       : [];

//       let Ticketseats = Array.isArray(Ticket.seats)
//       ? [...Ticket.seats]
//       : [];

//       let newseats = seatsArray.filter(seat => !Ticketseats.includes(seat));

//     const GoReservation = await prisma.reservation.update({
//       where: { id: Ticket.GoReservation.id },
//       data: {
//         reservedSeats_counter: { decrement: Ticket.seatsCounter }, reservedSeats : newseats
//       },
//     });

//     if(Ticket.BackReservation && Ticket.BackReservation.id.length > 0) {

//         let BackseatsArray = Array.isArray(Ticket.BackReservation.reservedSeats)
//       ? [...Ticket.BackReservation.reservedSeats]
//       : [];

//       let BackTicketseats = Array.isArray(Ticket.Backseats)
//       ? [...Ticket.Backseats]
//       : [];

//       let Backnewseats = BackseatsArray.filter(seat => !BackTicketseats.includes(seat));

//     const BackReservation = await prisma.reservation.update({
//       where: { id: Ticket.BackReservation.id },
//       data: {
//         reservedSeats_counter: { decrement: Ticket.Back_seatsCounter }, reservedSeats : Backnewseats
//       },
//     });

//     }

//   }
//   res.send("Success") ;
// }
// catch(error) {
//     console.log(error) ;
//     next(error);
// }
// };

// export const refundTicket = async (req, res, next) => {
//     try {
//         const { ticketID } = req.params;
//         const updateTicket = await prisma.ticket.update({where : {id:ticketID} , data : {status : "Refunded"}}) ;
//     }
//     catch(error) {
//         console.log(error) ;
//         next(error) ;
//     }

// };

// export const absentTicket = async (req, res, next) => {
//     try {
//         const { ticketID } = req.params;
//         const updateTicket = await prisma.ticket.update({where : {id:ticketID} , data : {status : "Absent"}}) ;
//     }
//     catch(error) {
//         next(error) ;
//     }
// };

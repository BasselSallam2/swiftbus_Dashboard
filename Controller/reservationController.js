import prisma from "../prisma/prisma.js";
import fs from "fs";

import { name } from "ejs";

import path from "path";
import { fileURLToPath } from "url";
import PDFDocument from "pdfkit";
import {
  generateTicketTableEXCEl,
  generateTicketTablePDF,
  generateTicketTablePDFAgent
} from "../util/service/Reservationprint.js";
import {
  ticketMapper,
  ticketMapperBack,
} from "../util/service/TicketMapper.js";

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

export const Viewreservations = async (req, res, next) => {
  try {
    const user = req.user;
    const isAdmin = user.role.includes("Admin");
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

    res.render("viewreservation", {
      reservations: MappedReservations,
      isAdmin,
    });
  } catch (error) {
    next(error);
  }
};

export const PrintReservation = async (req, res, next) => {
  const { ID } = req.params;
  try {
    // --- استعلام واحد شامل ومُحسَّن ---
    const reservation = await prisma.reservation.findUnique({
      where: { id: ID },
      include: {
        Trips: {
          include: {
            Bus: true,
            StationDetails: true,
          },
        },
        // استخدام الأسماء الصحيحة كما هي في schema.prisma
        Gotickets: {
          where: { status: { not: "Cancelled" } },
          include: { CoustmerID: true, BookEmployeeID: true },
        },
        Backtickets: {
          where: { status: { not: "Cancelled" } },
          include: { CoustmerID: true, BookEmployeeID: true },
        },
      },
    });

    // التأكد من وجود الحجز والرحلة قبل المتابعة
    if (!reservation || !reservation.Trips) {
      return res.status(404).json({ message: "Reservation not found." });
    }

    // استخلاص البيانات من الكائن المدمج وتحديث أسماء المتغيرات
    const { Trips, Gotickets, Backtickets } = reservation;
    const bustype = Trips.Bus.type;
    const TripDate = reservation.trip_date;

    // فرز تفاصيل المحطات
    const tripDetails = Trips.StationDetails.sort(
      (a, b) => parseTime12h(a.arrivaleTime) - parseTime12h(b.arrivaleTime)
    );
    const tripTime = [
      tripDetails[0]?.arrivaleTime, // استخدام optional chaining لتجنب الأخطاء
      tripDetails[tripDetails.length - 1]?.arrivaleTime,
    ];

    // جلب أسماء المدن لمسار الرحلة
    const TripRouteArray = Array.isArray(Trips.routes)
      ? Trips.routes
      : Object.values(Trips.routes || {});

    let TripRoute = [];
    if (TripRouteArray.length > 0) {
      const cities = await prisma.city.findMany({
        where: { id: { in: TripRouteArray } },
        select: { id: true, Arabicname: true },
      });
      const cityMap = Object.fromEntries(
        cities.map((c) => [c.id, c.Arabicname])
      );
      TripRoute = TripRouteArray.map((id) => cityMap[id] || id);
    }

    // افترض وجود هذه الدوال لديك
    // Assuming these functions exist and are defined elsewhere in your project
    const ResultGo = await ticketMapper(Gotickets);
    const ResultBack = await ticketMapperBack(Backtickets);

    // إنشاء وإرسال ملف PDF
    generateTicketTableEXCEl(
      ResultGo,
      ResultBack,
      bustype,
      TripDate,
      TripRoute,
      tripTime,
      res
    );
  } catch (error) {
    // إرسال الخطأ إلى معالج الأخطاء في Express
    next(error);
  }
};

export const PrintReservationPDF = async (req, res, next) => {
  const { ID } = req.params;
  const user = req.user;
  try {
    if (user.role.includes("Admin")) {
      var reservation = await prisma.reservation.findUnique({
        where: { id: ID },
        include: {
          Trips: {
            include: {
              Bus: true,
              StationDetails: true,
            },
          },
          // استخدام الأسماء الصحيحة كما هي في schema.prisma
          Gotickets: {
            where: { status: { not: "Cancelled" } },
            include: { CoustmerID: true, BookEmployeeID: true },
          },
          Backtickets: {
            where: { status: { not: "Cancelled" } },
            include: { CoustmerID: true, BookEmployeeID: true },
          },
        },
      });
    } else {
      var reservation = await prisma.reservation.findUnique({
        where: { id: ID },
        include: {
          Trips: {
            include: {
              Bus: true,
              StationDetails: true,
            },
          },
          // استخدام الأسماء الصحيحة كما هي في schema.prisma
          Gotickets: {
            where: { status: { not: "Cancelled" }, book_id: user.employeeID },
            include: { CoustmerID: true, BookEmployeeID: true },
          },
          Backtickets: {
            where: { status: { not: "Cancelled" }, book_id: user.employeeID },
            include: { CoustmerID: true, BookEmployeeID: true },
          },
        },
      });
    }

    

    // التأكد من وجود الحجز والرحلة قبل المتابعة
    if (!reservation || !reservation.Trips) {
      return res.status(404).json({ message: "Reservation not found." });
    }

    // استخلاص البيانات من الكائن المدمج وتحديث أسماء المتغيرات
    const { Trips, Gotickets, Backtickets } = reservation;
    const bustype = Trips.Bus.type;
    const TripDate = reservation.trip_date;

    // فرز تفاصيل المحطات
    const tripDetails = Trips.StationDetails.sort(
      (a, b) => parseTime12h(a.arrivaleTime) - parseTime12h(b.arrivaleTime)
    );
    const tripTime = [
      tripDetails[0]?.arrivaleTime, // استخدام optional chaining لتجنب الأخطاء
      tripDetails[tripDetails.length - 1]?.arrivaleTime,
    ];

    // جلب أسماء المدن لمسار الرحلة
    const TripRouteArray = Array.isArray(Trips.routes)
      ? Trips.routes
      : Object.values(Trips.routes || {});

    let TripRoute = [];
    if (TripRouteArray.length > 0) {
      const cities = await prisma.city.findMany({
        where: { id: { in: TripRouteArray } },
        select: { id: true, Arabicname: true },
      });
      const cityMap = Object.fromEntries(
        cities.map((c) => [c.id, c.Arabicname])
      );
      TripRoute = TripRouteArray.map((id) => cityMap[id] || id);
    }

    // افترض وجود هذه الدوال لديك
    // Assuming these functions exist and are defined elsewhere in your project
    const ResultGo = await ticketMapper(Gotickets);
    const ResultBack = await ticketMapperBack(Backtickets);

    if(user.role.includes("Admin")){
      
      await generateTicketTablePDF(
        ResultGo,
        ResultBack,
        bustype,
        TripDate,
        TripRoute,
        tripTime,
        res
      );
    }else{
      const agentPercentage = reservation.Gotickets[0].BookEmployeeID.percentage || reservation.Backtickets[0].BookEmployeeID.percentage ;
      await generateTicketTablePDFAgent(
        ResultGo,
        ResultBack,
        bustype,
        TripDate,
        TripRoute,
        tripTime,
        agentPercentage,
        res
      );
    }
  } catch (error) {
    // إرسال الخطأ إلى معالج الأخطاء في Express
    next(error);
  }
};

export const sendDriverPhone = async (req, res, next) => {
  const { ID } = req.params;
  const { driverPhone } = req.body;
  const user = req.user;
  try {
    console.log(driverPhone);
    console.log(req.body);
    var reservation = await prisma.reservation.findUnique({
      where: { id: ID },
      include: {
        Trips: {
          include: {
            Bus: true,
            StationDetails: true,
          },
        },
        // استخدام الأسماء الصحيحة كما هي في schema.prisma
        Gotickets: {
          where: { status: { not: "Cancelled" } },
          include: { CoustmerID: true, BookEmployeeID: true },
        },
        Backtickets: {
          where: { status: { not: "Cancelled" } },
          include: { CoustmerID: true, BookEmployeeID: true },
        },
      },
    });

    // التأكد من وجود الحجز والرحلة قبل المتابعة
    if (!reservation || !reservation.Trips) {
      return res.status(404).json({ message: "Reservation not found." });
    }
    let customersPhone = [];
    for (let i = 0; i < reservation.Gotickets.length; i++) {
      customersPhone.push(reservation.Gotickets[i].CoustmerID.phone);
    }
    for (let i = 0; i < reservation.Backtickets.length; i++) {
      customersPhone.push(reservation.Backtickets[i].CoustmerID.phone);
    }
    const whatsapp = await prisma.whatsapp.findFirst();
    for (let i = 0; i < customersPhone.length; i++) {
      let data = {
        client_id: `${whatsapp.client}`,
        mobile: `+2${customersPhone[i]}`,
        text: `نشكركم علي الحجز معانا شركة سويفت باص
 ${driverPhone} رقم السائق
الاتصال فقط في حالة تأخره عن الميعاد
رحلة سعيدة وآمنه`
      };

      const whatsappMSG = await fetch(
        "https://v2.whats360.live/api/user/v2/send_message",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${whatsapp.token}`,
          },
          body: JSON.stringify(data),
        }
      );
    }

    res.status(200).json({ message: "Driver phone sent successfully." });
    
  } catch (error) {
   res.staus(500).json({ message: "Failed to send driver phone." });
    next(error);
  }
};

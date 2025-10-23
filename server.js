import express from "express"
import http from "http";
import 'dotenv/config';
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";
import prisma from "./prisma/prisma.js";
import  cookieParser from  'cookie-parser' ;



import cityRouter from "./routers/cityRouter.js"
import reservationRouter from "./routers/reservationRouter.js"
import TicketRouter from "./routers/ticketRouter.js"
import CoustmerRouter from "./routers/coustmerRouter.js"
import VoucherRouter from "./routers/voucherRouter.js"
import FrontRouter  from "./routers/frontRouter.js"
import AuthRouter from "./routers/authRouter.js"
import LandingRouter from "./routers/landingRouter.js"
import StationRouter from "./routers/stationRouter.js"
import coustmerRouter from "./routers/coustmerRouter.js"
import employeeRouter from "./routers/EmployeeRouter.js"
import tripsRouter from "./routers/tripRouter.js"
import bookRouter from "./routers/bookRouter.js"
import WhatsRouter from "./routers/whatsRouter.js"
const app = express() ;




const __dirname = process.cwd();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use("/city" , express.static(path.join(__dirname, 'public')));
app.use("/station" , express.static(path.join(__dirname, 'public')));
app.use("/voucher" , express.static(path.join(__dirname, 'public')));
app.use("/coustmer" , express.static(path.join(__dirname, 'public')));
app.use("/employee" , express.static(path.join(__dirname, 'public')));
app.use("/employee/money" , express.static(path.join(__dirname, 'public')));
app.use("/employee/ticket" , express.static(path.join(__dirname, 'public')));
app.use("/coustmer/ticket" , express.static(path.join(__dirname, 'public')));
app.use("/whats" , express.static(path.join(__dirname, 'public')));
app.use("/whats/edit" , express.static(path.join(__dirname, 'public')));
app.use("/ticket" , express.static(path.join(__dirname, 'public')));
app.use("/trip" , express.static(path.join(__dirname, 'public')));
app.use("/trip/ticket" , express.static(path.join(__dirname, 'public')));
app.use("/ticket/booked" , express.static(path.join(__dirname, 'public')));
app.use("/book" , express.static(path.join(__dirname, 'public')));
app.use("/coustmer/edit" , express.static(path.join(__dirname, 'public')));
app.set("views", path.join(__dirname, "views"));
app.set('view engine', 'ejs');




app.use(LandingRouter) ;
app.use(AuthRouter) ;
app.use(cityRouter) ;
app.use(reservationRouter) ;
app.use(TicketRouter) ;
app.use(CoustmerRouter) ;
app.use(VoucherRouter) ;
app.use(FrontRouter) ;
app.use(StationRouter) ;
app.use(coustmerRouter) ;
app.use(employeeRouter) ;
app.use(tripsRouter) ;
app.use(bookRouter) ;
app.use(WhatsRouter) ;










const PORT = process.env.PORT || 3000;
const server = http.createServer(app);
server.listen(PORT, () => {
	
});

process.on("unhandledRejection", (err) => {
	server.close(() => process.exit(1));
});

process.on("uncaughtException", (err) => {
	server.close(() => process.exit(1));
});

import express from "express"
const router = express.Router();
import {Viewreservations , PrintReservation , PrintReservationPDF} from "../Controller/reservationController.js"
import {authMiddleware} from "../middleware/Authmiddleware.js"


router.use(authMiddleware) ;

router.get("/reservation" , Viewreservations) ;
router.get("/reservation/print/:ID" , PrintReservation) ;
router.get("/reservation/print/pdf/:ID" , PrintReservationPDF) ;

export default router ;
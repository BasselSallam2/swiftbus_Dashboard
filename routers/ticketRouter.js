import express from "express"
const router = express.Router();
import { ViewTickets, ViewCancelTickets, viewRefundedTickets,  viewAbsentTickets , viewPendingTickets, ViewAllTickets, myTickets } from "../Controller/ticketController.js"
import {authMiddleware} from "../middleware/Authmiddleware.js"


router.use(authMiddleware) ;

router.get("/ticket/booked" , ViewTickets) ;
router.get("/ticket/absent" , viewAbsentTickets) ;
router.get("/ticket/cancelled" , ViewCancelTickets) ;
router.get("/ticket/refunded" , viewRefundedTickets) ;
router.get("/ticket/pending" , viewPendingTickets );
router.get("/ticket/all" , ViewAllTickets) ;
router.get("/ticket/all" , ViewAllTickets) ;
router.get("/ticket/my" , myTickets) ;


export default router ;

//Booked , pending cash , cancelled , refunded , absent 
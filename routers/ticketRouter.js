import express from "express"
const router = express.Router();
import { ViewTickets, ViewCancelTickets, viewRefundedTickets,  viewAbsentTickets , viewPendingTickets  } from "../Controller/ticketController.js"
import {authMiddleware} from "../middleware/Authmiddleware.js"


router.use(authMiddleware) ;

router.get("/ticket/booked" , ViewTickets) ;
router.get("/ticket/absent" , viewAbsentTickets) ;
router.get("/ticket/cancelled" , ViewCancelTickets) ;
router.get("/ticket/refunded" , viewRefundedTickets) ;
router.get("/ticket/pending" , viewPendingTickets )


export default router ;

//Booked , pending cash , cancelled , refunded , absent 
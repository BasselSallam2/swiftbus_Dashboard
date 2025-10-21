import express from "express"
const router = express.Router();
import {CoustmerTicket , GetCoustmers , EditCoustmerTicket , EditCoustmerTicketForm , GetCoustmerEditForm , EditCoustmer} from "../Controller/coustmerController.js"
import {authMiddleware} from "../middleware/Authmiddleware.js"


router.use(authMiddleware) ;


router.get("/coustmer" , GetCoustmers) ;
router.get("/coustmer/:coustmerid" , CoustmerTicket) ;
router.get("/coustmer/ticket/:ticketid" , EditCoustmerTicketForm) ;
router.post("/coustmer/ticket/:ticketid" , EditCoustmerTicket) ;
router.get("/coustmer/edit/:customerid" , GetCoustmerEditForm) ;
router.post("/coustmer/edit/:customerid" , EditCoustmer ) ;



export default  router ;
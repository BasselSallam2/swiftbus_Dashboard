import express from "express"
const router = express.Router();

import {authMiddleware} from "../middleware/Authmiddleware.js"
import {ViewBookpage , Searchresult , SelectSingleTrip , SelectdoubleTrip , paymobPay, doublepaymobPay}   from "../Controller/bookController.js"

router.use(authMiddleware) ;

router.get("/book" , ViewBookpage) ;
router.post("/submit-booking" , Searchresult) ;
router.post("/selectsingletrip" , SelectSingleTrip);
router.post("/selectdoubletrip" , SelectdoubleTrip);

router.post("/payment" , paymobPay) ;
router.post("/doublepayment" , doublepaymobPay) ;

export default router ;
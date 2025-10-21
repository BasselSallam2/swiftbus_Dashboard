import express from "express"
const router = express.Router();
import { VouchercreateForm, CreateVoucher, Viewvouchers, deleteVoucher, EditVoucherForm, EditVoucher } from "../Controller/voucherController.js"
import {authMiddleware} from "../middleware/Authmiddleware.js"


router.use(authMiddleware) ;


router.get("/voucher" , Viewvouchers ) ;
router.get("/voucher/create" , VouchercreateForm ) ;
router.post("/voucher" , CreateVoucher ) ;
router.get("/voucher/:voucherid" , EditVoucherForm ) ;
router.post("/voucher/:voucherid" , EditVoucher ) ;
router.get("/voucher/delete/:voucherid" , deleteVoucher) ;


export default router ;
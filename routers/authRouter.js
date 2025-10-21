import express from "express"
const router = express.Router();
import {authMiddleware} from "../middleware/Authmiddleware.js"
import {loginPage , login , signout} from "../Controller/authController.js"


router.get("/login" , loginPage) ;
router.post("/login" , login) ;
router.get("/signout" , authMiddleware ,  signout ) ;

export default  router ;
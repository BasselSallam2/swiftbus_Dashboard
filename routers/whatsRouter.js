import express from "express"
const router = express.Router();
import { viewWhats , EditWhats , Editwhatsform , viewAds , sendBroadcast } from "../Controller/whatsController.js";
import {authMiddleware} from "../middleware/Authmiddleware.js"


router.use(authMiddleware) ;

router.get("/whats" , viewWhats) ;
router.get("/whats/ads" , viewAds) ;
router.get("/whats/:whatsID" , Editwhatsform) ;
router.post("/whats/:whatsID" , EditWhats) ;
router.post("/whats/ads/send" , sendBroadcast) ;




export default  router ;
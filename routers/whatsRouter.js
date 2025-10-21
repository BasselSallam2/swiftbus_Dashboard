import express from "express"
const router = express.Router();
import { viewWhats , EditWhats , Editwhatsform  } from "../Controller/whatsController.js";
import {authMiddleware} from "../middleware/Authmiddleware.js"


router.use(authMiddleware) ;

router.get("/whats" , viewWhats) ;
router.get("/whats/:whatsID" , Editwhatsform) ;
router.post("/whats/:whatsID" , EditWhats) ;




export default  router ;
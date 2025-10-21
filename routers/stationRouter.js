import express from "express"
const router = express.Router();
import { CreateForm , CreateStation , ViewStation , EditStation , Editstationform , DeleteSation } from "../Controller/StationController.js";
import {authMiddleware} from "../middleware/Authmiddleware.js"


router.use(authMiddleware) ;

router.get("/stationcreate" ,CreateForm) ;
router.post("/station" ,CreateStation) ;
router.get("/station" , ViewStation) ;
router.get("/station/:stationID" , Editstationform) ;
router.post("/station/:stationID" , EditStation) ;
router.get("/station/delete/:stationID" , DeleteSation) ;




export default  router ;
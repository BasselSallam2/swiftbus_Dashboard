import express from "express"
const router = express.Router();
import { CreateForm ,CreateCity , ViewCity , EditCity , Editcityform , DeleteCity ,  } from "../Controller/cityController.js";
import {authMiddleware} from "../middleware/Authmiddleware.js"


router.use(authMiddleware) ;

router.get("/citycreate" ,CreateForm) ;
router.post("/city" ,CreateCity) ;
router.get("/city" , ViewCity) ;
router.get("/city/:cityID" , Editcityform) ;
router.post("/city/:cityID" , EditCity) ;
router.get("/city/delete/:cityID" , DeleteCity) ;




export default  router ;
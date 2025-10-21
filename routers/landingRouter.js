import express from "express"
const router = express.Router();
import {Landing} from "../Controller/landingController.js"
import { authMiddleware } from "../middleware/Authmiddleware.js"



router.get("/" , authMiddleware , Landing) ;



export default router ;
import express from "express";
const router = express.Router();
import {
  info,
  instructions,
  questions,
  section1,
  section2,
  section3,
  section4,
  section5,
  editinfo,
  editinstructions,
  editquestions,
  editsection1,
  editsection2,
  editsection3,
  editsection4,
  editsection5,
} from "../Controller/frontController.js";
import {authMiddleware} from "../middleware/Authmiddleware.js"


router.use(authMiddleware) ;
router.get("/info"  , info);
router.get("/instructions" , instructions);
router.get("/questions" , questions);
router.get("/section1" , section1);
router.get("/section2" , section2);
router.get("/section3" , section3);
router.get("/section4" , section4);
router.get("/section5" , section5);
router.post("/info" , editinfo);
router.post("/instructions" , editinstructions);
router.post("/questions" , editquestions);
router.post("/section1" , editsection1);
router.post("/section2" , editsection2);
router.post("/section3" , editsection3);
router.post("/section4" , editsection4);
router.post("/section5" , editsection5);

export default router;

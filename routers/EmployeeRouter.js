import express from "express"
const router = express.Router();
import {ViewEmployee , ViewEmployeeCreate , CreateEmployee , EditEmployeeForm , EditEmployee , DeleteEmployee , ViewAgentMoney , SettleAgent , ViewEmployeeTicket} from "../Controller/EmployeeController.js"
import {authMiddleware} from "../middleware/Authmiddleware.js"

router.use(authMiddleware) ;

router.get("/employee", ViewEmployee);  
router.get("/employeecreate" , ViewEmployeeCreate) ;
router.post("/employee" , CreateEmployee)
router.get("/employee/delete/:ID" , DeleteEmployee ) ;
router.get("/employee/:ID" , EditEmployeeForm) ;
router.get("/employee/ticket/:ID" , ViewEmployeeTicket) ;
router.post("/employee/:ID" , EditEmployee) ;
router.get("/employee/money/:ID" , ViewAgentMoney) ;
router.post("/agent/:ID/settle" , SettleAgent) ;

export default  router ;
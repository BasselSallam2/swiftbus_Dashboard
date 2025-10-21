import express from "express"
const router = express.Router();
import { createUserForm, createUser, DeleteUser, editUser, viewuser } from "../Controller/userController.js"
import {authMiddleware} from "../middleware/Authmiddleware.js"


router.use(authMiddleware) ;

router.get('/createUserForm', createUserForm);
router.post('/createUser', createUser);
router.delete('/deleteUser/:UserID', DeleteUser);
router.put('/editUser/:UserID', editUser);
router.get('/viewUser', viewuser);


export default router ;
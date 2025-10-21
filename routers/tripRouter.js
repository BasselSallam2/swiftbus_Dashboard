import express from "express"
const router = express.Router();

import {authMiddleware} from "../middleware/Authmiddleware.js"

import {ViewTrips , AddTripsForm ,AddTrips , EditTripform , editTrip , deletetrip , ViewTickets} from "../Controller/tripController.js"
router.use(authMiddleware) ;

router.get("/trip" , ViewTrips) ;
router.get("/tripcreate" , AddTripsForm) ;
router.get("/trip/:ID/delete" , deletetrip) ;
router.get("/trip/:ID" , EditTripform) ;

router.post("/trip" , AddTrips) ;
router.post("/trip/:ID" , editTrip) ;

router.get("/trip/ticket/:ID" , ViewTickets) ;

export default  router ;
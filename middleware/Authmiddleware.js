import prisma from '../prisma/prisma.js';
import 'dotenv/config';
import jwt from "jsonwebtoken"


export const authMiddleware = (req, res, next) => {
    const token = req.cookies.token || req.header("Authorization")?.split(" ")[1];

    if (!token) {
        return res.redirect("/login") ;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        res.locals.currentUser = req.user; 
        next();
    } catch (error) {
        next(error) ;
    }
};
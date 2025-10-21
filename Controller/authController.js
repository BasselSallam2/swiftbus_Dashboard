import prisma from '../prisma/prisma.js';
import 'dotenv/config';
import jwt from "jsonwebtoken"
export const loginPage = async (req, res, next) => {
    res.render("login", { errorMessage: null });
}

export const login = async (req, res, next) => {
    try {
        let { email, password } = req.body;
        email = email.toLowerCase();
        let errorMessage = null;

        const user = await prisma.user.findFirst({ where: { email: email, password: password }, include: { Employee: true } });

        if (!user) {
            errorMessage = "Email or Password are not correct";
            return res.render("login", { errorMessage });
        }

        const token = jwt.sign({ id: user.id, email: user.email, role: user.role, name: user.Employee.name , employeeID:user.Employee.id , type: user.Employee.type}, process.env.JWT_SECRET);
        res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production" });

        res.redirect("/");
    } catch (error) {
        next(error);
    }
}

export const signout = async (req, res, next) => {
    try {
        res.clearCookie("token");
        res.redirect("/login");
    } catch (error) {
        next(error);
    }
}
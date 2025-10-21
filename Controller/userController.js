import prisma from "../prisma/prisma.js";
import { name } from "ejs";

export const createUserForm = async (req, res, next) => {
  // res.render() ; user form
};

export const createUser = async (req, res, next) => {
  const {
    type,
    name,
    phone,
    nationalid,
    address,
    percentage,
    email,
    password,
    role,
  } = req.body;

  const newUser = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      password: password,
      role: role,
    },
  });

  const Newemployee = await prisma.employee.create({
    data: {
      type: type,
      name: name,
      phone: phone,
      address: address,
      nationalid: nationalid || null,
      percentage: percentage || null,
    },
  });
};

export const DeleteUser = async (req, res, next) => {
  const { UserID } = req.params;
  const { id, Role } = req.user;
  const now = new Date();

  if (Role.includes("Admin")) {
    const employee = await prisma.employee.update({
      where: { id: UserID },
      data: { isDeleted: true },
    });
  }

  // res.redirect() ;
};

export const editUser = async (req, res, next) => {
  const { UserID } = req.params;
  const { id, Role } = req.user;
  const {
    type,
    name,
    phone,
    nationalid,
    address,
    percentage,
    email,
    password,
    role,
  } = req.body;

  const EditUser = await prisma.employee.update({
    where: { id: UserID },
    data: {
      type: type,
      name: name,
      phone: phone,
      address: address,
      percentage: percentage || null,
      nationalid: nationalid || null,
      User: {
        update: {
          email: email,
          password: password,
          role: role,
        },
      },
    },
  });

  // res.redirect() ;
};

export const viewuser = async (req, res, next) => {
  const user = await prisma.employee.findMany({
    where: { isDeleted: false },
    include: { User: true },
  });
  // res.render() ;
};

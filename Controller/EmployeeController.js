import prisma from "../prisma/prisma.js";

import { AgentMapper } from "../util/service/AgentMapper.js";

export const ViewEmployee = async (req, res, next) => {
  try {
    const Employees = await prisma.employee.findMany({
      include: { User: true },
      where: { isDeleted: false },
    });
    res.render("viewEmployee", { Employees });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const ViewEmployeeCreate = async (req, res, next) => {
  try {
    let employee = { User: { role: [] } };
    const stations = await prisma.station.findMany({where : {isDeleted : false}});
    res.render("CreateEmpolyee", { employee , stations });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const CreateEmployee = async (req, res, next) => {
  const {
    name,
    phone,
    type,
    nationalID,
    address,
    email,
    password,
    role,
    percentage,
    stations
  } = req.body;
  console.log(req.body);
  try {
    let formatedRole = role.split(",");
    let stationsArray = stations.split(",");

    const employee = await prisma.employee.create({
      data: {
      name: name,
      phone: phone,
      type: type,
      nationalid: nationalID,
      address: address,
      percentage: percentage ? +percentage : null,
      allowedRoutes: stationsArray,
      User: {
        create: { email: email.toLowerCase(), password: password, role: formatedRole },
      },
      },
    });

    res.redirect("/employee");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const EditEmployeeForm = async (req, res, next) => {
  const { ID } = req.params;
   const stations = await prisma.station.findMany({where : {isDeleted : false}});
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: ID },
      include: { User: true },
    });

    res.render("CreateEmpolyee", { employee , stations });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const EditEmployee = async (req, res, next) => {
  const {
    name,
    phone,
    type,
    nationalID,
    address,
    email,
    password,
    role,
    percentage,
    stations
  } = req.body;
  const { ID } = req.params;
  try {
    let formatedRole = role.split(",");
    let stationsArray = stations.split(",");

    const employee = await prisma.employee.update({
      where: { id: ID },
      data: {
        name: name,
        phone: phone,
        type: type,
        nationalid: nationalID,
        address: address,
        allowedRoutes: stationsArray,
        percentage: percentage ? +percentage : null,
        User: {
          update: { email: email.toLowerCase() , password: password, role: formatedRole },
        },
      },
    });
    res.redirect("/employee");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const DeleteEmployee = async (req, res, next) => {
  const { ID } = req.params;
  try {
    const employee = await prisma.employee.update({
      where: { id: ID },
      data: { isDeleted: true },
    });
    res.redirect("/employee");
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const ViewAgentMoney = async (req, res, next) => {
  const { ID } = req.params;
  try {
    const Agent = await prisma.employee.findUnique({
      where: { id: ID },
      include: { User: true, tickets_id: { include: { CoustmerID: true , CancelEmployeeID : true } } },
    });

    const AgentData = await AgentMapper(Agent);
    // console.log(AgentData);
    res.render("viewAgentMoney", { Agent: AgentData });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const SettleAgent = async (req, res, next) => {
  const { ID } = req.params;
  const { settleAmount } = req.body;
  try {
    const Agent = await prisma.employee.findUnique({ where: { id: ID } });

    await prisma.employee.update({
      where: { id: ID },
      data: { setteled: Agent.setteled + +settleAmount },
    });
    res.redirect(`/employee/money/${ID}`);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const ViewEmployeeTicket = async (req, res, next) => {
  const { ID } = req.params;

  try {

    const Employee = await prisma.employee.findUnique({
      where: { id: ID },
      include: {
        tickets_id: { include: { CoustmerID: true  , voucher: true , CancelEmployeeID:true , BookEmployeeID:true} },
        cancelTickets: { include: { CoustmerID: true , voucher : true , BookEmployeeID:true , CancelEmployeeID:true } },
      },
    });

    // console.log(Employee);

    res.render("viewEmployeeTicket", { Employee });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

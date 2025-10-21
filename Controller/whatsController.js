
import prisma from "../prisma/prisma.js";

export const viewWhats = async (req, res, next) => {
  const whats =  await prisma.whatsapp.findFirst();
  res.render("viewWhats", { whats });
};

export const EditWhats = async (req, res, next) => {
  let { whatsID } = req.params;
  let { token, client } =
    req.body;

    console.log(req.body) ;

  try {
    const whats = await prisma.whatsapp.update({where: {id: whatsID} , data: {token , client}});
    res.redirect("/whats");  
  } catch (error) {
    next(error);
  }
};

export const Editwhatsform = async (req, res, next) => {
  let { whatsID } = req.params;

  try {
     const whats =  await prisma.whatsapp.findFirst({where: {id: whatsID}});

    res.render("CreateWhats", { whats });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
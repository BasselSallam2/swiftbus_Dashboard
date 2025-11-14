import prisma from "../prisma/prisma.js";


export const viewWhats = async (req, res, next) => {
  const whats = await prisma.whatsapp.findFirst();
  res.render("viewWhats", { whats });
};

export const viewAds = async (req, res, next) => {
  res.render("viewAds");
};

export const EditWhats = async (req, res, next) => {
  let { whatsID } = req.params;
  let { token, client } = req.body;

  console.log(req.body);

  try {
    const whats = await prisma.whatsapp.update({
      where: { id: whatsID },
      data: { token, client },
    });
    res.redirect("/whats");
  } catch (error) {
    next(error);
  }
};

export const Editwhatsform = async (req, res, next) => {
  let { whatsID } = req.params;

  try {
    const whats = await prisma.whatsapp.findFirst({ where: { id: whatsID } });

    res.render("CreateWhats", { whats });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const sendBroadcast = async (req, res, next) => {
    let msg = req.body.message || "";

    msg = msg.replace(/<\s*(b|strong)\s*>/gi, "*");
    msg = msg.replace(/<\s*\/\s*(b|strong)\s*>/gi, "*");

    msg = msg.replace(/<\s*(i|em)\s*>/gi, "_");
    msg = msg.replace(/<\s*\/\s*(i|em)\s*>/gi, "_");

    msg = msg.replace(/<\s*(s|strike)\s*>/gi, "~");
    msg = msg.replace(/<\s*\/\s*(s|strike)\s*>/gi, "~");

    msg = msg.replace(/<br\s*\/?>/gi, "\n");

    msg = msg.replace(/<p\s*>/gi, "");
    msg = msg.replace(/<\/p\s*>/gi, "\n");

    msg = msg.replace(/<[^>]*>/g, "");

    const customers = await prisma.coustmer.findMany();
    const phones = customers.map((customer) => customer.phone);
    const whatsapp = await prisma.whatsapp.findFirst();
     for (let i = 0; i < phones.length; i++) {
      let data = {
        client_id: `${whatsapp.client}`,
        mobile: `+2${phones[i]}`,
        text: msg
      };

      const whatsappMSG = await fetch(
        "https://v2.whats360.live/api/user/v2/send_message",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${whatsapp.token}`,
          },
          body: JSON.stringify(data),
        }
      );
    }

    res.status(200).json({ message: "Message sent successfully." });
    

   

 
};
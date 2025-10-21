import prisma from "../prisma/prisma.js";

export const CreateForm = async (req, res, next) => {
  let station = {};
  let cities = await prisma.city.findMany({ where: { isDeleted: false } });
  res.render("CreateStation", { station, cities });
};

export const CreateStation = async (req, res, next) => {
  let { ArabicStation, EnglishStation, city, Address, Location } = req.body;

  try {
    const newStation = await prisma.station.create({
      data: {
        name: EnglishStation,
        Arabicname: ArabicStation,
        address: Address,
        location: Location,
        cityId: city,
      },
    });

    res.redirect("/station");
  } catch (error) {
    next(error);
  }
};

export const ViewStation = async (req, res, next) => {
  const station = await prisma.station.findMany({
    where: { isDeleted: false },
    include: { city: { select: { name: true } } },
  });
  res.render("viewstation", { station });
};

export const EditStation = async (req, res, next) => {
  let { stationID } = req.params;
  let { ArabicStation, EnglishStation, city, Address, Location } = req.body;

  try {
    const station = await prisma.station.update({
      where: { id: stationID },
      data: {
        name: EnglishStation,
        Arabicname: ArabicStation,
        address: Address,
        location: Location,
        cityId: city,
      },
    });
    res.redirect("/station");
  } catch (error) {
    next(error);
  }
};

export const Editstationform = async (req, res, next) => {
  let { stationID } = req.params;

  try {
    const station = await prisma.station.findUnique({
      where: { id: stationID },
    });

    const cities = await prisma.city.findMany({
      where: { isDeleted: false },
      include: { stations: true },
    });

    res.render("CreateStation", { station, cities });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const DeleteSation = async (req, res, next) => {
  try {
    let { stationID } = req.params;
    const now = new Date();

    const station = await prisma.station.findUnique({
      where: { id: stationID },
    });

    const DeleteSation = await prisma.station.update({
      where: { id: stationID },
      data: {
        isDeleted: true,
        name: `${station.name}_${now}}`,
        Arabicname: `${station.Arabicname}_${now}`,
        location: `${station.location}_${now}`,
      },
    });

    res.redirect("/station");
  } catch (error) {
    console.log(error);
  }
};

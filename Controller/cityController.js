import prisma from "../prisma/prisma.js";

export const CreateForm = async (req, res, next) => {
  let city = {} ;
  res.render("CreateCity" , {city});
};

export const CreateCity = async (req, res, next) => {
  let {
    ArabicCity,
    EnglishCity,

  } = req.body;

  try {
    const newCity = await prisma.city.create({
      data: {
        name: EnglishCity,
        Arabicname: ArabicCity,
      },
    });

    

    res.redirect("/city");
   
  } catch (error) {
    next(error);
  }
};

export const ViewCity = async (req, res, next) => {
  const cities = await prisma.city.findMany({where:{isDeleted:false},
    include: { stations: { select: { Arabicname: true, name: true } } },
  });
  res.render("viewcity", { cities });
};

export const EditCity = async (req, res, next) => {
  let { cityID } = req.params;
  let { ArabicCity, EnglishCity } =
    req.body;

    console.log(req.body) ;

  try {
    const city = await prisma.city.update({
      where: { id: cityID },
      data: { name: EnglishCity, Arabicname: ArabicCity },
    });
    res.redirect("/city");  
  } catch (error) {
    next(error);
  }
};

export const Editcityform = async (req, res, next) => {
  let { cityID } = req.params;

  try {
    const city = await prisma.city.findUnique({
      where: { id: cityID },
      include: { stations: true },
    });

    res.render("CreateCity", { city });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const DeleteCity = async (req, res, next) => {
  try {
    let { cityID } = req.params;
    const now = new Date();

    const city = await prisma.city.findUnique({
      where: { id: cityID },
      include: { stations: true },
    });
    const updatedCity = await prisma.city.update({
      where: { id: cityID },
      data: {
        name: `${city.name}_${now.toISOString()}`,
        Arabicname: `${city.Arabicname}_${now.toISOString()}`,
        isDeleted: true,
      },
    });

    for (let i in city.stations) {
      const updatedStations = await prisma.station.update({
        where: { id: city.stations[i].id },
        data: {
          isDeleted: true,
          name: `${city.stations[i].name}_${now.toISOString()}`,
          Arabicname: `${city.stations[i].Arabicname}_${now.toISOString()}`,
          location: `${city.stations[i].location}_${now.toISOString()}`,
        },
      });
    }

    res.redirect("/city");
  } catch (error) {
    console.log(error);
  }
};

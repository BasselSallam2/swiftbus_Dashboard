import prisma from "../prisma/prisma.js";

export const info = async (req, res, next) => {
  try {
    const info = await prisma.info.findFirst();
    const Arabicinfo = await prisma.frontpageArabic.findFirst({
      select: { phone: true, address: true, FooterTitle: true },
    });
    const Englsihinfo = await prisma.frontpageEnglish.findFirst({
      select: { phone: true, address: true, FooterTitle: true },
    });

    res.render("info", { info, Arabicinfo, Englsihinfo });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const instructions = async (req, res, next) => {
  try {
    const ArabicInst = await prisma.arabicInstructions.findMany();
    const EnglishInst = await prisma.englishInstructions.findMany();

    res.render("instructions", { ArabicInst, EnglishInst });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const questions = async (req, res, next) => {
  try {
    const ArabicQuestions = await prisma.question.findMany({
      where: { FreqQuestionsArabic_id: 1 },
    });
    const EnglishQuestions = await prisma.question.findMany({
      where: { FreqQuestionsEnglish_id: 1 },
    });
    res.render("questions", { ArabicQuestions, EnglishQuestions });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const section1 = async (req, res, next) => {
  try {
    const Arabicone = await prisma.frontpageArabic.findFirst({
      select: { phone: true, WorkingHours: true },
    });

    const Englishone = await prisma.frontpageEnglish.findFirst({
      select: { phone: true, WorkingHours: true },
    });

    res.render("sectionone", { Arabicone, Englishone });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const section2 = async (req, res, next) => {
  try {
    const Arabictwo = await prisma.frontpageArabic.findFirst({
      select: { Title1: true, Subtitle1: true },
    });

    const Englishtwo = await prisma.frontpageEnglish.findFirst({
      select: { Title1: true, Subtitle1: true },
    });

    res.render("sectiontwo", { Arabictwo, Englishtwo });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const section3 = async (req, res, next) => {
  try {
    const Arabicthree = await prisma.frontpageArabic.findFirst({
      select: {
        Title2: true,
        SubTitle2: true,
        RightNumber: true,
        LeftNumber: true,
        TitleRightNumber: true,
        SubTitleRightNumber: true,
        TitleLeftNumber: true,
        SubTitleLeftNumber: true,
        Title2Picture: true,
      },
    });

    const Englishthree = await prisma.frontpageEnglish.findFirst({
      select: {
        Title2: true,
        SubTitle2: true,
        RightNumber: true,
        LeftNumber: true,
        TitleRightNumber: true,
        SubTitleRightNumber: true,
        TitleLeftNumber: true,
        SubTitleLeftNumber: true,
        Title2Picture: true,
      },
    });
    res.render("sectionthree", { Arabicthree, Englishthree });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const section4 = async (req, res, next) => {
  try {
    const Arabicfour = await prisma.frontpageArabic.findFirst({
      select: {
        WhyusTitle: true,
        RightTopTitle: true,
        RightTopSubTitle: true,
        LeftTopTitle: true,
        LeftTopSubTitle: true,
        RightDownTitle: true,
        RightDownSubTitle: true,
        LeftDownTitle: true,
        LeftDownSubTitle: true,
      },
    });

    const Englishfour = await prisma.frontpageEnglish.findFirst({
      select: {
        WhyusTitle: true,
        RightTopTitle: true,
        RightTopSubTitle: true,
        LeftTopTitle: true,
        LeftTopSubTitle: true,
        RightDownTitle: true,
        RightDownSubTitle: true,
        LeftDownTitle: true,
        LeftDownSubTitle: true,
      },
    });

    res.render("sectionfour", { Arabicfour, Englishfour });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const section5 = async (req, res, next) => {
  try {
    const Arabicfive = await prisma.marktingLines.findMany({
      select: { Arabiccity: true, Arabicsubtitle: true },
    });
    const Englishfive = await prisma.marktingLines.findMany({
      select: { Englishcity: true, Englishsubtitle: true },
    });
    const images = await prisma.marktingLines.findMany({
      select: { image_path: true },
    });

    res.render("sectionfive", { Arabicfive, Englishfive, images });
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const editinfo = async (req, res, next) => {
  const {
    email,
    facebook,
    instagram,
    twitter,
    youtube,
    ArabicFooter,
    EnglishFooter,
    ArabicAddress,
    EnglishAddress,
  } = req.body;

  try {
    const updateinfo = await prisma.info.update({
      where: { id: 1 },
      data: {
        email: email,
        facebook: facebook ?? null,
        instegram: instagram ?? null,
        twiter: twitter ?? null,
        youtube: youtube ?? null,
      },
    });
    const updateArabicfooter = await prisma.frontpageArabic.update({
      where: { id: 1 },
      data: {
        address: ArabicAddress,
        FooterTitle: ArabicFooter,
      },
    });

    const updateEnglishfooter = await prisma.frontpageEnglish.update({
      where: { id: 1 },
      data: {
        address: EnglishAddress,
        FooterTitle: EnglishFooter,
      },
    });

    res.redirect("/info");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const editinstructions = async (req, res, next) => {
  const { Arabicinst, Englishinst } = req.body;
  console.log(req.body);

  try {
    await prisma.arabicInstructions.deleteMany();
    await prisma.englishInstructions.deleteMany();

    for (let inst of Arabicinst) {
      await prisma.arabicInstructions.create({ data: { Instructions: inst } });
    }

    for (let inst of Englishinst) {
      await prisma.englishInstructions.create({ data: { Instructions: inst } });
    }

    res.redirect("/instructions");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const editquestions = async (req, res, next) => {
  const { Arabicquestion, Arabicanswer, Englishquestion, Englishanswer } =
    req.body;

  try {
    await prisma.question.deleteMany();

    for (let index in Arabicquestion) {
      await prisma.question.create({
        data: {
          question: Arabicquestion[index],
          answer: Arabicanswer[index],
          FreqQuestionsArabic_id: 1,
        },
      });
    }

    for (let index in Englishquestion) {
      await prisma.question.create({
        data: {
          question: Englishquestion[index],
          answer: Englishanswer[index],
          FreqQuestionsEnglish_id: 1,
        },
      });
    }

    res.redirect("/questions");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const editsection1 = async (req, res, next) => {
  const { Arabicphone, Englishphone, ArabicWorkingHours, EnglishWorkingHours } =
    req.body;

  try {
    await prisma.frontpageArabic.update({
      where: { id: 1 },
      data: {
        phone: Arabicphone,
        WorkingHours: ArabicWorkingHours,
      },
    });

    await prisma.frontpageEnglish.update({
      where: { id: 1 },
      data: {
        phone: Englishphone,
        WorkingHours: EnglishWorkingHours,
      },
    });

    res.redirect("/section1");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const editsection2 = async (req, res, next) => {
  const { ArabicTitle1, ArabicSubtitle1, EnglishTitle1, EnglishSubtitle1 } =
    req.body;

  try {
    await prisma.frontpageArabic.update({
      where: { id: 1 },
      data: {
        Title1: ArabicTitle1,
        Subtitle1: ArabicSubtitle1,
      },
    });

    await prisma.frontpageEnglish.update({
      where: { id: 1 },
      data: {
        Title1: EnglishTitle1,
        Subtitle1: EnglishSubtitle1,
      },
    });

    res.redirect("/section2");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const editsection3 = async (req, res, next) => {
  const {
    ArabicTitle2,
    ArabicSubTitle2,
    ArabicRightNumber,
    ArabicLeftNumber,
    ArabicTitleRightNumber,
    ArabicSubTitleRightNumber,
    ArabicTitleLeftNumber,
    ArabicSubTitleLeftNumber,
    EnglishTitle2,
    EnglishSubTitle2,
    EnglishRightNumber,
    EnglishLeftNumber,
    EnglishTitleRightNumber,
    EnglishSubTitleRightNumber,
    EnglishTitleLeftNumber,
    EnglishSubTitleLeftNumber,
    picture,
  } = req.body;

  try {
    await prisma.frontpageArabic.update({
      where: { id: 1 },
      data: {
        Title2: ArabicTitle2,
        SubTitle2: ArabicSubTitle2,
        RightNumber: ArabicRightNumber,
        LeftNumber: ArabicLeftNumber,
        TitleRightNumber: ArabicTitleRightNumber,
        SubTitleRightNumber: ArabicSubTitleRightNumber,
        TitleLeftNumber: ArabicTitleLeftNumber,
        SubTitleLeftNumber: ArabicSubTitleLeftNumber,
        Title2Picture: picture,
      },
    });

    await prisma.frontpageEnglish.update({
      where: { id: 1 },
      data: {
        Title2: EnglishTitle2,
        SubTitle2: EnglishSubTitle2,
        RightNumber: EnglishRightNumber,
        LeftNumber: EnglishLeftNumber,
        TitleRightNumber: EnglishTitleRightNumber,
        SubTitleRightNumber: EnglishSubTitleRightNumber,
        TitleLeftNumber: EnglishTitleLeftNumber,
        SubTitleLeftNumber: EnglishSubTitleLeftNumber,
        Title2Picture: picture,
      },
    });

    res.redirect("/section3");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const editsection4 = async (req, res, next) => {
  const {
    ArabicWhyusTitle,
    ArabicRightTopTitle,
    ArabicRightTopSubTitle,
    ArabicLeftTopTitle,
    ArabicLeftTopSubTitle,
    ArabicRightDownTitle,
    ArabicRightDownSubTitle,
    ArabicLeftDownTitle,
    ArabicLeftDownSubTitle,
    EnglishWhyusTitle,
    EnglishRightTopTitle,
    EnglishRightTopSubTitle,
    EnglishLeftTopTitle,
    EnglishLeftTopSubTitle,
    EnglishRightDownTitle,
    EnglishRightDownSubTitle,
    EnglishLeftDownTitle,
    EnglishLeftDownSubTitle,
  } = req.body;

  try {
    await prisma.frontpageArabic.update({
      where: { id: 1 },
      data: {
        WhyusTitle: ArabicWhyusTitle,
        RightTopTitle: ArabicRightTopTitle,
        RightTopSubTitle: ArabicRightTopSubTitle,
        LeftTopTitle: ArabicLeftTopTitle,
        LeftTopSubTitle: ArabicLeftTopSubTitle,
        RightDownTitle: ArabicRightDownTitle,
        RightDownSubTitle: ArabicRightDownSubTitle,
        LeftDownTitle: ArabicLeftDownTitle,
        LeftDownSubTitle: ArabicLeftDownSubTitle,
      },
    });

    await prisma.frontpageEnglish.update({
      where: { id: 1 },
      data: {
        WhyusTitle: EnglishWhyusTitle,
        RightTopTitle: EnglishRightTopTitle,
        RightTopSubTitle: EnglishRightTopSubTitle,
        LeftTopTitle: EnglishLeftTopTitle,
        LeftTopSubTitle: EnglishLeftTopSubTitle,
        RightDownTitle: EnglishRightDownTitle,
        RightDownSubTitle: EnglishRightDownSubTitle,
        LeftDownTitle: EnglishLeftDownTitle,
        LeftDownSubTitle: EnglishLeftDownSubTitle,
      },
    });

    res.redirect("/section4");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

export const editsection5 = async (req, res, next) => {
  const { Arabiccity, Arabicsubtitle, Englishcity, Englishsubtitle, images } =
    req.body;

  try {
    await prisma.marktingLines.deleteMany();

    for (let index in Arabiccity) {
      await prisma.marktingLines.create({
        data: {
          Arabiccity: Arabiccity[index],
          Arabicsubtitle: Arabicsubtitle[index],
          Englishcity: Englishcity[index],
          Englishsubtitle: Englishsubtitle[index],
          image_path: images[index],
        },
      });
    }

    res.redirect("/section5");
  } catch (error) {
    console.error(error);
    next(error);
  }
};

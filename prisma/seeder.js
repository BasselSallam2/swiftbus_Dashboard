import prisma from "./prisma";

(async () => {

  const ArabicInstuctions = await prisma.arabicInstructions.createMany({
    data: [
      { Instructions: "التأكد من تاريخ وميعاد و اتجاه الرحلة مسئولية الراكب" },
      { Instructions: "الأطفال فوق 4 سنوات تذكرة كاملة ولا يوجد نصف تذكرة" },
      { Instructions: "يحق للراكب اصطحاب عدد 2 شنطة ملابس متوسطة الحجم وما زاد على ذلك يتم تقدير قيمة شحن" },
      { Instructions: "الرجاء المحافظة على التذكرة وتقديمها عند الطلب" },
      { Instructions: "في حالة تسبب الشركة في فقد احد الامتعة يكون الحد الأقصى للتعويض 100 جنية مصري والشركة غير مسئولة عما بداخل الحقائب" },
      { Instructions: "الشركة غير مسئولة عن الامتعة صحبة الراكب داخل صالون السيارة ولا يجوز التعويض عنها" },
      { Instructions: "ممنوع اصطحاب او نقل الحيوانات او الطيور أو الأسماك أو المواد القابلة للاشتعال أو المواد السائلة" }
    ]
  });

  
  const EnglishInstuctions = await prisma.englishInstructions.createMany({
    data: [
      { Instructions: "It is the passenger's responsibility to check the date, time, and direction of the trip" },
      { Instructions: "Children over 4 years old require a full ticket, and there is no half ticket" },
      { Instructions: "The passenger is allowed to carry 2 medium-sized clothing bags, and any excess will be charged" },
      { Instructions: "Please keep the ticket and present it upon request" },
      { Instructions: "In case the company causes the loss of any luggage, the maximum compensation is 100 Egyptian pounds, and the company is not responsible for the contents of the bags" },
      { Instructions: "The company is not responsible for luggage accompanying the passenger inside the vehicle salon and cannot be compensated" },
      { Instructions: "It is forbidden to carry or transport animals, birds, fish, flammable materials, or liquids" }
    ]
  });

  

  const voucher1 = await prisma.voucher.create({data : {
    code : "Swift100" , percentage : 10 , maximum: 100 , avaliable: 3 
  }});

  const voucher2 = await prisma.voucher.create({data : {
    code : "Bassel" , percentage : 5 , maximum: 300 , avaliable: 3 
  }});

  const info = await prisma.info.create({data : {
    email : "SwiftBus@gmail.com" ,
    facebook : "https://www.facebook.com/profile.php?id=61567254821754"
  }});
  const ArabicFront = await prisma.frontpageArabic.create({data : {
    Title1 : "سويفت باص الخيار الامن و الاسرع لك و لاسرتك" ,
    Subtitle1: "رحلات يومية بافضل الاسعار",
    phone : "01060092211",
    WorkingHours: "كل ايام الاسبوع 9 صباحاً - 8 مساءً" ,
    Title2:"احجز رحلتك الان",
    SubTitle2:"احجز رحلتك الان و استمتع بالرحلة",
    RightNumber: "30" ,
    LeftNumber: "50",
    TitleRightNumber: "عدد الرحلات اليومية",
    TitleLeftNumber:" عدد الركاب اليومي",
    SubTitleRightNumber:"رحلات يومية بافضل الاسعار",
    SubTitleLeftNumber:"اكثر من 50 راكب يومياً",
    WhyusTitle:"لماذا تختار سويفت باص",
    RightTopTitle:"رحلات يومية",
    LeftTopTitle:"اسعار منافسة",
    RightDownTitle:"مراكب مكيفة",
    LeftDownTitle:"مراكب مكيفة",
    RightTopSubTitle:"رحلات يومية بافضل الاسعار",
    LeftTopSubTitle:"اسعار منافسة",
    RightDownSubTitle:"مراكب مكيفة",
    LeftDownSubTitle:"مراكب مكيفة",
    FooterTitle:"سويفت باص الاختيار الافضل" ,
    address:"القاهرة - مصر",
  }});


  const Ardabicfreq = await prisma.freqQuestionsArabic.create({data : {
    Title : "نحن هنا للاجابة عن كل اسئلتكم"
  }});

  const ArabicQuestion1 = await prisma.question.createMany({data: [
    {question : "كيف استرد المبلغ المدفوع" , answer : "يتم استرداد المبلغ بالكامل في حالة طلب الاسترداد قبل 24 ساعه" , FreqQuestionsArabic_id : 1},
    {question : "ما هي طرق الدفع المتاحة" , answer :"يوجد لدينا طريقة دفع بالفيزا او فودافون كاش او كاش قبل الرحلة" , FreqQuestionsArabic_id : 1},
    {question : "اريد الاتصال بكم" , answer :"نتشرف باتصالاتكم كل يوم من الساعه 9 صباحا الي 8  مساءً" , FreqQuestionsArabic_id : 1}
  ]});

  const EnglishFront = await prisma.frontpageEnglish.create({data : {
    Title1 : "Swift Bus, the safe and fast choice for you and your family" ,
    Subtitle1: "Daily trips with the best prices",
    phone : "01060092211",
    WorkingHours: "Every day from 9 AM to 8 PM" ,
    Title2:"Book your trip now",
    SubTitle2:"Book your trip now and enjoy the journey",
    RightNumber: "30" ,
    LeftNumber: "50",
    TitleRightNumber: "Number of daily trips",
    TitleLeftNumber:"Number of daily passengers",
    SubTitleRightNumber:"Daily trips with the best prices",
    SubTitleLeftNumber:"More than 50 passengers daily",
    WhyusTitle:"Why choose Swift Bus",
    RightTopTitle:"Daily trips",
    LeftTopTitle:"Competitive prices",
    RightDownTitle:"Air-conditioned vehicles",
    LeftDownTitle:"Air-conditioned vehicles",
    RightTopSubTitle:"Daily trips with the best prices",
    LeftTopSubTitle:"Competitive prices",
    RightDownSubTitle:"Air-conditioned vehicles",
    LeftDownSubTitle:"Air-conditioned vehicles",
    FooterTitle:"Swift Bus, the best choice" ,
    address:"Cairo, Egypt",
  }});


  const Englishfreq = await prisma.freqQuestionsEnglish.create({data : {
    Title : "We are here to answer all your questions"
  }});

  const EnglishQuestion1 = await prisma.question.createMany({data: [
    {question : "How can I get a refund?" , answer : "The full amount will be refunded if the refund is requested 24 hours before the trip" , FreqQuestionsEnglish_id : 1},
    {question : "What are the available payment methods?" , answer :"We offer payment by Visa, Vodafone Cash, or cash before the trip" , FreqQuestionsEnglish_id : 1},
    {question : "I want to contact you" , answer :"We are honored to receive your calls every day from 9 AM to 8 PM" , FreqQuestionsEnglish_id : 1}
  ]});

  const Admin = await prisma.user.create({
    data: {
      email: "Admin@admin.com",
      password: "password hasshed",
      role: "Admin",
    },
  });

  const bus = await prisma.bus.create({
    data: {
      type: "super-jet",
      layout: "layout image",
      seats: 49,
      specialseats: [1],
    },
  });

  const bus2 = await prisma.bus.create({
    data: {
      type: "HI-ACE",
      layout: "layout image",
      seats: 13,
      specialseats: [1],
    },
  });

  const marktinglines = await prisma.marktingLines.createMany({
    data: [
       {Arabiccity : "دهب" , Arabicsubtitle:"رحلات دهب يومية بافضل الاسعار" , Englishcity:"Dahab" , Englishsubtitle: "Daily trips with best prices" , image_path : "assets/images/10.jpg"} ,
       {Arabiccity : "نويبع" , Arabicsubtitle:"شواطئ نويبع الساحرة" , Englishcity:"Nuweiba" , Englishsubtitle: "The charming beaches of Nuweiba" , image_path : "assets/images/20.jpg"},
       {Arabiccity : "طابا" , Arabicsubtitle:"جنة الله علي الارض" , Englishcity:"Taba" , Englishsubtitle: "God’s paradise on earth" , image_path : "assets/images/30.jpg"},
       {Arabiccity : "العين السخنة" , Arabicsubtitle:"شواطئ البحر الاحمر الجميلة" , Englishcity:"Ainsokna" , Englishsubtitle: "Beautiful Red Sea beaches" , image_path : "assets/images/40.jpg"},


    ],
  });

  const city1 = await prisma.city.create({
    data: {
      name: "Cairo", Arabicname: "القاهرة" ,
      stations: {
        create: [
          { name: "Nasr-City", location: "https://g.co/kgs/roGTRSn"  , address : "Nasr-City - street 5" , Arabicname: "مدينة نصر"},
          { name: "Tagmo3", location: "https://g.co/kgs/roGTRS" , address : "Tagmo3 - street 6" , Arabicname: "التجمع" },
        ],
      },
    },
  });

  const city2 = await prisma.city.create({
    data: {
      name: "Dahab", Arabicname: "دهب" ,
      stations: {
        create: [{ name: "Dahab", location: "https://g.co/kgs/roGTR"  , address : "Dahab - street 7" , Arabicname: "دهب" }],
      },
    },
  });

  const city3 = await prisma.city.create({
    data: {
      name: "Taba", Arabicname: "طابا" ,
      stations: {
        create: [{ name: "Taba", location: "https://g.co/kgs/roG" , address : "Taba - street 8" , Arabicname: "طابا" }],
      },
    },
  });

  const city4 = await prisma.city.create({
    data: {
      name: "noiba3", Arabicname: "نويبع" ,
      stations: {
        create: [{ name: "noiba3", location: "https://g.co/kgs/ro" , address : "noiba3 - street 9" , Arabicname: "نويبع" }],
      },
    },
  });

  const trip1 = await prisma.trip.create({
    data: {
      routes: [city1.id, city3.id, city4.id, city2.id],
      payment: ["VFcash", "Visa" , "Cash"],
      cahslimit: 4,
      expireHours: 3,
      avaliableseats: 49,
      busid: bus.id,
      rrule: "FREQ=DAILY;DTSTART=20250130T000000Z;UNTIL=20250330T235959Z",
    },
  });

  const trip2 = await prisma.trip.create({
    data: {
      routes: [city1.id, city3.id, city2.id],
      payment: ["VFcash", "Visa" , "Cash"],
      cahslimit: 4,
      expireHours: 3,
      avaliableseats: 49,
      busid: bus.id,
      rrule: "FREQ=DAILY;DTSTART=20250130T000000Z;UNTIL=20250330T235959Z",
    },
  });

  const trip3 = await prisma.trip.create({
    data: {
      routes: [city2.id, city4.id, city3.id, city1.id],
      payment: ["VFcash", "Visa" , "Cash"],
      cahslimit: 4,
      expireHours: 3,
      avaliableseats: 49,
      busid: bus.id,
      rrule: "FREQ=DAILY;DTSTART=20250130T000000Z;UNTIL=20250330T235959Z",
    },
  });

  const trip4 = await prisma.trip.create({
    data: {
      routes: [city1.id, city3.id, city4.id, city2.id],
      payment: ["VFcash", "Visa" , "Cash"],
      cahslimit: 4,
      expireHours: 3,
      avaliableseats: 13,
      busid: bus2.id,
      rrule: "FREQ=DAILY;DTSTART=20250130T000000Z;UNTIL=20250330T235959Z",
    },
  });

  const trip5 = await prisma.trip.create({
    data: {
      routes: [city1.id, city3.id, city4.id, city2.id],
      payment: ["VFcash", "Visa" , "Cash"],
      cahslimit: 4,
      expireHours: 3,
      avaliableseats: 13,
      busid: bus2.id,
      rrule: "FREQ=DAILY;DTSTART=20250130T000000Z;UNTIL=20250330T235959Z",
    },
  });

  const trip6 = await prisma.trip.create({
    data: {
      routes: [city1.id, city3.id, city4.id, city2.id],
      payment: ["VFcash", "Visa" , "Cash"],
      cahslimit: 4,
      expireHours: 3,
      avaliableseats: 13,
      busid: bus.id,
      rrule: "FREQ=DAILY;DTSTART=20250130T000000Z;UNTIL=20250330T235959Z",
    },
  });

  const trip7 = await prisma.trip.create({
    data: {
      routes: [city1.id, city3.id, city4.id, city2.id],
      payment: ["VFcash", "Visa" , "Cash"],
      cahslimit: 4,
      expireHours: 3,
      avaliableseats: 13,
      busid: bus2.id,
      rrule: "FREQ=DAILY;DTSTART=20250130T000000Z;UNTIL=20250330T235959Z",
    },
  });

  
  const trip8 = await prisma.trip.create({
    data: {
      routes: [city2.id, city4.id, city3.id, city1.id],
      payment: ["VFcash", "Visa" , "Cash"],
      cahslimit: 4,
      expireHours: 3,
      avaliableseats: 13,
      busid: bus2.id,
      rrule: "FREQ=DAILY;DTSTART=20250130T000000Z;UNTIL=20250330T235959Z",
    },
  });

  const trip9 = await prisma.trip.create({
    data: {
      routes: [city2.id, city4.id, city3.id, city1.id],
      payment: ["VFcash", "Visa" , "Cash"],
      cahslimit: 4,
      expireHours: 3,
      avaliableseats: 13,
      busid: bus2.id,
      rrule: "FREQ=DAILY;DTSTART=20250130T000000Z;UNTIL=20250330T235959Z",
    },
  });

  const trip10 = await prisma.trip.create({
    data: {
      routes: [city2.id, city4.id, city3.id, city1.id],
      payment: ["VFcash", "Visa" , "Cash"],
      cahslimit: 4,
      expireHours: 3,
      avaliableseats: 13,
      busid: bus2.id,
      rrule: "FREQ=DAILY;DTSTART=20250130T000000Z;UNTIL=20250330T235959Z",
    },
  });

  const trip11 = await prisma.trip.create({
    data: {
      routes: [city2.id, city4.id, city3.id, city1.id],
      payment: ["VFcash", "Visa" , "Cash"],
      cahslimit: 4,
      expireHours: 3,
      avaliableseats: 49,
      busid: bus.id,
      rrule: "FREQ=DAILY;DTSTART=20250130T000000Z;UNTIL=20250330T235959Z", 
    },
  });

  const city1withid = await prisma.city.findUnique({
    where: { id: city1.id },
    include: { stations: true },
  });
  const city2withid = await prisma.city.findUnique({
    where: { id: city2.id },
    include: { stations: true },
  });
  const city3withid = await prisma.city.findUnique({
    where: { id: city3.id },
    include: { stations: true },
  });
  const city4withid = await prisma.city.findUnique({
    where: { id: city4.id },
    include: { stations: true },
  });

  const sationdetails1 = await prisma.stationDetails.createMany({
    data: [
      {
        stationId: city1withid.stations[0].id,
        arrivaleTime: "10:00 AM",
        trip_id: trip1.id,
      },
      {
        stationId: city1withid.stations[1].id,
        arrivaleTime: "11:00 AM",
        trip_id: trip1.id,
      },
      {
        stationId: city3withid.stations[0].id,
        arrivaleTime: "1:00 PM",
        trip_id: trip1.id,
      },
      {
        stationId: city4withid.stations[0].id,
        arrivaleTime: "3:00 PM",
        trip_id: trip1.id,
      },
      {
        stationId: city2withid.stations[0].id,
        arrivaleTime: "5:00 PM",
        trip_id: trip1.id,
      },
    ],
  });

  const sationdetails2 = await prisma.stationDetails.createMany({
    data: [
      {
        stationId: city1withid.stations[0].id,
        arrivaleTime: "11:00 AM",
        trip_id: trip2.id,
      },
      {
        stationId: city1withid.stations[1].id,
        arrivaleTime: "12:00 PM",
        trip_id: trip2.id,
      },
      {
        stationId: city3withid.stations[0].id,
        arrivaleTime: "1:00 PM",
        trip_id: trip2.id,
      },
      {
        stationId: city2withid.stations[0].id,
        arrivaleTime: "7:00 PM",
        trip_id: trip2.id,
      },
    ],
  });

  const sationdetails3 = await prisma.stationDetails.createMany({
    data: [
      {
        stationId: city1withid.stations[0].id,
        arrivaleTime: "07:00 PM",
        trip_id: trip3.id,
      },
      {
        stationId: city1withid.stations[1].id,
        arrivaleTime: "04:00 PM",
        trip_id: trip3.id,
      },
      {
        stationId: city3withid.stations[0].id,
        arrivaleTime: "1:00 PM",
        trip_id: trip3.id,
      },
      {
        stationId: city4withid.stations[0].id,
        arrivaleTime: "12:00 PM",
        trip_id: trip3.id,
      },
      {
        stationId: city2withid.stations[0].id,
        arrivaleTime: "11:00 Am",
        trip_id: trip3.id,
      },
    ],
  });

  const sationdetails4 = await prisma.stationDetails.createMany({
    data: [
      {
        stationId: city1withid.stations[0].id,
        arrivaleTime: "10:00 AM",
        trip_id: trip4.id,
      },
      {
        stationId: city1withid.stations[1].id,
        arrivaleTime: "11:00 AM",
        trip_id: trip4.id,
      },
      {
        stationId: city3withid.stations[0].id,
        arrivaleTime: "1:00 PM",
        trip_id: trip4.id,
      },
      {
        stationId: city4withid.stations[0].id,
        arrivaleTime: "3:00 PM",
        trip_id: trip4.id,
      },
      {
        stationId: city2withid.stations[0].id,
        arrivaleTime: "5:00 PM",
        trip_id: trip4.id,
      },
    ],
  });

  const sationdetails5 = await prisma.stationDetails.createMany({
    data: [
      {
        stationId: city1withid.stations[0].id,
        arrivaleTime: "10:00 AM",
        trip_id: trip5.id,
      },
      {
        stationId: city1withid.stations[1].id,
        arrivaleTime: "11:00 AM",
        trip_id: trip5.id,
      },
      {
        stationId: city3withid.stations[0].id,
        arrivaleTime: "1:00 PM",
        trip_id: trip5.id,
      },
      {
        stationId: city4withid.stations[0].id,
        arrivaleTime: "3:00 PM",
        trip_id: trip5.id,
      },
      {
        stationId: city2withid.stations[0].id,
        arrivaleTime: "5:00 PM",
        trip_id: trip5.id,
      },
    ],
  });

  const sationdetails6 = await prisma.stationDetails.createMany({
    data: [
      {
        stationId: city1withid.stations[0].id,
        arrivaleTime: "10:00 AM",
        trip_id: trip6.id,
      },
      {
        stationId: city1withid.stations[1].id,
        arrivaleTime: "11:00 AM",
        trip_id: trip6.id,
      },
      {
        stationId: city3withid.stations[0].id,
        arrivaleTime: "1:00 PM",
        trip_id: trip6.id,
      },
      {
        stationId: city4withid.stations[0].id,
        arrivaleTime: "3:00 PM",
        trip_id: trip6.id,
      },
      {
        stationId: city2withid.stations[0].id,
        arrivaleTime: "5:00 PM",
        trip_id: trip6.id,
      },
    ],
  });

  const sationdetails7 = await prisma.stationDetails.createMany({
    data: [
      {
        stationId: city1withid.stations[0].id,
        arrivaleTime: "10:00 AM",
        trip_id: trip7.id,
      },
      {
        stationId: city1withid.stations[1].id,
        arrivaleTime: "11:00 AM",
        trip_id: trip7.id,
      },
      {
        stationId: city3withid.stations[0].id,
        arrivaleTime: "1:00 PM",
        trip_id: trip7.id,
      },
      {
        stationId: city4withid.stations[0].id,
        arrivaleTime: "3:00 PM",
        trip_id: trip7.id,
      },
      {
        stationId: city2withid.stations[0].id,
        arrivaleTime: "5:00 PM",
        trip_id: trip7.id,
      },
    ],
  });

  
  const sationdetail8 = await prisma.stationDetails.createMany({
    data: [
      {
        stationId: city1withid.stations[0].id,
        arrivaleTime: "07:00 PM",
        trip_id: trip8.id,
      },
      {
        stationId: city1withid.stations[1].id,
        arrivaleTime: "04:00 PM",
        trip_id: trip8.id,
      },
      {
        stationId: city3withid.stations[0].id,
        arrivaleTime: "1:00 PM",
        trip_id: trip8.id,
      },
      {
        stationId: city4withid.stations[0].id,
        arrivaleTime: "12:00 PM",
        trip_id: trip8.id,
      },
      {
        stationId: city2withid.stations[0].id,
        arrivaleTime: "11:00 Am",
        trip_id: trip8.id,
      },
    ],
  });

  
  const sationdetails9 = await prisma.stationDetails.createMany({
    data: [
      {
        stationId: city1withid.stations[0].id,
        arrivaleTime: "07:00 PM",
        trip_id: trip9.id,
      },
      {
        stationId: city1withid.stations[1].id,
        arrivaleTime: "04:00 PM",
        trip_id: trip9.id,
      },
      {
        stationId: city3withid.stations[0].id,
        arrivaleTime: "1:00 PM",
        trip_id: trip9.id,
      },
      {
        stationId: city4withid.stations[0].id,
        arrivaleTime: "12:00 PM",
        trip_id: trip9.id,
      },
      {
        stationId: city2withid.stations[0].id,
        arrivaleTime: "11:00 Am",
        trip_id: trip9.id,
      },
    ],
  });

  
  const sationdetails10 = await prisma.stationDetails.createMany({
    data: [
      {
        stationId: city1withid.stations[0].id,
        arrivaleTime: "07:00 PM",
        trip_id: trip10.id,
      },
      {
        stationId: city1withid.stations[1].id,
        arrivaleTime: "04:00 PM",
        trip_id: trip10.id,
      },
      {
        stationId: city3withid.stations[0].id,
        arrivaleTime: "1:00 PM",
        trip_id: trip10.id,
      },
      {
        stationId: city4withid.stations[0].id,
        arrivaleTime: "12:00 PM",
        trip_id: trip10.id,
      },
      {
        stationId: city2withid.stations[0].id,
        arrivaleTime: "11:00 Am",
        trip_id: trip10.id,
      },
    ],
  });

  
  const sationdetails11 = await prisma.stationDetails.createMany({
    data: [
      {
        stationId: city1withid.stations[0].id,
        arrivaleTime: "07:00 PM",
        trip_id: trip11.id,
      },
      {
        stationId: city1withid.stations[1].id,
        arrivaleTime: "04:00 PM",
        trip_id: trip11.id,
      },
      {
        stationId: city3withid.stations[0].id,
        arrivaleTime: "1:00 PM",
        trip_id: trip11.id,
      },
      {
        stationId: city4withid.stations[0].id,
        arrivaleTime: "12:00 PM",
        trip_id: trip11.id,
      },
      {
        stationId: city2withid.stations[0].id,
        arrivaleTime: "11:00 Am",
        trip_id: trip11.id,
      },
    ],
  });





  const cost1 = await prisma.cost.createMany({
    data: [
      {
        fromCityId: city1.id,
        toCityId: city2.id,
        fare: 500,
        specialfare: 900,
        trip_id: trip1.id,
        twowaydiscount: 10
      },
      {
        fromCityId: city1.id,
        toCityId: city3.id,
        fare: 450,
        specialfare: 800,
        trip_id: trip1.id,
        twowaydiscount : 10
      },
      {
        fromCityId: city1.id,
        toCityId: city4.id,
        fare: 400,
        specialfare: 700,
        trip_id: trip1.id,
        twowaydiscount : 10
      },
      {
        fromCityId: city3.id,
        toCityId: city2.id,
        fare: 350,
        specialfare: 600,
        trip_id: trip1.id,
        twowaydiscount: 10
      },
      {
        fromCityId: city3.id,
        toCityId: city4.id,
        fare: 300,
        specialfare: 500,
        trip_id: trip1.id,
        twowaydiscount:10
      },
      {
        fromCityId: city4.id,
        toCityId: city2.id,
        fare: 250,
        specialfare: 400,
        trip_id: trip1.id,
        twowaydiscount:10
      },
    ],
  });

  const cost2 = await prisma.cost.createMany({
    data: [
      {
        fromCityId: city1.id,
        toCityId: city2.id,
        fare: 700,
        specialfare: 900,
        trip_id: trip2.id,
        twowaydiscount:10
      },
      {
        fromCityId: city1.id,
        toCityId: city3.id,
        fare: 600,
        specialfare: 800,
        trip_id: trip2.id,
        twowaydiscount:10
      },
      {
        fromCityId: city3.id,
        toCityId: city2.id,
        fare: 200,
        specialfare: 500,
        trip_id: trip2.id,
        twowaydiscount:10
      },
    ],
  });

  const cost3 = await prisma.cost.createMany({
    data: [
      {
        fromCityId: city2.id,
        toCityId: city1.id,
        fare: 700,
        specialfare: 900,
        trip_id: trip3.id,
        twowaydiscount:10
      },
      {
        fromCityId: city2.id,
        toCityId: city3.id,
        fare: 600,
        specialfare: 800,
        trip_id: trip3.id,
        twowaydiscount:10
      },
      {
        fromCityId: city2.id,
        toCityId: city4.id,
        fare: 400,
        specialfare: 600,
        trip_id: trip3.id,
        twowaydiscount:10
      },
      {
        fromCityId: city4.id,
        toCityId: city3.id,
        fare: 200,
        specialfare: 400,
        trip_id: trip3.id,
        twowaydiscount:10
      },
      {
        fromCityId: city4.id,
        toCityId: city1.id,
        fare: 150,
        specialfare: 300,
        trip_id: trip3.id,
        twowaydiscount:10
      },
      {
        fromCityId: city3.id,
        toCityId: city1.id,
        fare: 150,
        specialfare: 200,
        trip_id: trip3.id,
        twowaydiscount:10
      },
    ],
  });


  
  const cost4 = await prisma.cost.createMany({
    data: [
      {
        fromCityId: city1.id,
        toCityId: city2.id,
        fare: 500,
        specialfare: 900,
        trip_id: trip4.id,
        twowaydiscount: 10
      },
      {
        fromCityId: city1.id,
        toCityId: city3.id,
        fare: 450,
        specialfare: 800,
        trip_id: trip4.id,
        twowaydiscount : 10
      },
      {
        fromCityId: city1.id,
        toCityId: city4.id,
        fare: 400,
        specialfare: 700,
        trip_id: trip4.id,
        twowaydiscount : 10
      },
      {
        fromCityId: city3.id,
        toCityId: city2.id,
        fare: 350,
        specialfare: 600,
        trip_id: trip4.id,
        twowaydiscount: 10
      },
      {
        fromCityId: city3.id,
        toCityId: city4.id,
        fare: 300,
        specialfare: 500,
        trip_id: trip4.id,
        twowaydiscount:10
      },
      {
        fromCityId: city4.id,
        toCityId: city2.id,
        fare: 250,
        specialfare: 400,
        trip_id: trip4.id,
        twowaydiscount:10
      },
    ],
  });


  const cost5 = await prisma.cost.createMany({
    data: [
      {
        fromCityId: city1.id,
        toCityId: city2.id,
        fare: 500,
        specialfare: 900,
        trip_id: trip5.id,
        twowaydiscount: 10
      },
      {
        fromCityId: city1.id,
        toCityId: city3.id,
        fare: 450,
        specialfare: 800,
        trip_id: trip5.id,
        twowaydiscount : 10
      },
      {
        fromCityId: city1.id,
        toCityId: city4.id,
        fare: 400,
        specialfare: 700,
        trip_id: trip5.id,
        twowaydiscount : 10
      },
      {
        fromCityId: city3.id,
        toCityId: city2.id,
        fare: 350,
        specialfare: 600,
        trip_id: trip5.id,
        twowaydiscount: 10
      },
      {
        fromCityId: city3.id,
        toCityId: city4.id,
        fare: 300,
        specialfare: 500,
        trip_id: trip5.id,
        twowaydiscount:10
      },
      {
        fromCityId: city4.id,
        toCityId: city2.id,
        fare: 250,
        specialfare: 400,
        trip_id: trip5.id,
        twowaydiscount:10
      },
    ],
  });


  const cost6 = await prisma.cost.createMany({
    data: [
      {
        fromCityId: city1.id,
        toCityId: city2.id,
        fare: 500,
        specialfare: 900,
        trip_id: trip6.id,
        twowaydiscount: 10
      },
      {
        fromCityId: city1.id,
        toCityId: city3.id,
        fare: 450,
        specialfare: 800,
        trip_id: trip6.id,
        twowaydiscount : 10
      },
      {
        fromCityId: city1.id,
        toCityId: city4.id,
        fare: 400,
        specialfare: 700,
        trip_id: trip6.id,
        twowaydiscount : 10
      },
      {
        fromCityId: city3.id,
        toCityId: city2.id,
        fare: 350,
        specialfare: 600,
        trip_id: trip6.id,
        twowaydiscount: 10
      },
      {
        fromCityId: city3.id,
        toCityId: city4.id,
        fare: 300,
        specialfare: 500,
        trip_id: trip6.id,
        twowaydiscount:10
      },
      {
        fromCityId: city4.id,
        toCityId: city2.id,
        fare: 250,
        specialfare: 400,
        trip_id: trip6.id,
        twowaydiscount:10
      },
    ],
  });

  const cost7 = await prisma.cost.createMany({
    data: [
      {
        fromCityId: city1.id,
        toCityId: city2.id,
        fare: 500,
        specialfare: 900,
        trip_id: trip7.id,
        twowaydiscount: 10
      },
      {
        fromCityId: city1.id,
        toCityId: city3.id,
        fare: 450,
        specialfare: 800,
        trip_id: trip7.id,
        twowaydiscount : 10
      },
      {
        fromCityId: city1.id,
        toCityId: city4.id,
        fare: 400,
        specialfare: 700,
        trip_id: trip7.id,
        twowaydiscount : 10
      },
      {
        fromCityId: city3.id,
        toCityId: city2.id,
        fare: 350,
        specialfare: 600,
        trip_id: trip7.id,
        twowaydiscount: 10
      },
      {
        fromCityId: city3.id,
        toCityId: city4.id,
        fare: 300,
        specialfare: 500,
        trip_id: trip7.id,
        twowaydiscount:10
      },
      {
        fromCityId: city4.id,
        toCityId: city2.id,
        fare: 250,
        specialfare: 400,
        trip_id: trip7.id,
        twowaydiscount:10
      },
    ],
  });

  
  const cost8 = await prisma.cost.createMany({
    data: [
      {
        fromCityId: city2.id,
        toCityId: city1.id,
        fare: 700,
        specialfare: 900,
        trip_id: trip8.id,
        twowaydiscount:10
      },
      {
        fromCityId: city2.id,
        toCityId: city3.id,
        fare: 600,
        specialfare: 800,
        trip_id: trip3.id,
        twowaydiscount:10
      },
      {
        fromCityId: city2.id,
        toCityId: city4.id,
        fare: 400,
        specialfare: 600,
        trip_id: trip8.id,
        twowaydiscount:10
      },
      {
        fromCityId: city4.id,
        toCityId: city3.id,
        fare: 200,
        specialfare: 400,
        trip_id: trip8.id,
        twowaydiscount:10
      },
      {
        fromCityId: city4.id,
        toCityId: city1.id,
        fare: 150,
        specialfare: 300,
        trip_id: trip8.id,
        twowaydiscount:10
      },
      {
        fromCityId: city3.id,
        toCityId: city1.id,
        fare: 150,
        specialfare: 200,
        trip_id: trip8.id,
        twowaydiscount:10
      },
    ],
  });

  
  const cost9 = await prisma.cost.createMany({
    data: [
      {
        fromCityId: city2.id,
        toCityId: city1.id,
        fare: 700,
        specialfare: 900,
        trip_id: trip9.id,
        twowaydiscount:10
      },
      {
        fromCityId: city2.id,
        toCityId: city3.id,
        fare: 600,
        specialfare: 800,
        trip_id: trip9.id,
        twowaydiscount:10
      },
      {
        fromCityId: city2.id,
        toCityId: city4.id,
        fare: 400,
        specialfare: 600,
        trip_id: trip9.id,
        twowaydiscount:10
      },
      {
        fromCityId: city4.id,
        toCityId: city3.id,
        fare: 200,
        specialfare: 400,
        trip_id: trip9.id,
        twowaydiscount:10
      },
      {
        fromCityId: city4.id,
        toCityId: city1.id,
        fare: 150,
        specialfare: 300,
        trip_id: trip9.id,
        twowaydiscount:10
      },
      {
        fromCityId: city3.id,
        toCityId: city1.id,
        fare: 150,
        specialfare: 200,
        trip_id: trip9.id,
        twowaydiscount:10
      },
    ],
  });

  
  const cost10 = await prisma.cost.createMany({
    data: [
      {
        fromCityId: city2.id,
        toCityId: city1.id,
        fare: 700,
        specialfare: 900,
        trip_id: trip10.id,
        twowaydiscount:10
      },
      {
        fromCityId: city2.id,
        toCityId: city3.id,
        fare: 600,
        specialfare: 800,
        trip_id: trip10.id,
        twowaydiscount:10
      },
      {
        fromCityId: city2.id,
        toCityId: city4.id,
        fare: 400,
        specialfare: 600,
        trip_id: trip10.id,
        twowaydiscount:10
      },
      {
        fromCityId: city4.id,
        toCityId: city3.id,
        fare: 200,
        specialfare: 400,
        trip_id: trip10.id,
        twowaydiscount:10
      },
      {
        fromCityId: city4.id,
        toCityId: city1.id,
        fare: 150,
        specialfare: 300,
        trip_id: trip10.id,
        twowaydiscount:10
      },
      {
        fromCityId: city3.id,
        toCityId: city1.id,
        fare: 150,
        specialfare: 200,
        trip_id: trip10.id,
        twowaydiscount:10
      },
    ],
  });

  
  const cost11 = await prisma.cost.createMany({
    data: [
      {
        fromCityId: city2.id,
        toCityId: city1.id,
        fare: 700,
        specialfare: 900,
        trip_id: trip11.id,
        twowaydiscount:10
      },
      {
        fromCityId: city2.id,
        toCityId: city3.id,
        fare: 600,
        specialfare: 800,
        trip_id: trip11.id,
        twowaydiscount:10
      },
      {
        fromCityId: city2.id,
        toCityId: city4.id,
        fare: 400,
        specialfare: 600,
        trip_id: trip11.id,
        twowaydiscount:10
      },
      {
        fromCityId: city4.id,
        toCityId: city3.id,
        fare: 200,
        specialfare: 400,
        trip_id: trip11.id,
        twowaydiscount:10
      },
      {
        fromCityId: city4.id,
        toCityId: city1.id,
        fare: 150,
        specialfare: 300,
        trip_id: trip11.id,
        twowaydiscount:10
      },
      {
        fromCityId: city3.id,
        toCityId: city1.id,
        fare: 150,
        specialfare: 200,
        trip_id: trip11.id,
        twowaydiscount:10
      },
    ],
  });




  const coustmer1 = await prisma.coustmer.create({
    data: {
      name: "Abo Ahmed",
      phone: "01145689774",
    },
  });

  const coustmer2 = await prisma.coustmer.create({
    data: {
      name: "Abo koko",
      phone: "01004563217",
    },
  });

  const coustmer3 = await prisma.coustmer.create({
    data: {
      name: "Adham",
      phone: "01147896553",
    },
  });

  const agent1 = await prisma.employee.create({
    data: {
      type: "Agent",
      name: "Hossam empapy",
      phone: "01177856334",
      nationalid: "national image hossam",
      address: "Hossam's office",
      percentage: 10,
      Totalsales: 0,
      neededcommetions: 0,
      setteled: 0,
      User: {
        create: {
          email: "Hossam@gmail.com",
          password: "Hashed12345",
          role: ["Book", "Cancel"],
        },
      },
    },
  });

  const agent2 = await prisma.employee.create({
    data: {
      type: "Agent",
      name: "messi",
      phone: "01114756889",
      nationalid: "national image messi",
      address: "messi's office",
      percentage: 20,
      Totalsales: 0,
      neededcommetions: 0,
      setteled: 0,
      User: {
        create: {
          email: "messi@gmail.com",
          password: "Hashed12345",
          role: ["Book"]
        },
      },
    },
  });

  const agent3 = await prisma.employee.create({
    data: {
      type: "Agent",
      name: "leo",
      phone: "01247896553",
      nationalid: "national image leo",
      address: "leo's office",
      percentage: 15,
      Totalsales: 0,
      neededcommetions: 0,
      setteled: 0,
      User: {
        create: {
          email: "leo@gmail.com",
          password: "Hashed12345",
          role: ["Cancel"],
        },
      },
    },
  });

  const agent4 = await prisma.employee.create({
    data: {
      type: "Agent",
      name: "bob",
      phone: "01254789662",
      nationalid: "national image bob",
      address: "bob's office",
      percentage: 15,
      Totalsales: 0,
      neededcommetions: 0,
      setteled: 0,
      User: {
        create: {
          email: "bob@gmail.com",
          password: "Hashed12345",
          role: ["none"],
        },
      },
    },
  });

  const callcenter1 = await prisma.employee.create({
    data: {
      type: "Callcenter",
      name: "zoz",
      phone: "01475632987",
      nationalid: "national image zoz",
      address: "zoz's office",
      User: {
        create: {
          email: "zoz@gmail.com",
          password: "Hashed12345",
          role: ["Book","Cancel"],
        },
      },
    },
  });

  const callcenter2 = await prisma.employee.create({
    data: {
      type: "Callcenter",
      name: "amal",
      phone: "01478965321",
      nationalid: "national image amal",
      address: "amal's office",
      User: {
        create: {
          email: "amal@gmail.com",
          password: "Hashed12345",
          role: ["Boook"],
        },
      },
    },
  });

  const callcenter3 = await prisma.employee.create({
    data: {
      type: "Callcenter",
      name: "shimaa",
      phone: "014789653224",
      nationalid: "national image shoso",
      address: "sohos's office",
      User: {
        create: {
          email: "Shimaa@gmail.com",
          password: "Hashed12345",
          role: ["Cancel"],
        },
      },
    },
  });

  const callcenter4 = await prisma.employee.create({
    data: {
      type: "Callcenter",
      name: "bego",
      phone: "01145887765",
      nationalid: "national image beg",
      address: "beg's office",
      User: {
        create: {
          email: "bego@gmail.com",
          password: "Hashed12345",
          role: ["none"],
        },
      },
    },
  });

  const reservation1 = await prisma.reservation.create({
    data: {
      trip_id: trip1.id,
      trip_date: "2025-02-14",
      reservedSeats_counter: 5,
      reservedSeats: [11, 12, 13, 14, 15],
    },
  });

  // no reservations in trip2

  const reservation3 = await prisma.reservation.create({
    data: {
      trip_id: trip3.id,
      trip_date: "2025-02-14",
      reservedSeats_counter: 5,
      reservedSeats: [11, 12, 13, 14, 15],
    },
  });

  const ticket1 = await prisma.ticket.create({
    data: {
      trip_id: trip1.id,
      trip_date: "2025-02-05",
      Coustmer_id: coustmer1.id,
      book_id: agent1.id,
      status: "Booked",
      paymentMethod: "Cash",
      seatsCounter: 3,
      seats: [11, 12, 13],
      reservation_id: reservation1.id,
      CityRoutes:[city1.id , city2.id],
      StationRoutes:[city1withid.stations[0].id , city2withid.stations[0].id],
      takeoff: "10 AM" ,
      arrive: "9 PM",
      price : 100
    },
  });

  const ticket2 = await prisma.ticket.create({
    data: {
      trip_id: trip1.id,
      trip_date: "2025-02-05",
      Coustmer_id: coustmer2.id,
      status: "Booked",
      paymentMethod: "Visa",
      seatsCounter: 2,
      seats: [14, 15],
      reservation_id: reservation1.id,
      CityRoutes:[city1.id , city2.id],
      StationRoutes:[city1withid.stations[0].id , city2withid.stations[0].id],
      takeoff: "11 AM" ,
      arrive: "5 PM" ,
      price : 500
    },
  });

  const ticket3 = await prisma.ticket.create({
    data: {
      trip_id: trip2.id,
      trip_date: "2025-02-04",
      Coustmer_id: coustmer2.id,
      status: "Cancled",
      paymentMethod: "Visa",
      seatsCounter: 2,
      seats: [20, 21],
      reservation_id: null,
      cancel_id: callcenter1.id,
      cancelReason: "The passegner passed away",
      CityRoutes:[city1.id , city3.id],
      StationRoutes:[city1withid.stations[0].id , city3withid.stations[0].id],
      takeoff: "5 AM" ,
      arrive: "4 PM" ,
      price : 900
    },
  });

  const ticket4 = await prisma.ticket.create({
    data: {
      trip_id: trip3.id,
      trip_date: "2025-02-05",
      Coustmer_id: coustmer3.id,
      status: "Pending",
      paymentMethod: "Cash",
      seatsCounter: 5,
      seats: [11, 12, 13, 14, 15],
      reservation_id: reservation3.id,
      book_id: callcenter2.id,
      CityRoutes:[city2.id , city1.id],
      StationRoutes:[city2withid.stations[0].id , city1withid.stations[1].id],
      takeoff: "11 PM" ,
      arrive: "4 AM" ,
      price : 700
    },
  });
})();

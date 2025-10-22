
import prisma from "../../prisma/prisma.js";
export const ticketMapper = async (tickets) => {
    // إذا لم تكن هناك تذاكر، قم بإرجاع مصفوفة فارغة فوراً
    if (!tickets || tickets.length === 0) {
        return [];
    }

    // --- الخطوة 1: تجميع كل أسماء المحطات المطلوبة ---
    // نستخدم flatMap لجمع كل أسماء محطات الذهاب والوصول في مصفوفة واحدة
    const allStationNames = tickets.flatMap(ticket => ticket.StationRoutes || []);
    
    // نستخدم Set لإزالة الأسماء المكررة، ثم نحولها مرة أخرى إلى مصفوفة
    // هذا يضمن أننا نطلب كل اسم محطة مرة واحدة فقط
    const uniqueStationNames = [...new Set(allStationNames.filter(name => name))];

    let stationMap = new Map();

    // --- الخطوة 2: إرسال استعلام واحد فقط لقاعدة البيانات ---
    if (uniqueStationNames.length > 0) {
        // نطلب كل المحطات التي نحتاجها في "رحلة" واحدة إلى قاعدة البيانات
        const stationsData = await prisma.station.findMany({
            where: {
                name: { in: uniqueStationNames },
            },
            select: {
                name: true,        // نحتاج الاسم الإنجليزي لاستخدامه كمفتاح
                Arabicname: true,  // نحتاج الاسم العربي وهو القيمة المطلوبة
            },
        });

        // --- الخطوة 3: تحويل النتائج إلى خريطة (Map) لسهولة البحث الفوري ---
        // الخريطة تسمح لنا بالحصول على الاسم العربي لأي محطة فوراً بدون بحث
        stationMap = new Map(stationsData.map(s => [s.name, s.Arabicname]));
    }

    // --- الخطوة 4: معالجة التذاكر بدون أي استعلامات داخل الحلقة ---
    const result = tickets.flatMap(ticket => {
        // البحث الآن يتم في الذاكرة وهو فائق السرعة
        const takeoffStationName = stationMap.get(ticket.StationRoutes?.[0]) || ticket.StationRoutes?.[0] || "Unknown";
        const arrivalStationName = stationMap.get(ticket.StationRoutes?.[1]) || ticket.StationRoutes?.[1] || "Unknown";

        // نمر على مقاعد كل تذكرة ونُرجع بياناتها النهائية
        return (ticket.seats || []).map(seat => ({
            seatnumber: seat,
            coustmername: ticket.CoustmerID?.name || "Unknown",
            coustmerphone: ticket.CoustmerID?.phone || "Unknown",
            takeoffstation: takeoffStationName,
            arrivestation: arrivalStationName,
            paymentmethod: ticket.paymentMethod,
            price: ticket.seatsCounter ? ticket.price / ticket.seatsCounter : ticket.price,
            status: ticket.status,
            takeoff: ticket.takeoff,
            settledprice: ticket.seatsCounter ? ticket.settledprice / ticket.seatsCounter : ticket.settledprice,
            agent_name: ticket.BookEmployeeID?.name || "none",
        }));
    });

    return result;
};


export const ticketMapperBack = async (tickets) => {
    // إذا لم تكن هناك تذاكر، قم بإرجاع مصفوفة فارغة
    if (!tickets || tickets.length === 0) {
        return [];
    }

    // --- الخطوة 1: تجميع كل أسماء المحطات المطلوبة ---
    const allStationNames = tickets.flatMap(ticket => ticket.StationRoutes || []);
    const uniqueStationNames = Array.from(new Set(allStationNames.filter(name => name)));

    let stationMap = new Map();

    // --- الخطوة 2: إرسال استعلام واحد فقط لجلب كل المحطات ---
    if (uniqueStationNames.length > 0) {
        const stationsData = await prisma.station.findMany({
            where: {
                name: { in: uniqueStationNames },
            },
            select: {
                name: true,
                Arabicname: true,
            },
        });
        // تحويل النتائج إلى خريطة (Map) للبحث الفوري في الذاكرة
        stationMap = new Map(stationsData.map(s => [s.name, s.Arabicname]));
    }

    // --- الخطوة 3: معالجة التذاكر بدون استعلامات داخل الحلقة ---
    const result = tickets.flatMap(ticket => {
        // البحث الآن فوري وسريع من الذاكرة
        const takeoffStationName = stationMap.get(ticket.StationRoutes?.[0]) || ticket.StationRoutes?.[0] || "Unknown";
        const arrivalStationName = stationMap.get(ticket.StationRoutes?.[1]) || ticket.StationRoutes?.[1] || "Unknown";

        return (ticket.Backseats || []).map(seat => ({
            seatnumber: seat,
            coustmername: ticket.CoustmerID?.name || "Unknown",
            coustmerphone: ticket.CoustmerID?.phone || "Unknown",
            
            // ✅ تم الحفاظ على المنطق الأصلي كما هو مطلوب (القيم معكوسة)
            takeoffstation: arrivalStationName,
            arrivestation: takeoffStationName,
            
            paymentmethod: ticket.paymentMethod,
            price: ticket.seatsCounter ? ticket.price / ticket.seatsCounter : ticket.price,
            status: ticket.status,
            takeoff: ticket.takeoff,
            settledprice: ticket.seatsCounter ? ticket.settledprice / ticket.seatsCounter : ticket.settledprice,
            agent_name: ticket.BookEmployeeID?.name || "none",
        }));
    });

    return result;
};
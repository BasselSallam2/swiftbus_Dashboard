import ExcelJS from "exceljs";
import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
const root = process.cwd();

const getFontBase64 = (fontPath) => {
  try {
    const absolutePath = path.join(root, fontPath);
    const fontFile = fs.readFileSync(absolutePath);
    return Buffer.from(fontFile).toString("base64");
  } catch (error) {
    console.error(`Error reading font file at: ${fontPath}`, error);
    throw new Error("Font file not found or could not be read.");
  }
};

export const generateTicketTableEXCEl = async (
  GoTickets,
  BackTickets,
  bustype,
  TripDate,
  TripRoute,
  tripTime,
  res
) => {
  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Tickets");
    let total = 0;

    // 🛑 **Fix: Add Trip Details Correctly at the Top**
    worksheet.mergeCells("A1:G1");
    worksheet.getCell(
      "A1"
    ).value = `تاريخ الرحلة : ${TripDate} || ${tripTime[0]} - ${tripTime[1]}`;
    worksheet.getCell("A1").font = { bold: true, size: 16 };
    worksheet.getCell("A1").alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    worksheet.mergeCells("A2:G2");
    worksheet.getCell("A2").value = `مسار الرحلة : ${TripRoute.join(", ")}`;
    worksheet.getCell("A2").font = { bold: true, size: 14 };
    worksheet.getCell("A2").alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    worksheet.mergeCells("A3:G3");
    worksheet.getCell("A3").value = `نوع الباص : ${bustype}`;
    worksheet.getCell("A3").font = { bold: true, size: 14 };
    worksheet.getCell("A3").alignment = {
      horizontal: "center",
      vertical: "middle",
    };

    worksheet.addRow([]); // Empty row for spacing

    const headerRow = worksheet.addRow([
      "رقم الكراسي",
      "اسم العميل",
      "رقم هاتف العميل",
      "محطة الركوب",
      "موعد الركوب",
      "محطة النزول",
      "طريقة الدفع",
      "مكتب الحجز",
      "سعر التذكرة",
      "التحصيل",
    ]);

    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: "FFFFFF" }, size: 14 }; // Larger font
      cell.alignment = { horizontal: "center", vertical: "middle" };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "4F81BD" },
      }; // Light Blue Header
      cell.border = {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      };
    });

    let totalSeats = bustype === "super-jet" ? 49 : 13;

    for (let i = 1; i <= totalSeats; i++) {
      let ticket = GoTickets.find((ticket) => ticket.seatnumber === i);
      let ticket2 = BackTickets.find((ticket) => ticket.seatnumber === i);
      let status = undefined;
      if (ticket?.price && ticket?.price === ticket?.settledprice) {
        status = "مدفوع";
      }
      if (ticket2?.price && ticket2.status !== "Partial Paid") {
          status = "مدفوع";
        }
        if(ticket2?.price && ticket2.status === "Partial Paid"){
          status = ticket2?.price - ticket2?.settledprice
        }

      if (
        ticket?.price &&
        ticket?.price !== ticket?.settledprice &&
        ticket.status !== "Booked"
      ) {
        total = total + (ticket?.price - ticket?.settledprice);
      }

       if (
          ticket2?.price &&
          ticket2?.price !== ticket2?.settledprice &&
          ticket2.status !== "Booked"
        ) {
          total += ticket2?.price - ticket2?.settledprice;
        }

      let agentName;
      if (ticket?.agent_name) {
        ticket?.agent_name === "none"
          ? (agentName = "حجز مستقل")
          : (agentName = ticket?.agent_name);
      } else if (ticket2?.agent_name) {
        ticket2?.agent_name === "none"
          ? (agentName = "حجز مستقل")
          : (agentName = ticket2?.agent_name);
      }

      const rowData = [
        i,
        ticket?.coustmername || ticket2?.coustmername || "لا يوجد حجز",
        ticket?.coustmerphone || ticket2?.coustmerphone || "",
        ticket?.takeoffstation || ticket2?.takeoffstation || "",
        ticket?.takeoff || ticket2?.takeoff || "",
        ticket?.arrivestation || ticket2?.arrivestation || "",
        ticket?.paymentmethod || ticket2?.paymentmethod || "",
        agentName || "",
        ticket?.price || ticket2?.price || "",
        ticket?.status === "Booked"
          ? "مدفوع"
          : ticket?.price - ticket?.settledprice || status || "",
      ];

      let row = worksheet.addRow(rowData);

      // ** 🎨 Apply Styling to Rows **
      row.eachCell((cell) => {
        cell.alignment = { horizontal: "center", vertical: "middle" };
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
        cell.font = { size: 14 }; // Set a bigger font
      });

      // ** 🎨 Alternate Row Coloring for Better Readability **
      if (i % 2 === 0) {
        row.eachCell((cell) => {
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "D9E1F2" },
          }; // Light Grey-Blue Alternate Rows
        });
      }
    }

    // 🛑 **Fix: Set Column Widths for Better Spacing**
    worksheet.columns.forEach((column, index) => {
      if (index === 0) column.width = 12; // Seat number
      else if (index === 1) column.width = 20; // Name
      else if (index === 2) column.width = 18; // Phone number
      else if (index === 3 || index === 4)
        column.width = 20; // Boarding & Destination
      else column.width = 15; // Payment & Collection
    });

    // 🛑 **Fix: Set Row Heights for More Space**
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber > 3) row.height = 25; // Increase row height for better readability
    });

    // 🛑 **Add Total Collection Row at the End**
    worksheet.addRow([]); // Empty row for spacing
    const totalRow = worksheet.addRow([
      "",
      "",
      "",
      "",
      "",
      "",
      "مجموع التحصيل",
      total,
    ]);

    totalRow.eachCell((cell, colNumber) => {
      cell.font = { bold: true, size: 14 };
      cell.alignment = { horizontal: "center", vertical: "middle" };
      if (colNumber >= 7) {
        // Highlight آخر عمودين
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFD966" },
        }; // أصفر فاتح
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
      }
    });

    // Set response headers for file download
    res.setHeader("Content-Disposition", 'attachment; filename="tickets.xlsx"');
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error("Error generating Excel file:", err);
    res.status(500).send("Error generating Excel file");
  }
};

export const generateTicketTablePDF = async (
  GoTickets,
  BackTickets,
  bustype,
  TripDate,
  TripRoute,
  tripTime,
  res
) => {
  try {
    const amiriFont = getFontBase64("/fonts/Amiri-Regular.ttf");

    let total = 0;

    // --- بناء صفوف الجدول مع فلترة البيانات ---
    let tableRows = "";
    const totalSeats = bustype === "super-jet" ? 49 : 13;

    for (let i = 1; i <= totalSeats; i++) {
      const ticket = GoTickets.find((t) => t.seatnumber === i);
      const ticket2 = BackTickets.find((t) => t.seatnumber === i);

      // -->> الشرط الأساسي: لا تقم بإنشاء الصف إلا إذا كان هناك حجز <<--
      if (ticket || ticket2) {
        let status = undefined;
        
        

        if ((ticket?.price && ticket?.price === ticket?.settledprice)) {
          status = "مدفوع";
        }
        if (ticket2?.price && ticket2.status !== "Partial Paid") {
          status = "مدفوع";
        }
        if(ticket2?.price && ticket2.status === "Partial Paid"){
          status = ticket2?.price - ticket2?.settledprice
        }
        if (
          ticket?.price &&
          ticket?.price !== ticket?.settledprice &&
          ticket.status !== "Booked"
        ) {
          total += ticket?.price - ticket?.settledprice;
        }

        if (
          ticket2?.price &&
          ticket2?.price !== ticket2?.settledprice &&
          ticket2.status !== "Booked"
        ) {
          total += ticket2?.price - ticket2?.settledprice;
        }

        const collection =
          ticket?.status === "Booked"
            ? "مدفوع"
            : ticket?.price - ticket?.settledprice || status || "";

        let agentName;
        if (ticket?.agent_name) {
          ticket?.agent_name === "none"
            ? (agentName = "حجز مستقل")
            : (agentName = ticket?.agent_name);
        } else if (ticket2?.agent_name) {
          ticket2?.agent_name === "none"
            ? (agentName = "حجز مستقل")
            : (agentName = ticket2?.agent_name);
        }

        tableRows += `
                    <tr>
                        <td>${i}</td>
                        <td>${
                          ticket?.coustmername || ticket2?.coustmername
                        }</td>
                        <td>${
                          ticket?.coustmerphone || ticket2?.coustmerphone || ""
                        }</td>
                        <td>${
                          ticket?.takeoffstation ||
                          ticket2?.takeoffstation ||
                          ""
                        }</td>
                        <td>${ticket?.takeoff || ticket2?.takeoff || ""}</td>
                        <td>${
                          ticket?.arrivestation || ticket2?.arrivestation || ""
                        }</td>
                        <td>${
                          ticket?.paymentmethod || ticket2?.paymentmethod || ""
                        }</td>
                        <td>${agentName}</td>
                        <td>${ticket?.price || ticket2?.price || ""}</td>
                        <td>${collection}</td>
                    </tr>
                `;
      }
    }

    // --- بناء محتوى الـ HTML الكامل ---
    const htmlContent = `
            <!DOCTYPE html>
            <html lang="ar">
            <head>
                <meta charset="UTF-8">
                <style>
                    @font-face {
                        font-family: 'Amiri';
                        src: url(data:font/truetype;charset=utf-8;base64,${amiriFont}) format('truetype');
                        font-weight: normal;
                        font-style: normal;
                    }
                    body {
                        font-family: 'Amiri', sans-serif;
                        direction: rtl;
                        text-align: right;
                        margin: 20px;
                        -webkit-print-color-adjust: exact;
                    }
                    .header { text-align: center; border: 2px solid #4F81BD; padding: 10px; margin-bottom: 20px; }
                    h1, h2 { margin: 5px 0; }
                    table { width: 100%; border-collapse: collapse; font-size: 14px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
                    thead tr { background-color: #4F81BD; color: white; font-size: 16px; }
                    tbody tr:nth-child(even) { background-color: #D9E1F2; }
                    .total-row { font-weight: bold; font-size: 16px; background-color: #FFD966; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>تاريخ الرحلة: ${TripDate} || ${tripTime[0]} - ${
      tripTime[1]
    }</h1>
                    <h2>مسار الرحلة: ${TripRoute.join(" - ")}</h2>
                    <h2>نوع الباص: ${bustype}</h2>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>رقم الكرسي</th><th>اسم العميل</th><th>رقم الهاتف</th><th>محطة الركوب</th>
                            <th>موعد الركوب</th><th>محطة النزول</th><th>طريقة الدفع</th>
                            <th>مكتب الحجز</th><th>سعر التذكرة</th><th>التحصيل</th>
                        </tr>
                    </thead>
                    <tbody>${tableRows}</tbody>
                </table>
                <table style="margin-top: 20px;">
                    <tr class="total-row">
                        <td colspan="7">مجموع التحصيل</td>
                        <td>${total}</td>
                    </tr>
                </table>
            </body>
            </html>
        `;

    // --- إنشاء الـ PDF باستخدام Puppeteer ---
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    // --- إعدادات PDF النهائية (باستخدام A4) ---
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" },
    });

    await browser.close();

    // --- إرسال الـ PDF كاستجابة ---
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Length", pdfBuffer.length);
    res.setHeader("Content-Disposition", 'attachment; filename="tickets.pdf"');
    res.end(pdfBuffer);
  } catch (err) {
    console.error("Error generating PDF file:", err);
    if (!res.headersSent) {
      res.status(500).send({
        message: "An error occurred while generating the PDF file.",
        error: err.message,
      });
    }
  }
};

export const generateTicketTablePDFAgent = async (
  GoTickets,
  BackTickets,
  bustype,
  TripDate,
  TripRoute,
  tripTime,
  percentage,
  res
) => {
  try {
    const amiriFont = getFontBase64("/fonts/Amiri-Regular.ttf");

    let total = 0;

    // --- بناء صفوف الجدول مع فلترة البيانات ---
    let tableRows = "";
    const totalSeats = bustype === "super-jet" ? 49 : 13;

    for (let i = 1; i <= totalSeats; i++) {
      const ticket = GoTickets.find((t) => t.seatnumber === i);
      const ticket2 = BackTickets.find((t) => t.seatnumber === i);

      // -->> الشرط الأساسي: لا تقم بإنشاء الصف إلا إذا كان هناك حجز <<--
      if (ticket || ticket2) {
        let status = undefined;

        if (ticket?.price && ticket?.price === ticket?.settledprice) {
          status = "مدفوع";
        }
        if (ticket2?.price) {
          status = "مدفوع";
        }
        if (ticket?.price) {
          total += (ticket?.price * ( 1 - percentage/100) )
        }
        if (ticket2?.price) {
          total += (ticket2?.price * ( 1 - percentage/100) )
        }

        const collection =
          ticket?.status === "Booked"
            ? "مدفوع"
            : ticket?.price - ticket?.settledprice || status || "";

        let agentName;
        if (ticket?.agent_name) {
          ticket?.agent_name === "none"
            ? (agentName = "حجز مستقل")
            : (agentName = ticket?.agent_name);
        } else if (ticket2?.agent_name) {
          ticket2?.agent_name === "none"
            ? (agentName = "حجز مستقل")
            : (agentName = ticket2?.agent_name);
        }

        tableRows += `
                    <tr>
                        <td>${i}</td>
                        <td>${
                          ticket?.coustmername || ticket2?.coustmername
                        }</td>
                        <td>${
                          ticket?.coustmerphone || ticket2?.coustmerphone || ""
                        }</td>
                        <td>${
                          ticket?.takeoffstation ||
                          ticket2?.takeoffstation ||
                          ""
                        }</td>
                        <td>${ticket?.takeoff || ticket2?.takeoff || ""}</td>
                        <td>${
                          ticket?.arrivestation || ticket2?.arrivestation || ""
                        }</td>
                        <td>${
                          ticket?.paymentmethod || ticket2?.paymentmethod || ""
                        }</td>
                        <td>${agentName}</td>
                        <td>${ticket?.price || ticket2?.price || ""}</td>
                        <td>${collection}</td>
                    </tr>
                `;
      }
    }

    // --- بناء محتوى الـ HTML الكامل ---
    const htmlContent = `
            <!DOCTYPE html>
            <html lang="ar">
            <head>
                <meta charset="UTF-8">
                <style>
                    @font-face {
                        font-family: 'Amiri';
                        src: url(data:font/truetype;charset=utf-8;base64,${amiriFont}) format('truetype');
                        font-weight: normal;
                        font-style: normal;
                    }
                    body {
                        font-family: 'Amiri', sans-serif;
                        direction: rtl;
                        text-align: right;
                        margin: 20px;
                        -webkit-print-color-adjust: exact;
                    }
                    .header { text-align: center; border: 2px solid #4F81BD; padding: 10px; margin-bottom: 20px; }
                    h1, h2 { margin: 5px 0; }
                    table { width: 100%; border-collapse: collapse; font-size: 14px; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
                    thead tr { background-color: #4F81BD; color: white; font-size: 16px; }
                    tbody tr:nth-child(even) { background-color: #D9E1F2; }
                    .total-row { font-weight: bold; font-size: 16px; background-color: #FFD966; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>تاريخ الرحلة: ${TripDate} || ${tripTime[0]} - ${
      tripTime[1]
    }</h1>
                    <h2>مسار الرحلة: ${TripRoute.join(" - ")}</h2>
                    <h2>نوع الباص: ${bustype}</h2>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>رقم الكرسي</th><th>اسم العميل</th><th>رقم الهاتف</th><th>محطة الركوب</th>
                            <th>موعد الركوب</th><th>محطة النزول</th><th>طريقة الدفع</th>
                            <th>مكتب الحجز</th><th>سعر التذكرة</th><th>التحصيل</th>
                        </tr>
                    </thead>
                    <tbody>${tableRows}</tbody>
                </table>
                <table style="margin-top: 20px;">
                    <tr class="total-row">
                        <td colspan="7"> مجموع التحصيل بعد خصم النسبة</td>
                        <td>${total}</td>
                    </tr>
                </table>
            </body>
            </html>
        `;

    // --- إنشاء الـ PDF باستخدام Puppeteer ---
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    // --- إعدادات PDF النهائية (باستخدام A4) ---
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" },
    });

    await browser.close();

    // --- إرسال الـ PDF كاستجابة ---
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Length", pdfBuffer.length);
    res.setHeader("Content-Disposition", 'attachment; filename="tickets.pdf"');
    res.end(pdfBuffer);
  } catch (err) {
    console.error("Error generating PDF file:", err);
    if (!res.headersSent) {
      res.status(500).send({
        message: "An error occurred while generating the PDF file.",
        error: err.message,
      });
    }
  }
};

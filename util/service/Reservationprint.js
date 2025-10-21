import ExcelJS from "exceljs";

export const generateTicketTablePDF = async (GoTickets, BackTickets, bustype, TripDate, TripRoute, tripTime ,res) => {
    try {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Tickets");
        let total = 0 ;

        // 🛑 **Fix: Add Trip Details Correctly at the Top**
        worksheet.mergeCells("A1:G1");
        worksheet.getCell("A1").value = `تاريخ الرحلة : ${TripDate } || ${tripTime[0]} - ${tripTime[1]}`;
        worksheet.getCell("A1").font = { bold: true, size: 16 };
        worksheet.getCell("A1").alignment = { horizontal: "center", vertical: "middle" };

        worksheet.mergeCells("A2:G2");
        worksheet.getCell("A2").value = `مسار الرحلة : ${TripRoute.join(", ")}`;
        worksheet.getCell("A2").font = { bold: true, size: 14 };
        worksheet.getCell("A2").alignment = { horizontal: "center", vertical: "middle" };

        worksheet.mergeCells("A3:G3");
        worksheet.getCell("A3").value = `نوع الباص : ${bustype}`;
        worksheet.getCell("A3").font = { bold: true, size: 14 };
        worksheet.getCell("A3").alignment = { horizontal: "center", vertical: "middle" };

        worksheet.addRow([]); // Empty row for spacing

    
        const headerRow = worksheet.addRow([
            "رقم الكراسي", "اسم العميل", "رقم هاتف العميل", "محطة الركوب", "موعد الركوب" , "محطة النزول", "طريقة الدفع", "التحصيل"
        ]);

 
        headerRow.eachCell((cell) => {
            cell.font = { bold: true, color: { argb: "FFFFFF" }, size: 14 }; // Larger font
            cell.alignment = { horizontal: "center", vertical: "middle" };
            cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "4F81BD" } }; // Light Blue Header
            cell.border = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
        });

        let totalSeats = bustype === "super-jet" ? 49 : 13;

        
        for (let i = 1; i <= totalSeats; i++) {
            let ticket = GoTickets.find(ticket => ticket.seatnumber === i);
            let ticket2 = BackTickets.find(ticket => ticket.seatnumber === i);
            let status = undefined ;
            if(ticket?.price && ticket?.price === ticket?.settledprice){
                status = "مدفوع" ;
            }
            if(ticket2?.price){
                status = "مدفوع" ;
            }

            if(ticket?.price && ticket?.price !== ticket?.settledprice && ticket.status !== "Booked"){
                total  = total + (ticket?.price - ticket?.settledprice) ;
            }
          

            const rowData = [
                i,
                ticket?.coustmername || ticket2?.coustmername || "لا يوجد حجز",
                ticket?.coustmerphone || ticket2?.coustmerphone || "",
                ticket?.takeoffstation || ticket2?.takeoffstation || "",
                ticket?.takeoff || ticket2?.takeoff || "",
                ticket?.arrivestation || ticket2?.arrivestation || "",
                ticket?.paymentmethod || ticket2?.paymentmethod || "",
                ticket?.status === "Booked" ? "مدفوع" : ticket?.price - ticket?.settledprice ||  status ||"",
            ];

            let row = worksheet.addRow(rowData);

            // ** 🎨 Apply Styling to Rows **
            row.eachCell((cell) => {
                cell.alignment = { horizontal: "center", vertical: "middle" };
                cell.border = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
                cell.font = { size: 14 }; // Set a bigger font
            });

            // ** 🎨 Alternate Row Coloring for Better Readability **
            if (i % 2 === 0) {
                row.eachCell((cell) => {
                    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "D9E1F2" } }; // Light Grey-Blue Alternate Rows
                });
            }
        }

        // 🛑 **Fix: Set Column Widths for Better Spacing**
        worksheet.columns.forEach((column, index) => {
            if (index === 0) column.width = 12; // Seat number
            else if (index === 1) column.width = 20; // Name
            else if (index === 2) column.width = 18; // Phone number
            else if (index === 3 || index === 4) column.width = 20; // Boarding & Destination
            else column.width = 15; // Payment & Collection
        });

        // 🛑 **Fix: Set Row Heights for More Space**
        worksheet.eachRow((row, rowNumber) => {
            if (rowNumber > 3) row.height = 25; // Increase row height for better readability
        });

         // 🛑 **Add Total Collection Row at the End**
        worksheet.addRow([]); // Empty row for spacing
        const totalRow = worksheet.addRow([
            "", "", "", "", "", "", "مجموع التحصيل", total
        ]);

        totalRow.eachCell((cell, colNumber) => {
            cell.font = { bold: true, size: 14 };
            cell.alignment = { horizontal: "center", vertical: "middle" };
            if (colNumber >= 7) { // Highlight آخر عمودين
                cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFD966" } }; // أصفر فاتح
                cell.border = { top: { style: "thin" }, bottom: { style: "thin" }, left: { style: "thin" }, right: { style: "thin" } };
            }
        });

        // Set response headers for file download
        res.setHeader("Content-Disposition", 'attachment; filename="tickets.xlsx"');
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        console.error("Error generating Excel file:", err);
        res.status(500).send("Error generating Excel file");
    }
};



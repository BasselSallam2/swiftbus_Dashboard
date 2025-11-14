import ExcelJS from 'exceljs';

export const generateCustomerReportEXCEL = async (
  customerData,
  reportTitle,
  res
) => {
  try {
    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet('تقرير العملاء', {
      views: [{ rightToLeft: true }],
    });

    worksheet.mergeCells('A1:F1');
    worksheet.getCell('A1').value = reportTitle || 'تقرير العملاء الإجمالي';
    worksheet.getCell('A1').font = { bold: true, size: 16 };
    worksheet.getCell('A1').alignment = {
      horizontal: 'center',
      vertical: 'middle',
    };
    worksheet.getRow(1).height = 30;

    worksheet.addRow([]); 

    const headerRow = worksheet.addRow([
      'اسم العميل',
      'رقم تليفون العميل',
      'عدد التذاكر المحجوزة',
      'عدد المقاعد المحجوزة',
      'عدد التذاكر الملغاه',
      'اجمال الربح من العميل',
    ]);

    headerRow.height = 25;
    headerRow.eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFF' }, size: 14 };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4F81BD' }, 
      };
      cell.border = {
        top: { style: 'thin' },
        bottom: { style: 'thin' },
        left: { style: 'thin' },
        right: { style: 'thin' },
      };
    });

    let totalPrice = 0;
    let totalTickets = 0;
    let totalSeats = 0;
    let totalCancel = 0;

    customerData.forEach((customer, index) => {
      const rowData = [
        customer.name,
        customer.phone,
        customer.tickets,
        customer.seats,
        customer.cancel,
        customer.price,
      ];
      let row = worksheet.addRow(rowData);
      row.height = 25; 

      totalTickets += customer.tickets || 0;
      totalSeats += customer.seats || 0;
      totalCancel += customer.cancel || 0;
      totalPrice += customer.price || 0;

      row.eachCell((cell, colNumber) => {

        cell.alignment = {
          vertical: 'middle',
          horizontal: colNumber === 1 ? 'right' : 'center',
        };
        cell.border = {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.font = { size: 14 }; 

        if (colNumber === 2) {
          cell.numFmt = '@';
        }

        if (colNumber === 6) {
          cell.numFmt = '#,##0.00 "EGP"';
          cell.font = { size: 14, bold: true };
        }
      });

      if (index % 2 !== 0) {
        row.eachCell((cell) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'D9E1F2' }, 
          };
        });
      }
    });

    worksheet.columns.forEach((column, index) => {
      if (index === 0) column.width = 30; 
      else if (index === 1) column.width = 20; 
      else if (index === 5) column.width = 25; 
      else column.width = 22; 
    });

    worksheet.addRow([]); 
    const totalRow = worksheet.addRow([
      'الإجمالي',
      '', 
      totalTickets,
      totalSeats,
      totalCancel,
      totalPrice,
    ]);

    totalRow.height = 30;

    worksheet.mergeCells(`A${totalRow.number}:B${totalRow.number}`);

    totalRow.eachCell((cell, colNumber) => {
      cell.font = { bold: true, size: 14 };
      cell.alignment = { horizontal: 'center', vertical: 'middle' };

      if (colNumber === 1 || colNumber >= 3) {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFD966' }, 
        };
        cell.border = {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' },
        };
      }

      if (colNumber === 6) {
        cell.numFmt = '#,##0.00 "EGP"';
      }
    });

    res.setHeader(
      'Content-Disposition',
      'attachment; filename="CustomerReport.xlsx"'
    );
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('Error generating Excel file:', err);
    res.status(500).send('Error generating Excel file');
  }
};
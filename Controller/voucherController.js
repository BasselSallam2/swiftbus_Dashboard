import prisma from "../prisma/prisma.js";

export const VouchercreateForm = async (req, res, next) => {
  let voucher = {};

  res.render("CreateVoucher", { voucher });
};

export const CreateVoucher = async (req, res, next) => {
  const { code, avaliable, percentage, maximum } = req.body;
  let Intavaliable = parseInt(avaliable);
  let Intpercentage = parseInt(percentage);
  let Intmaximum = parseInt(maximum);

  const voucher = await prisma.voucher.create({
    data: {
      code: code,
      avaliable: Intavaliable,
      percentage: Intpercentage,
      maximum: Intmaximum,
    },
  });

  res.redirect("/voucher");
};

export const Viewvouchers = async (req, res, next) => {
  const voucher = await prisma.voucher.findMany({ where: { isActive: true } });

  res.render("viewVoucher", { voucher });
};

export const deleteVoucher = async (req, res, next) => {
  const { voucherid } = req.params;

  const voucher = await prisma.voucher.findUnique({ where: { id: voucherid } });

  if (voucher) {
    await prisma.voucher.update({
      where: { id: voucherid },
      data: {
        isActive: false,
        code: voucher.code + "_Deleted",
      },
    });
  }

  res.redirect("/voucher");
};

export const EditVoucherForm = async (req, res, next) => {
  const { voucherid } = req.params;

  const voucher = await prisma.voucher.findUnique({ where: { id: voucherid } });

  if (!voucher) {
    res.redirect("/voucher");
  }

  res.render("CreateVoucher", { voucher });

  //res.render() ;
};

export const EditVoucher = async (req, res, next) => {
  const { code, avaliable, percentage, maximum } = req.body;
  const { voucherid } = req.params;
  let Intavaliable = parseInt(avaliable);
  let Intpercentage = parseInt(percentage);
  let Intmaximum = parseInt(maximum);

  const voucher = await prisma.voucher.update({
    where: { id: voucherid },
    data: {
      code: code,
      avaliable: Intavaliable,
      percentage: Intpercentage,
      maximum: Intmaximum,
    },
  });

  res.redirect("/voucher");
};

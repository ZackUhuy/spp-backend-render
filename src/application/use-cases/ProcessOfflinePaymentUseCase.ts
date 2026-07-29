import type { IInvoiceRepository } from "../../domain/repositories/IInvoiceRepository.js";
import type { IStudentRepository } from "../../domain/repositories/IStudentRepository.js";
import type { ISppTariffRepository } from "../../domain/repositories/ISppTariffRepository.js";
import { InvoiceType, InvoiceStatus, CategoryType, PaymentMethod } from "@prisma/client";
import { BadRequestError, NotFoundError } from "../../domain/errors/AppError.js";
import prisma from "../../infrastructure/database/prisma.js";

export class ProcessOfflinePaymentUseCase {
  constructor(
    private invoiceRepository: IInvoiceRepository,
    private studentRepository: IStudentRepository,
    private sppTariffRepository: ISppTariffRepository
  ) {}

  async execute(input: {
    studentId: number;
    month: number;
    year: number;
    recordedById: number;
    invoiceType?: InvoiceType | undefined;
    paymentAmount?: number | undefined;
  }) {
    const { studentId, month, year, recordedById, invoiceType = InvoiceType.SPP, paymentAmount } = input;

    // 1. Validasi Eksistensi Invoice
    const existingInvoice = await this.invoiceRepository.findByUniqueComposite(
      studentId,
      month,
      year,
      invoiceType
    );

    if (existingInvoice && existingInvoice.status === InvoiceStatus.PAID) {
      throw new BadRequestError(`Gagal: Tagihan ${invoiceType} siswa untuk bulan dan tahun tersebut sudah lunas`);
    }

    // 2. Kalkulasi & Snapshot Tarif Dasar (Jika Invoice Belum Ada)
    let invoiceData: any;
    let student: any;

    student = await this.studentRepository.findById(studentId);
    if (!student) {
      throw new NotFoundError("Gagal: Siswa tidak ditemukan");
    }

    const tariff = await this.sppTariffRepository.findByUnitAndYear(
      student.schoolUnitId,
      student.enrollmentYear
    );

    if (!tariff) {
      throw new NotFoundError("Gagal: Master tarif SPP untuk angkatan siswa ini belum dikonfigurasi");
    }

    let baseAmount = 0;
    let discountApplied = 0;

    if (invoiceType === InvoiceType.SPP) {
      baseAmount = tariff.amount;
      discountApplied = Math.min(baseAmount, student.discountAmount);
    } else if (invoiceType === InvoiceType.UANG_PENGEMBANGAN) {
      baseAmount = tariff.developmentFee;
    } else if (invoiceType === InvoiceType.DAFTAR_ULANG) {
      baseAmount = tariff.reRegistrationFee;
    } else if (invoiceType === InvoiceType.UANG_PERALATAN) {
      baseAmount = tariff.equipmentFee;
    } else if (invoiceType === InvoiceType.EKSTRAKURIKULER) {
      baseAmount = tariff.extracurricularFee;
    } else if (invoiceType === InvoiceType.SERAGAM) {
      baseAmount = tariff.uniformFee;
    }

    const totalInvoiceAmount = baseAmount - discountApplied;

    // Hitung berapa yang sudah dibayar
    let currentPaid = 0;
    if (existingInvoice) {
      const txSum = await prisma.transaction.aggregate({
        where: { invoiceId: existingInvoice.id, type: "INCOME" as any },
        _sum: { amount: true },
      });
      currentPaid = txSum._sum.amount || 0;
    }

    const remainingAmount = Math.max(0, (existingInvoice ? existingInvoice.amount : totalInvoiceAmount) - currentPaid);

    // Tentukan nominal transaksi pembayaran tunai ini
    let paymentTxAmount = paymentAmount !== undefined ? paymentAmount : remainingAmount;
    if (paymentTxAmount > remainingAmount) {
      paymentTxAmount = remainingAmount;
    }

    if (paymentTxAmount <= 0) {
      throw new BadRequestError("Gagal: Nominal pembayaran tidak boleh nol atau negatif, atau tagihan sudah lunas");
    }

    // Tentukan status akhir invoice setelah pembayaran ini
    const totalPaidAfterTx = currentPaid + paymentTxAmount;
    const finalInvoiceAmount = existingInvoice ? existingInvoice.amount : totalInvoiceAmount;
    const finalStatus = totalPaidAfterTx >= finalInvoiceAmount ? InvoiceStatus.PAID : InvoiceStatus.PENDING;

    if (!existingInvoice) {
      invoiceData = {
        studentId,
        invoiceType,
        month,
        year,
        baseAmount,
        discountApplied,
        amount: totalInvoiceAmount,
        status: finalStatus,
      };
    } else {
      invoiceData = {
        ...existingInvoice,
        status: finalStatus,
      };
    }

    // 3. Eksekusi Kategori Pembayaran Dinamis
    let categoryName = "SPP";
    if (invoiceType === InvoiceType.UANG_PENGEMBANGAN) categoryName = "Uang Pengembangan";
    else if (invoiceType === InvoiceType.DAFTAR_ULANG) categoryName = "Daftar Ulang";
    else if (invoiceType === InvoiceType.UANG_PERALATAN) categoryName = "Uang Peralatan";
    else if (invoiceType === InvoiceType.EKSTRAKURIKULER) categoryName = "Uang Ekstrakurikuler";
    else if (invoiceType === InvoiceType.SERAGAM) categoryName = "Uang Seragam";

    let category = await prisma.category.findFirst({
      where: {
        name: { equals: categoryName, mode: "insensitive" },
        type: "INCOME",
      },
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: categoryName,
          type: "INCOME",
          schoolUnitId: null,
        },
      });
    }

    const transactionData = {
      type: CategoryType.INCOME,
      categoryId: category.id,
      paymentMethod: PaymentMethod.CASH,
      amount: paymentTxAmount,
      description: `Pembayaran ${categoryName} offline tunai bulan ${month} tahun ${year} untuk siswa ${student.name}`,
      schoolUnitId: student.schoolUnitId,
      recordedById,
    };

    const result = await this.invoiceRepository.createOfflinePayment(
      invoiceData,
      transactionData,
      existingInvoice?.id
    );

    return {
      invoiceId: result.invoice.id,
      studentId: result.invoice.studentId,
      month: result.invoice.month,
      year: result.invoice.year,
      amountPaid: result.transaction.amount,
      transactionId: result.transaction.id,
    };
  }
}

import type { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../../../domain/errors/AppError.js";
import type { CreateTransactionUseCase } from "../../../application/use-cases/CreateTransactionUseCase.js";
import type { GetTransactionsUseCase } from "../../../application/use-cases/GetTransactionsUseCase.js";
import type { UpdateTransactionUseCase } from "../../../application/use-cases/UpdateTransactionUseCase.js";
import type { DeleteTransactionUseCase } from "../../../application/use-cases/DeleteTransactionUseCase.js";
import { logActivity } from "../../utils/activityLogger.js";

export class TransactionController {
  constructor(
    private createTransactionUseCase: CreateTransactionUseCase,
    private getTransactionsUseCase: GetTransactionsUseCase,
    private updateTransactionUseCase?: UpdateTransactionUseCase,
    private deleteTransactionUseCase?: DeleteTransactionUseCase
  ) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user!;
      let { type, categoryId, paymentMethod, amount, description, schoolUnitId } = req.body;

      // Logic Ekstraksi Hak Akses
      if (user.role === "UNIT_ADMIN") {
        schoolUnitId = user.schoolUnitId;
      }

      const result = await this.createTransactionUseCase.execute({
        type,
        categoryId: Number(categoryId),
        paymentMethod,
        amount: Number(amount),
        description,
        schoolUnitId: Number(schoolUnitId),
        recordedById: user.id,
      });

      // Log Aktivitas
      await logActivity(
        user.id,
        "CREATE_TRANSACTION",
        `Membuat transaksi baru tipe ${type} sebesar Rp ${amount.toLocaleString("id-ID")} dengan metode ${paymentMethod}`,
        req
      );

      res.status(201).json({
        success: true,
        message: "Transaksi buku kas berhasil dicatat",
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user!;
      const { type, categoryId, startDate, endDate } = req.query;
      let { schoolUnitId } = req.query;

      // Enforce Unit Isolation
      if (user.role === "UNIT_ADMIN") {
        if (schoolUnitId && Number(schoolUnitId) !== user.schoolUnitId) {
          throw new ForbiddenError("Akses ditolak: Anda tidak memiliki otoritas untuk mengelola unit sekolah ini");
        }
        schoolUnitId = user.schoolUnitId?.toString();
      }

      const filter: any = {};
      if (schoolUnitId) filter.schoolUnitId = Number(schoolUnitId);
      if (type) filter.type = type as string;
      if (categoryId) filter.categoryId = Number(categoryId);
      if (startDate) filter.startDate = new Date(startDate as string);
      if (endDate) filter.endDate = new Date(endDate as string);

      const result = await this.getTransactionsUseCase.execute(filter);

      res.status(200).json({
        success: true,
        message: "Data rekapitulasi jurnal kas berhasil diambil",
        summary: result.summary,
        data: result.data,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user!;
      const id = Number(req.params.id);
      const { type, categoryId, paymentMethod, amount, description, schoolUnitId } = req.body;

      if (!this.updateTransactionUseCase) {
        throw new Error("UpdateTransactionUseCase tidak terdaftar");
      }

      const result = await this.updateTransactionUseCase.execute(id, {
        type,
        categoryId: categoryId !== undefined ? Number(categoryId) : undefined,
        paymentMethod,
        amount: amount !== undefined ? Number(amount) : undefined,
        description,
        schoolUnitId: schoolUnitId !== undefined ? Number(schoolUnitId) : undefined,
      });

      // Log Aktivitas
      await logActivity(
        user.id,
        "UPDATE_TRANSACTION",
        `Mengupdate transaksi (ID: ${id}) dengan data baru: tipe=${type || "tidak berubah"}, nominal=${amount ? "Rp " + amount.toLocaleString("id-ID") : "tidak berubah"}`,
        req
      );

      res.status(200).json({
        success: true,
        message: "Transaksi buku kas berhasil diperbarui",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = req.user!;
      const id = Number(req.params.id);

      if (!this.deleteTransactionUseCase) {
        throw new Error("DeleteTransactionUseCase tidak terdaftar");
      }

      await this.deleteTransactionUseCase.execute(id);

      // Log Aktivitas
      await logActivity(
        user.id,
        "DELETE_TRANSACTION",
        `Menghapus transaksi buku kas dengan ID: ${id}`,
        req
      );

      res.status(200).json({
        success: true,
        message: "Transaksi buku kas berhasil dihapus",
      });
    } catch (error) {
      next(error);
    }
  }
}

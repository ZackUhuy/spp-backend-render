import type { Request, Response, NextFunction } from "express";
import { CreateReRegistrationTariffUseCase } from "../../../application/use-cases/CreateReRegistrationTariffUseCase.js";
import { GetReRegistrationTariffsUseCase } from "../../../application/use-cases/GetReRegistrationTariffsUseCase.js";
import { UpdateReRegistrationTariffUseCase } from "../../../application/use-cases/UpdateReRegistrationTariffUseCase.js";
import { DeleteReRegistrationTariffUseCase } from "../../../application/use-cases/DeleteReRegistrationTariffUseCase.js";
import { logActivity } from "../../utils/activityLogger.js";

export class ReRegistrationTariffController {
  constructor(
    private createUseCase: CreateReRegistrationTariffUseCase,
    private getUseCase: GetReRegistrationTariffsUseCase,
    private updateUseCase: UpdateReRegistrationTariffUseCase,
    private deleteUseCase: DeleteReRegistrationTariffUseCase
  ) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { schoolUnitId, enrollmentYear, newStudentFee, promotionFee, repeatFee } = req.body;
      const result = await this.createUseCase.execute({
        schoolUnitId,
        enrollmentYear,
        newStudentFee,
        promotionFee,
        repeatFee,
      });

      // Log Activity
      if (req.user) {
        await logActivity(
          req.user.id,
          "CREATE_REREG_TARIFF",
          `Menambahkan tarif daftar ulang baru untuk unit ID ${schoolUnitId} angkatan ${enrollmentYear}`,
          req
        );
      }

      res.status(201).json({
        success: true,
        message: "Tarif daftar ulang berhasil ditambahkan",
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { schoolUnitId } = req.query;
      const filter = schoolUnitId
        ? { schoolUnitId: Number(schoolUnitId) }
        : undefined;
      const result = await this.getUseCase.execute(filter);

      res.status(200).json({
        success: true,
        message: "Daftar tarif daftar ulang berhasil diambil",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { newStudentFee, promotionFee, repeatFee } = req.body;
      const result = await this.updateUseCase.execute(Number(id), {
        newStudentFee,
        promotionFee,
        repeatFee,
      });

      // Log Activity
      if (req.user) {
        await logActivity(
          req.user.id,
          "UPDATE_REREG_TARIFF",
          `Mengupdate tarif daftar ulang ID: ${id}`,
          req
        );
      }

      res.status(200).json({
        success: true,
        message: "Tarif daftar ulang berhasil diperbarui",
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.deleteUseCase.execute(Number(id));

      // Log Activity
      if (req.user) {
        await logActivity(
          req.user.id,
          "DELETE_REREG_TARIFF",
          `Menghapus tarif daftar ulang dengan ID: ${id}`,
          req
        );
      }

      res.status(200).json({
        success: true,
        message: "Tarif daftar ulang berhasil dihapus",
      });
    } catch (error: any) {
      next(error);
    }
  }
}

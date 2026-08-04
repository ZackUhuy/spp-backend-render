import type { Request, Response, NextFunction } from "express";
import { CreateSppTariffUseCase } from "../../../application/use-cases/CreateSppTariffUseCase.js";
import { GetSppTariffsUseCase } from "../../../application/use-cases/GetSppTariffsUseCase.js";
import { UpdateSppTariffUseCase } from "../../../application/use-cases/UpdateSppTariffUseCase.js";
import { DeleteSppTariffUseCase } from "../../../application/use-cases/DeleteSppTariffUseCase.js";
import { logActivity } from "../../utils/activityLogger.js";

export class SppTariffController {
  constructor(
    private createSppTariffUseCase: CreateSppTariffUseCase,
    private getSppTariffsUseCase: GetSppTariffsUseCase,
    private updateSppTariffUseCase: UpdateSppTariffUseCase,
    private deleteSppTariffUseCase: DeleteSppTariffUseCase
  ) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { schoolUnitId, enrollmentYear, amount, developmentFee, reRegistrationFee, equipmentFee, extracurricularFee, uniformFee } = req.body;
      const result = await this.createSppTariffUseCase.execute({
        schoolUnitId,
        enrollmentYear,
        amount,
        developmentFee,
        reRegistrationFee,
        equipmentFee,
        extracurricularFee,
        uniformFee,
      });

      // Log Aktivitas
      if (req.user) {
        await logActivity(
          req.user.id,
          "CREATE_SPP_TARIFF",
          `Menambahkan tarif SPP baru untuk unit sekolah ID ${schoolUnitId} angkatan ${enrollmentYear} sebesar Rp ${amount.toLocaleString("id-ID")}`,
          req
        );
      }

      res.status(201).json({
        success: true,
        message: "Tarif SPP berhasil ditambahkan",
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
      const result = await this.getSppTariffsUseCase.execute(filter);

      res.status(200).json({
        success: true,
        message: "Daftar tarif SPP berhasil diambil",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { amount, developmentFee, reRegistrationFee, equipmentFee, extracurricularFee, uniformFee } = req.body;
      const result = await this.updateSppTariffUseCase.execute(
        Number(id),
        amount,
        developmentFee,
        reRegistrationFee,
        equipmentFee,
        extracurricularFee,
        uniformFee
      );

      // Log Aktivitas
      if (req.user) {
        await logActivity(
          req.user.id,
          "UPDATE_SPP_TARIFF",
          `Mengupdate tarif SPP ID: ${id} menjadi Rp ${amount ? amount.toLocaleString("id-ID") : "tidak berubah"}`,
          req
        );
      }

      res.status(200).json({
        success: true,
        message: "Tarif SPP berhasil diperbarui",
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      await this.deleteSppTariffUseCase.execute(Number(id));

      // Log Aktivitas
      if (req.user) {
        await logActivity(
          req.user.id,
          "DELETE_SPP_TARIFF",
          `Menghapus tarif SPP dengan ID: ${id}`,
          req
        );
      }

      res.status(200).json({
        success: true,
        message: "Tarif SPP berhasil dihapus",
      });
    } catch (error: any) {
      next(error);
    }
  }
}

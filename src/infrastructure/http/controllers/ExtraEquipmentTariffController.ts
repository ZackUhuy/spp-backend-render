import type { Request, Response, NextFunction } from "express";
import { CreateExtraEquipmentTariffUseCase } from "../../../application/use-cases/CreateExtraEquipmentTariffUseCase.js";
import { GetExtraEquipmentTariffsUseCase } from "../../../application/use-cases/GetExtraEquipmentTariffsUseCase.js";
import { UpdateExtraEquipmentTariffUseCase } from "../../../application/use-cases/UpdateExtraEquipmentTariffUseCase.js";
import { DeleteExtraEquipmentTariffUseCase } from "../../../application/use-cases/DeleteExtraEquipmentTariffUseCase.js";
import { logActivity } from "../../utils/activityLogger.js";

export class ExtraEquipmentTariffController {
  constructor(
    private createUseCase: CreateExtraEquipmentTariffUseCase,
    private getUseCase: GetExtraEquipmentTariffsUseCase,
    private updateUseCase: UpdateExtraEquipmentTariffUseCase,
    private deleteUseCase: DeleteExtraEquipmentTariffUseCase
  ) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const {
        schoolUnitId,
        enrollmentYear,
        level,
        equipmentFeeNew,
        extracurricularFeeNew,
        equipmentFeePromotion,
        extracurricularFeePromotion,
        equipmentFeeRepeat,
        extracurricularFeeRepeat,
        equipmentFee,
        extracurricularFee
      } = req.body;

      const payload: any = {
        schoolUnitId: Number(schoolUnitId),
        enrollmentYear: Number(enrollmentYear),
        level,
      };
      if (equipmentFeeNew !== undefined) payload.equipmentFeeNew = Number(equipmentFeeNew);
      if (extracurricularFeeNew !== undefined) payload.extracurricularFeeNew = Number(extracurricularFeeNew);
      if (equipmentFeePromotion !== undefined) payload.equipmentFeePromotion = Number(equipmentFeePromotion);
      if (extracurricularFeePromotion !== undefined) payload.extracurricularFeePromotion = Number(extracurricularFeePromotion);
      if (equipmentFeeRepeat !== undefined) payload.equipmentFeeRepeat = Number(equipmentFeeRepeat);
      if (extracurricularFeeRepeat !== undefined) payload.extracurricularFeeRepeat = Number(extracurricularFeeRepeat);
      if (equipmentFee !== undefined) payload.equipmentFee = Number(equipmentFee);
      if (extracurricularFee !== undefined) payload.extracurricularFee = Number(extracurricularFee);

      const result = await this.createUseCase.execute(payload);

      // Log Activity
      if (req.user) {
        await logActivity(
          req.user.id,
          "CREATE_EXTRA_EQUIPMENT_TARIFF",
          `Menambahkan tarif ekstra & peralatan baru untuk unit ID ${schoolUnitId} angkatan ${enrollmentYear} level ${level}`,
          req
        );
      }

      res.status(201).json({
        success: true,
        message: "Tarif ekstra & peralatan berhasil ditambahkan",
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
        message: "Daftar tarif ekstra & peralatan berhasil diambil",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const {
        equipmentFeeNew,
        extracurricularFeeNew,
        equipmentFeePromotion,
        extracurricularFeePromotion,
        equipmentFeeRepeat,
        extracurricularFeeRepeat,
        equipmentFee,
        extracurricularFee
      } = req.body;

      const updateData: any = {};
      if (equipmentFeeNew !== undefined) updateData.equipmentFeeNew = Number(equipmentFeeNew);
      if (extracurricularFeeNew !== undefined) updateData.extracurricularFeeNew = Number(extracurricularFeeNew);
      if (equipmentFeePromotion !== undefined) updateData.equipmentFeePromotion = Number(equipmentFeePromotion);
      if (extracurricularFeePromotion !== undefined) updateData.extracurricularFeePromotion = Number(extracurricularFeePromotion);
      if (equipmentFeeRepeat !== undefined) updateData.equipmentFeeRepeat = Number(equipmentFeeRepeat);
      if (extracurricularFeeRepeat !== undefined) updateData.extracurricularFeeRepeat = Number(extracurricularFeeRepeat);
      if (equipmentFee !== undefined) updateData.equipmentFee = Number(equipmentFee);
      if (extracurricularFee !== undefined) updateData.extracurricularFee = Number(extracurricularFee);

      const result = await this.updateUseCase.execute(Number(id), updateData);

      // Log Activity
      if (req.user) {
        await logActivity(
          req.user.id,
          "UPDATE_EXTRA_EQUIPMENT_TARIFF",
          `Mengupdate tarif ekstra & peralatan ID: ${id}`,
          req
        );
      }

      res.status(200).json({
        success: true,
        message: "Tarif ekstra & peralatan berhasil diperbarui",
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
          "DELETE_EXTRA_EQUIPMENT_TARIFF",
          `Menghapus tarif ekstra & peralatan dengan ID: ${id}`,
          req
        );
      }

      res.status(200).json({
        success: true,
        message: "Tarif ekstra & peralatan berhasil dihapus",
      });
    } catch (error: any) {
      next(error);
    }
  }
}

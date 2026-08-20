import type { Request, Response, NextFunction } from "express";
import type { CreateFulldayTariffUseCase } from "../../../application/use-cases/CreateFulldayTariffUseCase.js";
import type { UpdateFulldayTariffUseCase } from "../../../application/use-cases/UpdateFulldayTariffUseCase.js";
import type { DeleteFulldayTariffUseCase } from "../../../application/use-cases/DeleteFulldayTariffUseCase.js";
import type { GetFulldayTariffsUseCase } from "../../../application/use-cases/GetFulldayTariffsUseCase.js";

export class FulldayTariffController {
  constructor(
    private createFulldayTariffUseCase: CreateFulldayTariffUseCase,
    private updateFulldayTariffUseCase: UpdateFulldayTariffUseCase,
    private deleteFulldayTariffUseCase: DeleteFulldayTariffUseCase,
    private getFulldayTariffsUseCase: GetFulldayTariffsUseCase
  ) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { schoolUnitId, enrollmentYear, monthlyFee } = req.body;
      const result = await this.createFulldayTariffUseCase.execute({
        schoolUnitId: Number(schoolUnitId),
        enrollmentYear: Number(enrollmentYear),
        monthlyFee: Number(monthlyFee),
      });
      res.status(201).json({
        success: true,
        message: "Tarif Fullday berhasil ditambahkan",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.getFulldayTariffsUseCase.execute();
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      const { schoolUnitId, enrollmentYear, monthlyFee } = req.body;
      const payload: any = {};
      if (schoolUnitId !== undefined) payload.schoolUnitId = Number(schoolUnitId);
      if (enrollmentYear !== undefined) payload.enrollmentYear = Number(enrollmentYear);
      if (monthlyFee !== undefined) payload.monthlyFee = Number(monthlyFee);
      const result = await this.updateFulldayTariffUseCase.execute(id, payload);
      res.status(200).json({
        success: true,
        message: "Tarif Fullday berhasil diperbarui",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = Number(req.params.id);
      await this.deleteFulldayTariffUseCase.execute(id);
      res.status(200).json({
        success: true,
        message: "Tarif Fullday berhasil dihapus",
      });
    } catch (error) {
      next(error);
    }
  }
}

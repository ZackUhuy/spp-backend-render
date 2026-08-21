import type { Request, Response, NextFunction } from "express";
import { CreateSdExtracurricularUseCase } from "../../../application/use-cases/CreateSdExtracurricularUseCase.js";
import { GetSdExtracurricularsUseCase } from "../../../application/use-cases/GetSdExtracurricularsUseCase.js";
import { UpdateSdExtracurricularUseCase } from "../../../application/use-cases/UpdateSdExtracurricularUseCase.js";
import { DeleteSdExtracurricularUseCase } from "../../../application/use-cases/DeleteSdExtracurricularUseCase.js";
import { logActivity } from "../../utils/activityLogger.js";

export class SdExtracurricularController {
  constructor(
    private createUseCase: CreateSdExtracurricularUseCase,
    private getUseCase: GetSdExtracurricularsUseCase,
    private updateUseCase: UpdateSdExtracurricularUseCase,
    private deleteUseCase: DeleteSdExtracurricularUseCase
  ) {}

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, fee } = req.body;
      const payload: any = { name };
      if (fee !== undefined) payload.fee = Number(fee);
      
      const result = await this.createUseCase.execute(payload);

      if (req.user) {
        await logActivity(
          req.user.id,
          "CREATE_SD_EXTRACURRICULAR",
          `Menambahkan eskul SD baru: ${result.name} dengan tarif ${result.fee}`,
          req
        );
      }

      res.status(201).json({
        success: true,
        message: "Ekstrakurikuler SD berhasil ditambahkan",
        data: result,
      });
    } catch (error: any) {
      next(error);
    }
  }

  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await this.getUseCase.execute();

      res.status(200).json({
        success: true,
        message: "Daftar ekstrakurikuler SD berhasil diambil",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { name, fee } = req.body;

      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (fee !== undefined) updateData.fee = Number(fee);

      const result = await this.updateUseCase.execute(Number(id), updateData);

      if (req.user) {
        await logActivity(
          req.user.id,
          "UPDATE_SD_EXTRACURRICULAR",
          `Mengupdate eskul SD ID: ${id} menjadi ${result.name}`,
          req
        );
      }

      res.status(200).json({
        success: true,
        message: "Ekstrakurikuler SD berhasil diperbarui",
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

      if (req.user) {
        await logActivity(
          req.user.id,
          "DELETE_SD_EXTRACURRICULAR",
          `Menghapus eskul SD ID: ${id}`,
          req
        );
      }

      res.status(200).json({
        success: true,
        message: "Ekstrakurikuler SD berhasil dihapus",
      });
    } catch (error: any) {
      next(error);
    }
  }
}

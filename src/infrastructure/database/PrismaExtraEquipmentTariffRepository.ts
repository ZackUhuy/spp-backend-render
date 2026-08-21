import prisma from "./prisma.js";
import type { IExtraEquipmentTariffRepository } from "../../domain/repositories/IExtraEquipmentTariffRepository.js";
import { ExtraEquipmentTariff } from "../../domain/entities/ExtraEquipmentTariff.js";

export class PrismaExtraEquipmentTariffRepository implements IExtraEquipmentTariffRepository {
  private prisma = prisma;

  private mapToDomain(t: any): ExtraEquipmentTariff {
    return new ExtraEquipmentTariff(
      t.id,
      t.schoolUnitId,
      t.enrollmentYear,
      t.level,
      t.equipmentFeeNew,
      t.extracurricularFeeNew,
      t.equipmentFeePromotion,
      t.extracurricularFeePromotion,
      t.equipmentFeeRepeat,
      t.extracurricularFeeRepeat,
      t.equipmentFee,
      t.extracurricularFee
    );
  }

  async create(data: Omit<ExtraEquipmentTariff, "id">): Promise<ExtraEquipmentTariff> {
    const created = await this.prisma.extraEquipmentTariff.create({
      data: {
        schoolUnitId: data.schoolUnitId,
        enrollmentYear: data.enrollmentYear,
        level: data.level,
        equipmentFeeNew: data.equipmentFeeNew,
        extracurricularFeeNew: data.extracurricularFeeNew,
        equipmentFeePromotion: data.equipmentFeePromotion,
        extracurricularFeePromotion: data.extracurricularFeePromotion,
        equipmentFeeRepeat: data.equipmentFeeRepeat,
        extracurricularFeeRepeat: data.extracurricularFeeRepeat,
        equipmentFee: data.equipmentFee,
        extracurricularFee: data.extracurricularFee,
      },
    });

    return this.mapToDomain(created);
  }

  async findAll(filter?: { schoolUnitId?: number }): Promise<ExtraEquipmentTariff[]> {
    const where: any = {};
    if (filter?.schoolUnitId !== undefined) {
      where.schoolUnitId = filter.schoolUnitId;
    }

    const tariffs = await this.prisma.extraEquipmentTariff.findMany({
      where,
    });

    return tariffs.map((t) => this.mapToDomain(t));
  }

  async findById(id: number): Promise<ExtraEquipmentTariff | null> {
    const tariff = await this.prisma.extraEquipmentTariff.findUnique({
      where: { id },
    });

    if (!tariff) return null;

    return this.mapToDomain(tariff);
  }

  async findByUnitYearAndLevel(
    schoolUnitId: number,
    enrollmentYear: number,
    level: string
  ): Promise<ExtraEquipmentTariff | null> {
    const tariff = await this.prisma.extraEquipmentTariff.findUnique({
      where: {
        uq_school_unit_enrollment_year_level: {
          schoolUnitId,
          enrollmentYear,
          level,
        },
      },
    });

    if (!tariff) return null;

    return this.mapToDomain(tariff);
  }

  async update(
    id: number,
    data: {
      equipmentFeeNew?: number;
      extracurricularFeeNew?: number;
      equipmentFeePromotion?: number;
      extracurricularFeePromotion?: number;
      equipmentFeeRepeat?: number;
      extracurricularFeeRepeat?: number;
      equipmentFee?: number;
      extracurricularFee?: number;
    }
  ): Promise<ExtraEquipmentTariff> {
    const dataToUpdate: any = {};
    if (data.equipmentFeeNew !== undefined) dataToUpdate.equipmentFeeNew = data.equipmentFeeNew;
    if (data.extracurricularFeeNew !== undefined) dataToUpdate.extracurricularFeeNew = data.extracurricularFeeNew;
    if (data.equipmentFeePromotion !== undefined) dataToUpdate.equipmentFeePromotion = data.equipmentFeePromotion;
    if (data.extracurricularFeePromotion !== undefined) dataToUpdate.extracurricularFeePromotion = data.extracurricularFeePromotion;
    if (data.equipmentFeeRepeat !== undefined) dataToUpdate.equipmentFeeRepeat = data.equipmentFeeRepeat;
    if (data.extracurricularFeeRepeat !== undefined) dataToUpdate.extracurricularFeeRepeat = data.extracurricularFeeRepeat;
    if (data.equipmentFee !== undefined) dataToUpdate.equipmentFee = data.equipmentFee;
    if (data.extracurricularFee !== undefined) dataToUpdate.extracurricularFee = data.extracurricularFee;

    const updated = await this.prisma.extraEquipmentTariff.update({
      where: { id },
      data: dataToUpdate,
    });

    return this.mapToDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.extraEquipmentTariff.delete({
      where: { id },
    });
  }
}

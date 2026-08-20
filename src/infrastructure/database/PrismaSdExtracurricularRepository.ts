import prisma from "./prisma.js";
import type { ISdExtracurricularRepository } from "../../domain/repositories/ISdExtracurricularRepository.js";
import { SdExtracurricular } from "../../domain/entities/SdExtracurricular.js";

export class PrismaSdExtracurricularRepository implements ISdExtracurricularRepository {
  private prisma = prisma;

  private mapToDomain(item: any): SdExtracurricular {
    return new SdExtracurricular(item.id, item.name, item.fee);
  }

  async create(data: Omit<SdExtracurricular, "id">): Promise<SdExtracurricular> {
    const created = await this.prisma.sdExtracurricular.create({
      data: {
        name: data.name,
        fee: data.fee,
      },
    });
    return this.mapToDomain(created);
  }

  async findAll(): Promise<SdExtracurricular[]> {
    const items = await this.prisma.sdExtracurricular.findMany({
      orderBy: { name: "asc" },
    });
    return items.map((item) => this.mapToDomain(item));
  }

  async findById(id: number): Promise<SdExtracurricular | null> {
    const item = await this.prisma.sdExtracurricular.findUnique({
      where: { id },
    });
    if (!item) return null;
    return this.mapToDomain(item);
  }

  async update(id: number, data: { name?: string; fee?: number }): Promise<SdExtracurricular> {
    const dataToUpdate: any = {};
    if (data.name !== undefined) dataToUpdate.name = data.name;
    if (data.fee !== undefined) dataToUpdate.fee = data.fee;

    const updated = await this.prisma.sdExtracurricular.update({
      where: { id },
      data: dataToUpdate,
    });
    return this.mapToDomain(updated);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.sdExtracurricular.delete({
      where: { id },
    });
  }
}

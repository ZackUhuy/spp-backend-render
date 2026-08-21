import type { ISdExtracurricularRepository } from "../../domain/repositories/ISdExtracurricularRepository.js";
import { SdExtracurricular } from "../../domain/entities/SdExtracurricular.js";

export class GetSdExtracurricularsUseCase {
  constructor(private sdExtracurricularRepository: ISdExtracurricularRepository) {}

  async execute(): Promise<SdExtracurricular[]> {
    return await this.sdExtracurricularRepository.findAll();
  }
}

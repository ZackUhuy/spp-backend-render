export class ExtraEquipmentTariff {
  constructor(
    public readonly id: number,
    public readonly schoolUnitId: number,
    public readonly enrollmentYear: number,
    public readonly level: string, // "KB", "A", "B"
    public readonly equipmentFeeNew: number = 0,
    public readonly extracurricularFeeNew: number = 0,
    public readonly equipmentFeePromotion: number = 0,
    public readonly extracurricularFeePromotion: number = 0,
    public readonly equipmentFeeRepeat: number = 0,
    public readonly extracurricularFeeRepeat: number = 0,
    public readonly equipmentFee: number = 0,
    public readonly extracurricularFee: number = 0
  ) {}
}

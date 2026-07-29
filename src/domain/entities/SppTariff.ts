export class SppTariff {
  constructor(
    public readonly id: number,
    public readonly schoolUnitId: number,
    public readonly enrollmentYear: number,
    public readonly amount: number,
    public readonly developmentFee: number = 0,
    public readonly reRegistrationFee: number = 0,
    public readonly equipmentFee: number = 0,
    public readonly extracurricularFee: number = 0,
    public readonly uniformFee: number = 0
  ) {}
}

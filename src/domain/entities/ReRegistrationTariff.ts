export class ReRegistrationTariff {
  constructor(
    public readonly id: number,
    public readonly schoolUnitId: number,
    public readonly enrollmentYear: number,
    public readonly newStudentFee: number = 0,
    public readonly promotionFee: number = 0,
    public readonly repeatFee: number = 0
  ) {}
}

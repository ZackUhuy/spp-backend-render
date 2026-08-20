# Walkthrough - Optional Fullday Tariff & Student Flag (KB & RA)

I have successfully implemented the optional Fullday tariff management, student-level Fullday enrollment toggling, and billing integration.

## Backend Changes

### 1. Database Schema & Migration (`schema.prisma`)
- Added `FULLDAY` to `InvoiceType` enum.
- Added `isFullday` boolean flag (mapped to `is_fullday` in PostgreSQL) with a default value of `false` on the `Student` model.
- Added `FulldayTariff` model to manage Fullday monthly fees restricted by `schoolUnitId` and `enrollmentYear`.

### 2. Domain & Application Layers
- **Domain Entity**: Created `FulldayTariff.ts`.
- **Repository Interface**: Created `IFulldayTariffRepository.ts`.
- **Infrastructure Repository**: Implemented `PrismaFulldayTariffRepository.ts` to execute CRUD operations on the database.
- **Use Cases**:
  - `CreateFulldayTariffUseCase`: Creates a Fullday tariff (restricted to school units KB & RA).
  - `UpdateFulldayTariffUseCase`: Updates monthly fees.
  - `DeleteFulldayTariffUseCase`: Removes a Fullday tariff.
  - `GetFulldayTariffsUseCase`: Retrieves tariffs list.

### 3. API Handlers & Routing
- **Controllers & Schemas**: Created `FulldayTariffController.ts` and `fulldayTariffSchema.ts` (validating request body via Zod).
- **Routes**: Registered `/api/fullday-tariffs` endpoints inside `fulldayTariffRoutes.ts` and initialized them in `app.ts`.
- **Student Middleware**: Integrated `isFullday` state toggling into student creation and update schemas/use-cases.
- **Invoice & Payment Processors**:
  - `InvoiceController`: Calculates and injects monthly Fullday fees when generating billing reports for enrolled students.
  - `ProcessOfflinePaymentUseCase`: Adds support for processing payment type `FULLDAY`.

---

## Next Steps for Testing:
1. Run database migrations to apply the new schema:
   ```powershell
   npx prisma migrate dev --name add_fullday_tariffs_and_student_flag
   ```
2. Start the backend development server:
   ```powershell
   npm run dev
   ```

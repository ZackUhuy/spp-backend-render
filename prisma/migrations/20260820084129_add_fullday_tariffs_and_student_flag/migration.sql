-- AlterEnum
ALTER TYPE "InvoiceType" ADD VALUE 'FULLDAY';

-- AlterTable
ALTER TABLE "students" ADD COLUMN     "is_fullday" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "fullday_tariffs" (
    "id" SERIAL NOT NULL,
    "school_unit_id" INTEGER NOT NULL,
    "enrollment_year" INTEGER NOT NULL,
    "monthly_fee" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "fullday_tariffs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "fullday_tariffs_school_unit_id_enrollment_year_key" ON "fullday_tariffs"("school_unit_id", "enrollment_year");

-- AddForeignKey
ALTER TABLE "fullday_tariffs" ADD CONSTRAINT "fullday_tariffs_school_unit_id_fkey" FOREIGN KEY ("school_unit_id") REFERENCES "school_units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

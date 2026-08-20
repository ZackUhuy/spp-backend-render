-- AlterTable
ALTER TABLE "students" ADD COLUMN     "discount_equipment" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "discount_extracurricular" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "registration_status" VARCHAR(50) NOT NULL DEFAULT 'BARU';

-- CreateTable
CREATE TABLE "re_registration_tariffs" (
    "id" SERIAL NOT NULL,
    "school_unit_id" INTEGER NOT NULL,
    "enrollment_year" INTEGER NOT NULL,
    "new_student_fee" INTEGER NOT NULL DEFAULT 0,
    "promotion_fee" INTEGER NOT NULL DEFAULT 0,
    "repeat_fee" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "re_registration_tariffs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "re_registration_tariffs_school_unit_id_enrollment_year_key" ON "re_registration_tariffs"("school_unit_id", "enrollment_year");

-- AddForeignKey
ALTER TABLE "re_registration_tariffs" ADD CONSTRAINT "re_registration_tariffs_school_unit_id_fkey" FOREIGN KEY ("school_unit_id") REFERENCES "school_units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

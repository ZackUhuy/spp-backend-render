-- AlterTable
ALTER TABLE "extra_equipment_tariffs" ADD COLUMN     "equipment_fee_new" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "equipment_fee_promotion" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "equipment_fee_repeat" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "extracurricular_fee_new" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "extracurricular_fee_promotion" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "extracurricular_fee_repeat" INTEGER NOT NULL DEFAULT 0;

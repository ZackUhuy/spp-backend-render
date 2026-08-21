-- CreateTable
CREATE TABLE "extra_equipment_tariffs" (
    "id" SERIAL NOT NULL,
    "school_unit_id" INTEGER NOT NULL,
    "enrollment_year" INTEGER NOT NULL,
    "level" VARCHAR(50) NOT NULL,
    "equipment_fee" INTEGER NOT NULL DEFAULT 0,
    "extracurricular_fee" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "extra_equipment_tariffs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "extra_equipment_tariffs_school_unit_id_enrollment_year_leve_key" ON "extra_equipment_tariffs"("school_unit_id", "enrollment_year", "level");

-- AddForeignKey
ALTER TABLE "extra_equipment_tariffs" ADD CONSTRAINT "extra_equipment_tariffs_school_unit_id_fkey" FOREIGN KEY ("school_unit_id") REFERENCES "school_units"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterEnum
ALTER TYPE "InvoiceType" ADD VALUE 'SERAGAM';

-- AlterTable
ALTER TABLE "spp_tariffs" ADD COLUMN     "extracurricular_fee" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "uniform_fee" INTEGER NOT NULL DEFAULT 0;

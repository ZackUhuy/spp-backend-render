-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "InvoiceType" ADD VALUE 'UANG_PENGEMBANGAN';
ALTER TYPE "InvoiceType" ADD VALUE 'DAFTAR_ULANG';
ALTER TYPE "InvoiceType" ADD VALUE 'UANG_PERALATAN';

-- AlterTable
ALTER TABLE "spp_tariffs" ADD COLUMN     "development_fee" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "equipment_fee" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "re_registration_fee" INTEGER NOT NULL DEFAULT 0;

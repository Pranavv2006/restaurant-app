-- AlterTable
ALTER TABLE "public"."Menu" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'snacks';

-- AlterTable
ALTER TABLE "public"."Restaurant" ADD COLUMN     "latitude" DECIMAL(65,30),
ADD COLUMN     "longitude" DECIMAL(65,30);

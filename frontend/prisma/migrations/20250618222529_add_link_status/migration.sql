-- CreateEnum
CREATE TYPE "LinkStatus" AS ENUM ('ACTIVE', 'PAUSED');

-- AlterTable
ALTER TABLE "urls" ADD COLUMN     "status" "LinkStatus" NOT NULL DEFAULT 'ACTIVE';

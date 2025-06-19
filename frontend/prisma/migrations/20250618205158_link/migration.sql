/*
  Warnings:

  - You are about to drop the column `targetUrl` on the `urls` table. All the data in the column will be lost.
  - Added the required column `target_url` to the `urls` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "urls" DROP COLUMN "targetUrl",
ADD COLUMN     "target_url" TEXT NOT NULL;

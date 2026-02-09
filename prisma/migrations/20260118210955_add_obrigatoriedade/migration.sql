/*
  Warnings:

  - Made the column `cor` on table `Banco` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Banco" ALTER COLUMN "cor" SET NOT NULL;

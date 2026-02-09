/*
  Warnings:

  - Made the column `valorTotal` on table `Transacao` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Transacao" ALTER COLUMN "valorTotal" SET NOT NULL;

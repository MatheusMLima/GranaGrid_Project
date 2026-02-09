/*
  Warnings:

  - Made the column `metodoPagamento` on table `Transacao` required. This step will fail if there are existing NULL values in that column.
  - Made the column `numeroParcela` on table `Transacao` required. This step will fail if there are existing NULL values in that column.
  - Made the column `totalParcelas` on table `Transacao` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Transacao" ADD COLUMN     "valorTotal" INTEGER,
ALTER COLUMN "metodoPagamento" SET NOT NULL,
ALTER COLUMN "numeroParcela" SET NOT NULL,
ALTER COLUMN "totalParcelas" SET NOT NULL;

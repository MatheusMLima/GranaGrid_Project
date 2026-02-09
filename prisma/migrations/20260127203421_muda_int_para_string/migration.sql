-- AlterTable
ALTER TABLE "Transacao" 
ALTER COLUMN "valor" SET DATA TYPE TEXT USING "valor"::TEXT,
ALTER COLUMN "valorTotal" SET DATA TYPE TEXT USING "valorTotal"::TEXT;
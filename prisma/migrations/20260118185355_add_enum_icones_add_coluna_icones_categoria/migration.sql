-- CreateEnum
CREATE TYPE "Icones" AS ENUM ('SHOPPING', 'CAR', 'HARDWARE', 'HOUSE', 'TV', 'CAR_TAXI', 'HEALTH', 'FOOD', 'HOBBIE', 'DOLLAR', 'TRAVEL');

-- AlterTable
ALTER TABLE "Categoria" ADD COLUMN     "icone" "Icones";

/*
  Warnings:

  - You are about to drop the column `userId` on the `patient` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `patient` DROP FOREIGN KEY `Patient_userId_fkey`;

-- DropIndex
DROP INDEX `Patient_userId_fkey` ON `patient`;

-- AlterTable
ALTER TABLE `patient` DROP COLUMN `userId`;

/*
  Warnings:

  - Added the required column `availableDateId` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `session` ADD COLUMN `availableDateId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_availableDateId_fkey` FOREIGN KEY (`availableDateId`) REFERENCES `AvailableDate`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

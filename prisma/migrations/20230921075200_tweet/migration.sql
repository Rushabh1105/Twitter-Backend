/*
  Warnings:

  - A unique constraint covering the columns `[userName]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `tweet` MODIFY `image` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_userName_key` ON `User`(`userName`);

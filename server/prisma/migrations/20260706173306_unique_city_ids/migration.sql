/*
  Warnings:

  - A unique constraint covering the columns `[cityId]` on the table `tax` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cityId]` on the table `weather` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `tax_cityId_key` ON `tax`(`cityId`);

-- CreateIndex
CREATE UNIQUE INDEX `weather_cityId_key` ON `weather`(`cityId`);

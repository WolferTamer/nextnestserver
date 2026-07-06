-- CreateTable
CREATE TABLE `city` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `state` VARCHAR(255) NOT NULL,
    `statecode` VARCHAR(255) NOT NULL,
    `density` FLOAT NOT NULL,
    `growth` FLOAT NOT NULL,
    `population` INTEGER NOT NULL,
    `lat` FLOAT NOT NULL,
    `lon` FLOAT NOT NULL,
    `createdAt` DATETIME(0) NOT NULL,
    `updatedAt` DATETIME(0) NOT NULL,

    UNIQUE INDEX `city_name_state`(`name`, `state`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `incometax` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `state` VARCHAR(255) NOT NULL,
    `bracket` INTEGER NULL,
    `rate` FLOAT NOT NULL,
    `married` BOOLEAN NOT NULL,
    `createdAt` DATETIME(0) NOT NULL,
    `updatedAt` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tax` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `salestax` FLOAT NULL,
    `propertytaxquarter` FLOAT NULL,
    `propertytaxthreequarters` FLOAT NULL,
    `createdAt` DATETIME(0) NOT NULL,
    `updatedAt` DATETIME(0) NOT NULL,
    `cityId` INTEGER NOT NULL,
    `localtaxes` BOOLEAN NULL,
    `singlestandarddeduction` INTEGER NULL,
    `marriedstandarddeduction` INTEGER NULL,

    INDEX `cityId`(`cityId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `userid` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `salary` INTEGER NULL,
    `createdAt` DATETIME(0) NOT NULL,
    `updatedAt` DATETIME(0) NOT NULL,

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`userid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `weather` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `jantemp` FLOAT NULL,
    `janhumidity` FLOAT NULL,
    `janprecipitation` FLOAT NULL,
    `janwind` FLOAT NULL,
    `janclouds` FLOAT NULL,
    `julytemp` FLOAT NULL,
    `julyhumidity` FLOAT NULL,
    `julyprecipitation` FLOAT NULL,
    `julyclouds` FLOAT NULL,
    `julywind` FLOAT NULL,
    `createdAt` DATETIME(0) NOT NULL,
    `updatedAt` DATETIME(0) NOT NULL,
    `cityId` INTEGER NOT NULL,

    INDEX `cityId`(`cityId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `tax` ADD CONSTRAINT `tax_ibfk_1` FOREIGN KEY (`cityId`) REFERENCES `city`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `weather` ADD CONSTRAINT `weather_ibfk_1` FOREIGN KEY (`cityId`) REFERENCES `city`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

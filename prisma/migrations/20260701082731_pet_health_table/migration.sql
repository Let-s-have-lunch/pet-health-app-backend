-- CreateTable
CREATE TABLE `WalkLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `walkDate` DATETIME(3) NOT NULL,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NOT NULL,
    `duration` INTEGER NOT NULL,
    `distance` DOUBLE NULL,
    `memo` VARCHAR(191) NULL,
    `petId` INTEGER NOT NULL,

    INDEX `WalkLog_petId_idx`(`petId`),
    INDEX `WalkLog_walkDate_idx`(`walkDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `VetRecord` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `visitDate` DATETIME(3) NOT NULL,
    `hospitalName` VARCHAR(191) NOT NULL,
    `visitPurpose` VARCHAR(191) NOT NULL,
    `diagnosis` VARCHAR(191) NULL,
    `treatment` VARCHAR(191) NULL,
    `cost` INTEGER NULL,
    `receiptImage` VARCHAR(191) NULL,
    `memo` VARCHAR(191) NULL,
    `petId` INTEGER NOT NULL,

    INDEX `VetRecord_petId_idx`(`petId`),
    INDEX `VetRecord_visitDate_idx`(`visitDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WeightLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `recordDate` DATETIME(3) NOT NULL,
    `weight` DOUBLE NOT NULL,
    `memo` VARCHAR(191) NULL,
    `petId` INTEGER NOT NULL,

    INDEX `WeightLog_petId_idx`(`petId`),
    INDEX `WeightLog_recordDate_idx`(`recordDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WaterLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,
    `recordDate` DATETIME(3) NOT NULL,
    `amount` INTEGER NOT NULL,
    `memo` VARCHAR(191) NULL,
    `petId` INTEGER NOT NULL,

    INDEX `WaterLog_petId_idx`(`petId`),
    INDEX `WaterLog_recordDate_idx`(`recordDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

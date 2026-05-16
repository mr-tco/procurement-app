-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "IndentStatus" AS ENUM ('OPEN', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "RfqStatus" AS ENUM ('DRAFT', 'SENT', 'CLOSED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vendor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "contactEmail" TEXT,
    "phone" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Indent" (
    "id" TEXT NOT NULL,
    "requestNumber" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "status" "IndentStatus" NOT NULL DEFAULT 'OPEN',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "itemId" TEXT NOT NULL,
    "requestedById" TEXT NOT NULL,

    CONSTRAINT "Indent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mi" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "receivedQty" INTEGER NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "indentId" TEXT NOT NULL,

    CONSTRAINT "Mi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rfq" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "quotedPrice" DECIMAL(10,2) NOT NULL,
    "status" "RfqStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "itemId" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,

    CONSTRAINT "Rfq_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Indent_requestNumber_key" ON "Indent"("requestNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Mi_number_key" ON "Mi"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Rfq_number_key" ON "Rfq"("number");

-- AddForeignKey
ALTER TABLE "Indent" ADD CONSTRAINT "Indent_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Indent" ADD CONSTRAINT "Indent_requestedById_fkey" FOREIGN KEY ("requestedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mi" ADD CONSTRAINT "Mi_indentId_fkey" FOREIGN KEY ("indentId") REFERENCES "Indent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rfq" ADD CONSTRAINT "Rfq_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rfq" ADD CONSTRAINT "Rfq_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

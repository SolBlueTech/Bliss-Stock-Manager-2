-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "scope" TEXT,
    "expires" TIMESTAMP(3),
    "accessToken" TEXT NOT NULL,
    "userId" BIGINT,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "accountOwner" BOOLEAN NOT NULL DEFAULT false,
    "locale" TEXT,
    "collaborator" BOOLEAN DEFAULT false,
    "emailVerified" BOOLEAN DEFAULT false,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "shopifyGid" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "vendor" TEXT,
    "productType" TEXT,
    "status" TEXT,
    "tagsCsv" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3),

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" TEXT NOT NULL,
    "shopifyGid" TEXT NOT NULL,
    "inventoryItemGid" TEXT,
    "legacyId" BIGINT,
    "productId" TEXT NOT NULL,
    "title" TEXT,
    "sku" TEXT,
    "price" DECIMAL(65,30) NOT NULL,
    "compareAtPrice" DECIMAL(65,30),
    "position" INTEGER,
    "availableForSale" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VariantInventoryLevel" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "locationGid" TEXT NOT NULL,
    "locationName" TEXT NOT NULL,
    "available" INTEGER NOT NULL,

    CONSTRAINT "VariantInventoryLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "shop" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "email" TEXT,
    "name" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PhysicalCount" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "userId" TEXT,
    "counted" INTEGER NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PhysicalCount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SaleEvent" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SaleEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_shopifyGid_key" ON "Product"("shopifyGid");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_shopifyGid_key" ON "ProductVariant"("shopifyGid");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_inventoryItemGid_key" ON "ProductVariant"("inventoryItemGid");

-- CreateIndex
CREATE INDEX "VariantInventoryLevel_variantId_idx" ON "VariantInventoryLevel"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "User_staffId_key" ON "User"("staffId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_shop_idx" ON "User"("shop");

-- CreateIndex
CREATE INDEX "PhysicalCount_variantId_createdAt_idx" ON "PhysicalCount"("variantId", "createdAt");

-- CreateIndex
CREATE INDEX "SaleEvent_variantId_occurredAt_idx" ON "SaleEvent"("variantId", "occurredAt");

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VariantInventoryLevel" ADD CONSTRAINT "VariantInventoryLevel_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhysicalCount" ADD CONSTRAINT "PhysicalCount_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PhysicalCount" ADD CONSTRAINT "PhysicalCount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SaleEvent" ADD CONSTRAINT "SaleEvent_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;


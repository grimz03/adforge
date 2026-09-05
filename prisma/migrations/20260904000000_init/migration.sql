CREATE TABLE "User" ("id" TEXT NOT NULL, "name" TEXT NOT NULL, "email" TEXT NOT NULL, "passwordHash" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "User_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE TABLE "Business" ("id" TEXT NOT NULL, "userId" TEXT NOT NULL, "name" TEXT NOT NULL, "logo" TEXT, "phone" TEXT, "website" TEXT, "address" TEXT, "socials" TEXT, "description" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Business_pkey" PRIMARY KEY ("id"));
CREATE UNIQUE INDEX "Business_userId_key" ON "Business"("userId");
CREATE TABLE "Campaign" ("id" TEXT NOT NULL, "userId" TEXT NOT NULL, "business" TEXT NOT NULL, "adType" TEXT NOT NULL, "location" TEXT NOT NULL, "packageName" TEXT NOT NULL, "price" INTEGER NOT NULL, "headline" TEXT NOT NULL, "primaryText" TEXT NOT NULL, "cta" TEXT NOT NULL, "badge" TEXT NOT NULL, "offer" TEXT NOT NULL, "status" TEXT NOT NULL DEFAULT 'Draft', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id"));
CREATE INDEX "Campaign_userId_createdAt_idx" ON "Campaign"("userId", "createdAt");
ALTER TABLE "Business" ADD CONSTRAINT "Business_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

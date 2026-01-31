/*
  Warnings:

  - Added the required column `provider` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."Provider" AS ENUM ('Google');

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "provider" "public"."Provider" NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;

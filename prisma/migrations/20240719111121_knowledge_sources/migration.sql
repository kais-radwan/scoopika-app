/*
  Warnings:

  - Added the required column `type` to the `KnowledgeSource` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_KnowledgeSource" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "storeId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "vectors" TEXT NOT NULL,
    "type" TEXT NOT NULL
);
INSERT INTO "new_KnowledgeSource" ("fileId", "id", "name", "storeId", "userId", "vectors") SELECT "fileId", "id", "name", "storeId", "userId", "vectors" FROM "KnowledgeSource";
DROP TABLE "KnowledgeSource";
ALTER TABLE "new_KnowledgeSource" RENAME TO "KnowledgeSource";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

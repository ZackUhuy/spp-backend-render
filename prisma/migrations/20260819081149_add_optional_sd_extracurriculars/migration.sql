-- CreateTable
CREATE TABLE "sd_extracurriculars" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "fee" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "sd_extracurriculars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_StudentSdExtracurriculars" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_StudentSdExtracurriculars_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_StudentSdExtracurriculars_B_index" ON "_StudentSdExtracurriculars"("B");

-- AddForeignKey
ALTER TABLE "_StudentSdExtracurriculars" ADD CONSTRAINT "_StudentSdExtracurriculars_A_fkey" FOREIGN KEY ("A") REFERENCES "sd_extracurriculars"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentSdExtracurriculars" ADD CONSTRAINT "_StudentSdExtracurriculars_B_fkey" FOREIGN KEY ("B") REFERENCES "students"("id") ON DELETE CASCADE ON UPDATE CASCADE;

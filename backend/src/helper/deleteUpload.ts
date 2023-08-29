import { PrismaClient } from "@prisma/client";
import fs from "fs";
import { File } from "@prisma/client";
import path from "path";

const prisma = new PrismaClient();

export const deleteUploadHelper = async (uploadId: number) => {
    // Delete upload and files from database go through files and delete them as well as remove them from storage

    const upload = await prisma.upload.findUnique({
        where: {
            id: uploadId,
        },
        include: {
            files: true,
        },
    });

    if (!upload) return;

    // Delete files from storage
    upload.files.forEach((file: File) => {
        // Delete file from storage
        fs.unlinkSync(path.join(__dirname, "..", "..", "uploads", upload.path, file.name));
    });

    // Delete upload from storage
    fs.rmdirSync(path.join(__dirname, "..", "..", "uploads", upload.path));

    // Delete upload from database
    await prisma.upload.delete({
        where: {
            id: uploadId,
        },
    });
};

export default deleteUploadHelper;
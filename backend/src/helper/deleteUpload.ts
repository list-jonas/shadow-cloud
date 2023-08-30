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

    // Delete upload folder with files from storage
    fs.rm(path.join(__dirname, "..", "..", "uploads", upload.path), {
        recursive: true,
        }, (error) => {
            if (error) {
                console.log(error);
            }
        }
    );

    // Delete files from database
    await prisma.file.deleteMany({
        where: {
            uploadId: uploadId,
        },
    });

    // Delete upload from database
    await prisma.upload.delete({
        where: {
            id: uploadId,
        },
    });

    // If user has no files left, delete user folder from storage using user.name
    const user = await prisma.user.findUnique({
        where: {
            id: upload.userId,
        },
        include: {
            uploads: true,
        },
    });

    if (!user) return;

    if (user.uploads.length === 0) {
        fs.rm(path.join(__dirname, "..", "..", "uploads", user.name), {
            recursive: true,
            }, (error) => {
                if (error) {
                    console.log(error);
                }
            }
        );
    }
};

export default deleteUploadHelper;
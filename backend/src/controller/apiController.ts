import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import { getUserFolderPath, upload } from '../middleware/multerConfig';


const prisma = new PrismaClient();

// @ts-nocheck
export const postUpload = async (req: Request, res: Response) => {
    try {
        const files = req.files as Express.Multer.File[];
        console.log(files);
        
        const userFolderPath = getUserFolderPath(req);
        const results = await Promise.all(files.map(async file => {
            const result = await prisma.file.create({
                data: {
                    originalName: file.originalname,
                    uniqueName: file.filename,
                    path: userFolderPath,
                }
            });
            return result;
        }));

        res.status(200).json({ files: results });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Something went wrong while uploading files" });
    }
}

export default {
    postUpload
}

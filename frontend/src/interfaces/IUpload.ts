import IFile from "./IFile";

interface IUpload {
    id: number;
    name: string;
    path: string;
    createdAt: Date;
    downloadCount: number;
    views: number;
    files: IFile[];
}

export default IUpload;
interface IUpload {
    id: number;
    name: string;
    path: string;
    createdAt: Date;
    downloadCount: number;
    views: number;
    files: File[];
}

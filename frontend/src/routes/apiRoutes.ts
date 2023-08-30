import routesData from "../data/routesData";

export const postUpload = `${routesData.baseUrl()}/api/upload`; // {files} => message
export const getUploads = `${routesData.baseUrl()}/api/uploads`; // => uploads
export const getUpload = `${routesData.baseUrl()}/api/upload`; // uploadUser, uploardId => upload
export const deleteUpload = `${routesData.baseUrl()}/api/upload`; // uploadId => message
export const getDownload = `${routesData.baseUrl()}/api/download`; // uploadUser, uploadId, fileId => file download

export default {
  postUpload,
  getUploads,
  getUpload,
  deleteUpload,
  getDownload,
}
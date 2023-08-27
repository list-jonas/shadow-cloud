import routesData from "../data/routesData";

export const postUpload = `${routesData.baseUrl()}/api/upload`; // {files}
export const getUploads = `${routesData.baseUrl()}/api/uploads`; // => uploads
export const getUpload = `${routesData.baseUrl()}/api/upload`; // {uploadId} => upload

export default {
  postUpload,
  getUploads,
  getUpload
}
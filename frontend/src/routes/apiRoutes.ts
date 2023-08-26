import routesData from "../data/routesData";

export const postUpload = `${routesData.baseUrl()}/api/upload`; // {files}
export const getUploads = `${routesData.baseUrl()}/api/uploads`; // {uploads}

export default {
  postUpload,
  getUploads
}
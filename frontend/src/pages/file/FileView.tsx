import { useEffect, useState } from "react";
import Content from "../../components/layout/Content/Content";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "primereact/card";
import axios from "axios";
import apiRoutes from "../../routes/apiRoutes";
import { useToast } from "../../hooks/ToastHook";
import FileTable, { FileTableState } from "../../components/ui/file/fileUploader/FileTable";
import formatFileSize from "../../helper/formatFileSize";
import { useSettingsContext } from "../../hooks/SettingsHook";
import IUpload from "../../interfaces/IUpload";
import { Button } from "primereact/button";

const FileView = () => {
  const { user, id } = useParams();
  const { showError } = useToast();
  const navigate = useNavigate();
  const [upload, setUpload] = useState<IUpload>();
  const { settings } = useSettingsContext();

  useEffect(() => {
    axios.get<IUpload>(apiRoutes.getUpload + `/${user}/${id}`, { withCredentials: true })
    .then((res: any) => {
      setUpload(res.data);
    })
    .catch((error: any) => {
      if (error.response.data.error) {
        showError('Error', error.response.data.error);
        navigate('/dashboard');
      }
    });
  }
  , [user, id]);

  const downloadFile = (fileId: number) => {
    const updatedUpload = upload;
    updatedUpload!.downloadCount++;
    setUpload(updatedUpload);

    // set page url to download url apiRoutes.getDownload + `/${user}/${id}/${fileId}`
    document.location.href = apiRoutes.getDownload + `/${user}/${id}/${fileId}`;
  }

  return (
    <Content title={`${upload ? upload.name : "Loading"}`}>
      {settings.email && <Button icon="material-symbols-outlined mat-icon-back" rounded raised outlined className="mb-4" onClick={() => navigate("/dashboard")} />}
      <Card title="Details" className="mb-4">
        <div className="grid">
          <div className="col">
            Uploader:
          </div>
          <div className="col">
            {user}
          </div>
        </div>
        <div className="grid">
          <div className="col">
            Upload Id:
          </div>
          <div className="col">
            {id}
          </div>
        </div>
        {upload && (
          <>
            <div className="grid">
              <div className="col">
                Created At:
              </div>
              <div className="col">
                {new Date(upload.createdAt).toLocaleString()}
              </div>
            </div>

            <div className="grid">
              <div className="col">
                Download Count:
              </div>
              <div className="col">
                {upload.downloadCount}
              </div>
            </div>

            <div className="grid">
              <div className="col">
                Views:
              </div>
              <div className="col">
                {upload.views}
              </div>
            </div>

            <div className="grid">
              <div className="col">
                Size:
              </div>
              <div className="col">
                {upload.files && formatFileSize(upload.files.reduce((a: any, b: any) => a + b.size, 0), settings.si)}
              </div>
            </div>
          </>
        )}
      </Card>
      <Card title="Files">
        {upload && <FileTable files={upload?.files} setFiles={() => {}} state={FileTableState.DOWNLOAD} downloadFile={downloadFile} />}
      </Card>
    </Content>
  );
};

export default FileView;

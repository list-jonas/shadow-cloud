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
    axios.get(apiRoutes.getDownload + `/${user}/${id}/${fileId}`, { withCredentials: true, responseType: 'blob' })
      .then((res: any) => {
        // Convert the data to a blob
        const blob = new Blob([res.data], { type: res.headers['content-type'] });

        // Create a link element
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);

        // Set a file name if you have one. This step is optional.
        // link.download = 'filename.ext';

        // Append the link to the document body and click it
        document.body.appendChild(link);
        link.click();

        // Clean up: remove the link and revoke the object URL
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
      }
    )

    const updatedUpload = upload;
    updatedUpload!.downloadCount++;
    setUpload(updatedUpload);
  }

  return (
    <Content title={`Upload ${upload?.name}`}>
      {settings.email && <Button icon="material-symbols-outlined mat-icon-back" rounded raised outlined className="mb-4" onClick={() => navigate("/dashboard")} />}
      <Card title="Details" className="mb-4">
        <div className="grid">
          <div className="col">
            Username:
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
                {upload.createdAt + ""}
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

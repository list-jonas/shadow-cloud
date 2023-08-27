import React, { useEffect, useState } from "react";
import Content from "../../components/layout/Content/Content";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "primereact/card";
import axios from "axios";
import apiRoutes from "../../routes/apiRoutes";
import { useToast } from "../../hooks/ToastHook";
import FileTable, { FileTableState } from "../../components/ui/file/fileUploader/FileTable";
import formatFileSize from "../../helper/formatFileSize";
import { useSettingsContext } from "../../hooks/SettingsHook";

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

  return (
    <Content title={`Upload ${upload?.name}`}>
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
                {formatFileSize(upload.files.reduce((a, b) => a + b.size, 0), settings.si)}
              </div>
            </div>
          </>
        )}
      </Card>
      <Card title="Files">
        {upload && <FileTable files={upload?.files} setFiles={() => {}} state={FileTableState.DOWNLOAD} />}
      </Card>
    </Content>
  );
};

export default FileView;

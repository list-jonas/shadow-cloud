import { Card } from "primereact/card";
import { useState } from "react";
import Content from "../../../components/layout/Content/Content";
import FileUploader from "../../../components/ui/file/fileUploader/FileUploader";
import UploadedFiles from "../../../components/ui/file/uploadedFiles/UploadedFiles";


const Dashboard = () => {
  const [fileUploadCount, setFileUploadCount] = useState<number>(0);

  const updateUploadedFiles = () => {
    setFileUploadCount(fileUploadCount + 1);
  }
  
  return (
    <Content title="Dashboard" className='dashboard'>
      <Card title="Upload Files" className="mb-4">
        <FileUploader onUploadFinished={updateUploadedFiles} />
      </Card>
      <Card title="Uploads">
        <UploadedFiles fileUploadCount={fileUploadCount} />
      </Card>
    </Content>
  );
};

export default Dashboard;
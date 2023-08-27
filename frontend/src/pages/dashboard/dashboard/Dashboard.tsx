import { Card } from "primereact/card";
import Content from "../../../components/layout/Content/Content";
import FileUploader from "../../../components/ui/file/fileUploader/FileUploader";
import UploadedFiles from "../../../components/ui/file/uploadedFiles/UploadedFiles";


const Dashboard = () => {
  
  return (
    <Content title="Dashboard" className='dashboard'>
      <Card title="Upload Files" className="mb-4">
        <FileUploader />
      </Card>
      <Card title="Uploads">
        <UploadedFiles />
      </Card>
    </Content>
  );
};

export default Dashboard;
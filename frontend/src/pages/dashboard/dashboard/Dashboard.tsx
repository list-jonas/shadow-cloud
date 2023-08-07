import { Card } from "primereact/card";
import Content from "../../../components/layout/Content/Content";
import FileUploader from "../../../components/ui/file/fileUploader/FileUploader";


const Dashboard = () => {
  
  return (
    <Content title="Dashboard" className='dashboard'>
      <Card title="Upload Files">
        <FileUploader />
      </Card>
    </Content>
  );
};

export default Dashboard;
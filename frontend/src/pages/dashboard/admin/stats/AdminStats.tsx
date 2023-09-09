import { Card } from "primereact/card";
import Content from "../../../../components/layout/Content/Content";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import adminRoutes from "../../../../routes/adminRoutes";
import { useToast } from "../../../../hooks/ToastHook";
import UserFlowChart from "./UserFlowChart";
import UploadFlowChart from "./UploadFlowChart";
import { Tooltip } from "primereact/tooltip";

export interface ITimeSeriesData {
  date: string; // formatted as YYYY-MM-DD
  count: number;
}

export interface IAdminStats {
  userCount: number;
  uploadCount: number;
  fileCount: number;
  userflow: ITimeSeriesData[];
  uploadflow: ITimeSeriesData[];
}

const AdminStats = () => {
  const [stats, setStats] = useState<IAdminStats>({
    userCount: 0,
    uploadCount: 0,
    fileCount: 0,
    userflow: [],
    uploadflow: [],
  });
  const userCountRef = useRef(null);
  const uploadCountRef = useRef(null);
  const fileCountRef = useRef(null);

  const { showError } = useToast();

  useEffect(() => {
    axios
      .get<IAdminStats>(adminRoutes.getStats, { withCredentials: true })
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        if (err.response && err.response.data.error) {
          showError("Error", err.response.data.error);
        } else {
          showError("Error", "Stats could not be loaded.");
        }
      });
  }, []);

  return (
    <Content title="Stats" className="admin-stats">
      <div className="grid gap-4 p-1">
        <Card className="col p-1" ref={userCountRef} style={{minWidth: "max-content"}}>
          <div className="grid">
            <span className="material-symbols-outlined col text-4xl">
              group
            </span>
            <span
              className="col text-4xl font-semibold"
              style={{ color: "var(--primary-color)" }}
            >
              {stats.userCount}
            </span>
          </div>
        </Card>
        <Card className="col p-1" ref={uploadCountRef} style={{minWidth: "max-content"}}>
          <div className="grid">
            <span className="material-symbols-outlined col text-4xl">
              folder
            </span>
            <span
              className="col text-4xl font-semibold"
              style={{ color: "var(--primary-color)" }}
            >
              {stats.uploadCount}
            </span>
          </div>
        </Card>
        <Card className="col p-1" ref={fileCountRef} style={{minWidth: "max-content"}}>
          <div className="grid">
            <span className="material-symbols-outlined col text-4xl">
              upload_file
            </span>
            <span
              className="col text-4xl font-semibold"
              style={{ color: "var(--primary-color)" }}
            >
              {stats.fileCount}
            </span>
          </div>
        </Card>
      </div>
      <Card title="User flow" className="m-1 mt-4">
        <UserFlowChart userflow={stats.userflow} />
      </Card>
      <Card title="Upload flow" className="m-1 mt-4">
        <UploadFlowChart uploadflow={stats.uploadflow} />
      </Card>
      <Tooltip
        target={userCountRef.current!}
        content="Total number of users"
        position="bottom"
      />
      <Tooltip
        target={uploadCountRef.current!}
        content="Total number of uploads"
        position="bottom"
      />
      <Tooltip
        target={fileCountRef.current!}
        content="Total number of files"
        position="bottom"
      />
    </Content>
  );
};

export default AdminStats;

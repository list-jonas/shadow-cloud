import React from "react";
import Content from "../../components/layout/Content/Content";
import { useParams } from "react-router-dom";
import { Card } from "primereact/card";

const FileView = () => {
  const { user, id } = useParams();

  return (
    <Content title="File">
      <Card title="Stats">
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
      </Card>
    </Content>
  );
};

export default FileView;

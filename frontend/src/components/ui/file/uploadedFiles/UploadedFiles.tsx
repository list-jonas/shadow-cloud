import axios from "axios";
import { useEffect, useState } from "react";
import apiRoutes from "../../../../routes/apiRoutes";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useNavigate } from "react-router-dom";
import { Badge } from "primereact/badge";
import formatFileSize from "../../../../helper/formatFileSize";
import { useSettingsContext } from "../../../../hooks/SettingsHook";
import IUpload from "../../../../interfaces/IUpload";
import redirectTo from "../../../../helper/redirectTo";

const UploadedFiles = () => {
  const [uploads, setUploads] = useState<IUpload[]>([])
  const navigate = useNavigate();
  const { settings } = useSettingsContext();

  useEffect(() => {
    axios.get<IUpload[]>(apiRoutes.getUploads, { withCredentials: true })
      .then(res => {
        setUploads(res.data)
        console.log(uploads);
      }).catch(err => {
        console.log(err)
      }
    )
  }, [])

  const nameBodyTemplate = (rowData: IUpload) => {
    return <a href={`/file/${rowData.path}`} onClick={(e) => redirectTo(navigate, e, `/file/${rowData.path}`)}>{rowData.name}</a>;
  };

  const sizeBodyTemplate = (rowData: IUpload) => {
    return <>{rowData.files && <Badge value={formatFileSize(rowData.files.reduce((a, b) => a + b.size, 0), settings.si)} />}</>;
  };
  
  return (
    <div>
      <DataTable
        value={uploads}
        size="small"
        style={{ width: "100%" }}
      >
        <Column field="name" header="Name" body={nameBodyTemplate} sortable />
        <Column field="createdAt" header="Uploaded" sortable />
        <Column field="downloadCount" header="Downloads" sortable />
        <Column field="views" header="Views" sortable />
        <Column field="size" header="Size" body={sizeBodyTemplate} sortable />
      </DataTable>
    </div>
  );
};

export default UploadedFiles;
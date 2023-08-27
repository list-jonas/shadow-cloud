import axios from "axios";
import { useEffect, useState } from "react";
import apiRoutes from "../../../../routes/apiRoutes";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const UploadedFiles = () => {
  const [uploads, setUploads] = useState<IUpload[]>([])

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
  
  return (
    <div>
      <DataTable
        value={uploads}
        size="small"
        style={{ width: "100%" }}
      >
        <Column field="name" header="Name" sortable />
        <Column field="path" header="Path" sortable />
        <Column field="createdAt" header="Uploaded" sortable />
        <Column field="downloadCount" header="Downloads" sortable />
        <Column field="views" header="Views" sortable />
        <Column field="size" header="Size" sortable />
      </DataTable>
    </div>
  );
};

export default UploadedFiles;
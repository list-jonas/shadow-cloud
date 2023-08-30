import axios from "axios";
import { useEffect, useRef, useState } from "react";
import apiRoutes from "../../../../routes/apiRoutes";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useNavigate } from "react-router-dom";
import { Badge } from "primereact/badge";
import formatFileSize from "../../../../helper/formatFileSize";
import { useSettingsContext } from "../../../../hooks/SettingsHook";
import IUpload from "../../../../interfaces/IUpload";
import redirectTo from "../../../../helper/redirectTo";
import { ContextMenu } from "primereact/contextmenu";
import { useToast } from "../../../../hooks/ToastHook";

const UploadedFiles = () => {
  const [uploads, setUploads] = useState<IUpload[]>([])
  const [selectedUpload, setSelectedUpload] = useState<IUpload | null>(null);
  const navigate = useNavigate();
  const { settings } = useSettingsContext();
  const cm = useRef<ContextMenu>(null);
  const { showError, showSuccess } = useToast();

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

  const contextMenuItems = [
    {
      label: 'Delete',
      icon: 'material-symbols-outlined mat-icon-bin',
      command: (event: any) => {
        // @ts-ignore
        cm.current?.hide();

        axios.delete(apiRoutes.deleteUpload + `/${selectedUpload!.id}`, { withCredentials: true })
          .then(res => {
            setUploads(uploads.filter(upload => upload.id !== selectedUpload!.id))
            
            showSuccess('Success', res.data.message);
          })
          .catch(err => {
            if (err.response.data.error) {
              showError('Error', err.response.data.error);
            }
          })
      }
    },
  ];

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
        onSelectionChange={e => {
          setSelectedUpload(e.value as any)
          // @ts-ignore
          cm.current?.show();
        }}
        contextMenuSelection={selectedUpload as any}
        onContextMenu={e => {
          setSelectedUpload(e.data as any)
          cm.current?.show(e.originalEvent);
        }}
        onContextMenuSelectionChange={e => setSelectedUpload(e.value as any)}
        selectionMode="single"
        dataKey="id"
        metaKeySelection={false}
        scrollable
        emptyMessage="No uploads found"
      >
        <Column field="name" header="Name" body={nameBodyTemplate} sortable />
        <Column field="createdAt" header="Uploaded" sortable />
        <Column field="downloadCount" header="Downloads" sortable />
        <Column field="views" header="Views" sortable />
        <Column field="size" header="Size" body={sizeBodyTemplate} sortable />
      </DataTable>

      <ContextMenu model={contextMenuItems} ref={cm} />
    </div>
  );
};

export default UploadedFiles;
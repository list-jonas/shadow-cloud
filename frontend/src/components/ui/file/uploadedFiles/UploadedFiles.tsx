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

interface UploadedFilesProps {
  fileUploadCount?: number;
}

const UploadedFiles: React.FC<UploadedFilesProps> = (props) => {
  const { fileUploadCount } = props;

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
      }).catch(error => {
        console.log(error)
      }
    )
  }, [fileUploadCount])

  const contextMenuItems = [
    {
      label: 'View',
      icon: 'material-symbols-outlined mat-icon-eye',
      command: () => {
        redirectTo(navigate, null, `/file/${selectedUpload!.path}`)
      }
    } ,{
      label: 'Delete',
      icon: 'material-symbols-outlined mat-icon-bin',
      command: () => {
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
    }
  ];

  const nameBodyTemplate = (rowData: IUpload) => {
    return <a href={`/file/${rowData.path}`} onClick={(e) => redirectTo(navigate, e, `/file/${rowData.path}`)}>{rowData.name}</a>;
  };

  const sizeBodyTemplate = (rowData: IUpload) => {
    return <>{rowData.files && <Badge value={formatFileSize(rowData.files.reduce((a, b) => a + b.size, 0), settings.si)} />}</>;
  };

  const createdAtBodyTemplate = (rowData: IUpload) => {
    return <>{new Date(rowData.createdAt).toLocaleString()}</>;
  };
  
  return (
    <div>
      <DataTable
        value={uploads}
        size="small"
        style={{ width: "100%" }}
        onSelectionChange={e => {
          setSelectedUpload(e.value as any)
        }}
        contextMenuSelection={selectedUpload as any}
        onContextMenu={e => {
          setSelectedUpload(e.data as any)
          cm.current?.show(e.originalEvent);
        }}
        onContextMenuSelectionChange={e => setSelectedUpload(e.value as any)}
        selection={selectedUpload as any}
        selectionMode="single"
        dataKey="id"
        metaKeySelection={false}
        scrollable
        emptyMessage="No uploads found"
      >
        <Column field="name" header="Name" body={nameBodyTemplate} sortable />
        <Column field="createdAt" body={createdAtBodyTemplate} header="Uploaded" sortable />
        <Column field="downloadCount" header="Downloads" sortable />
        <Column field="views" header="Views" sortable />
        <Column field="size" header="Size" body={sizeBodyTemplate} sortable />
      </DataTable>

      <ContextMenu model={contextMenuItems} ref={cm} />
    </div>
  );
};

export default UploadedFiles;
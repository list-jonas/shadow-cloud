import { Badge } from "primereact/badge";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";
import formatFileSize from "../../../../helper/formatFileSize";
import './FileTable.scss';
import { useSettingsContext } from "../../../../hooks/SettingsHook";
import chooseFileIcon from "../../../../helper/icons/chooseIcon";
import { Button } from "primereact/button";
import IFile from "../../../../interfaces/IFile";

export enum FileTableState {
  DOWNLOAD,
  REMOVE
}

interface FileTableProps {
  files: File[] | IFile[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  state?: FileTableState;
  downloadFile?: (fileId: number) => void;
  actionDisabled?: boolean;
}

const FileTable: React.FC<FileTableProps> = (props) => {
  const { files, setFiles, state, downloadFile, actionDisabled } = props;
  const { settings } = useSettingsContext();

  const removeFile = (file: File | IFile) => {
    // @ts-ignore
    const updatedFiles = files.filter((f: any) => f !== file) as File[];
    setFiles(updatedFiles);
  };

  const iconBodyTemplate = (rowData: File) => {
    // if type is image display image

    if (rowData.type.startsWith('image') && (rowData instanceof File)) {
      // prevent drag of img
      return (
        <div style={{maxWidth: "100%", display: "flex", justifyContent: "center"}}>
          <img className={`file-table__icon ${rowData.name}`} src={URL.createObjectURL(rowData)} style={{maxWidth: "100%"}} onDragStart={e => e.preventDefault()} />
        </div>
      );
    }

    // prevent drag of img
    return (
      <div style={{maxWidth: "100%", display: "flex", justifyContent: "center"}}>
        <img className={`file-table__icon ${rowData.name}`} src={`/static/icons/${chooseFileIcon(rowData.name)}`} onDragStart={e => e.preventDefault()} />
      </div>
    );
  };

  const nameBodyTemplate = (rowData: File) => {
    return <span>{rowData.name}</span>;
  };

  const typeBodyTemplate = (rowData: File) => {
    return <span>{rowData.type}</span>;
  };

  const sizeBodyTemplate = (rowData: File) => {
    return <Badge value={formatFileSize(rowData.size, settings.si)} />;
  };

  const actionBodyTemplate = (rowData: File) => {
    console.log(state);
    
    if (props.state === FileTableState.REMOVE) {
      return <Button onClick={() => removeFile(rowData)} icon="material-symbols-outlined mat-icon-bin" disabled={actionDisabled} />;
    }
    if (props.state === FileTableState.DOWNLOAD) {
      if (!downloadFile) {
        return null;
      }
      // @ts-ignore
      if (!(rowData as IFile).id) {
        return null;
      }
      
      // @ts-ignore
      return <Button onClick={() => downloadFile(rowData.id)} icon="material-symbols-outlined mat-icon-download" disabled={actionDisabled} />;
    }
    
    return null;
  };
  
  return (
    <div className="file-table" style={{width: "100%"}}>
      <DataTable
        value={files}
        size="small"
        style={{ width: "100%" }}
      >
        <Column header="Icon" body={iconBodyTemplate} style={{maxWidth: "60px"}} />
        <Column header="Name" body={nameBodyTemplate} />
        <Column header="Type" body={typeBodyTemplate} />
        <Column header="Size" body={sizeBodyTemplate} />
        {state !== undefined && <Column header="Action" body={actionBodyTemplate} />}
      </DataTable>
    </div>
  );
};

export default FileTable;

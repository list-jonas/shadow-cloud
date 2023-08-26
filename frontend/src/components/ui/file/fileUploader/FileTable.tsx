import { Badge } from "primereact/badge";
import { Column, ColumnEditorOptions, ColumnEvent } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import formatFileSize from "../../../../helper/formatFileSize";
import './FileTable.scss';
import { useSettingsContext } from "../../../../hooks/SettingsHook";
import chooseFileIcon from "../../../../helper/icons/chooseIcon";
import { Button } from "primereact/button";

export enum FileTableState {
  DOWNLOAD,
  REMOVE
}

interface FileTableProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
  state?: FileTableState;
}

const FileTable: React.FC<FileTableProps> = (props) => {
  const { files, setFiles, state } = props;
  const { settings } = useSettingsContext();

  const removeFile = (file: File) => {
    const updatedFiles = files.filter(f => f !== file);
    setFiles(updatedFiles);
  };
  
  const downloadFile = (file: File) => {
    const url = URL.createObjectURL(file);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.name;
    a.click();
    URL.revokeObjectURL(url);
  };

  const iconBodyTemplate = (rowData: File) => {
    return <img className={`file-table__icon ${rowData.name}`} src={`/static/icons/${chooseFileIcon(rowData.name)}`} />;
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
    if (props.state === FileTableState.REMOVE) {
      return <Button onClick={() => removeFile(rowData)} label="Remove" />;
    }
    
    if (props.state === FileTableState.DOWNLOAD) {
      return <Button onClick={() => downloadFile(rowData)} label="Download" />;
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
        <Column header="Icon" body={iconBodyTemplate} />
        <Column header="Name" body={nameBodyTemplate} />
        <Column header="Type" body={typeBodyTemplate} />
        <Column header="Size" body={sizeBodyTemplate} />
        {state && <Column header="Action" body={actionBodyTemplate} />}
      </DataTable>
    </div>
  );
};

export default FileTable;

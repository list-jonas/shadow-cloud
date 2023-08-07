import { Badge } from "primereact/badge";
import { Column, ColumnEditorOptions, ColumnEvent } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React, { useEffect, useState } from "react";
import formatFileSize from "../../../../helper/formatFileSize";
import './FileTable.scss';
import { InputText } from "primereact/inputtext";
import { useSettingsContext } from "../../../../hooks/SettingsHook";
import chooseFileIcon from "../../../../helper/icons/chooseIcon";

interface FileTableProps {
  files: File[];
  setFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

const FileTable: React.FC<FileTableProps> = (props) => {
  const { files, setFiles } = props;
  const { settings } = useSettingsContext();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  const textEditor = (options: ColumnEditorOptions) => {
    // @ts-ignore
    return <InputText type="text" value={options.rowData.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => options.editorCallback(e.target.value)} />;
  };

  const onCellEditComplete = (e: ColumnEvent) => {
    let { rowData, newValue, field} = e;

    let newFiles = [...files];
    let file = newFiles.find((f) => f.name === rowData.name);
    // @ts-ignore
    file![field] = newValue;
    setFiles(newFiles);
  };
  

  return (
    <div className="file-table" style={{width: "100%"}}>
      <DataTable value={files} removableSort size="small" style={{width: "100%"}}>
        <Column field="icon" header="Icon" body={iconBodyTemplate} />
        <Column field="name" header="Name" body={nameBodyTemplate} editor={textEditor} onCellEditComplete={onCellEditComplete} />
        {windowWidth >= 500 && <Column field="type" header="Type" body={typeBodyTemplate} />}
        <Column field="size" header="Size" body={sizeBodyTemplate} />
      </DataTable>
    </div>
  );
};

export default FileTable;

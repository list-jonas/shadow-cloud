import { useRef, useState } from 'react';
import { useToast } from '../../../../hooks/ToastHook';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import JSZip from 'jszip'
import './FileUploader.scss'
import { Badge } from 'primereact/badge';
import formatFileSize from '../../../../helper/formatFileSize';
import { SplitButton } from 'primereact/splitbutton';
import { SpeedDial } from 'primereact/speeddial';
import FileTable from './FileTable';
import axios from 'axios';
import apiRoutes from '../../../../routes/apiRoutes';

const FileUploader = () => {
  const { showInfo, showError, showWarn } = useToast();
  const [totalSize, setTotalSize] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [processing, setProcessing] = useState(false);
  const fileSelectRef = useRef<any>(null);
  const folderSelectRef = useRef<any>(null);

  const processFiles = (_files: File[]) => {
    let _validFiles: File[] = [];
    let _invalidFiles: File[] = [];
  
    // Files should have less than 1GB in size and should not exist in files array already
    if (_files.length > 0) {
      _files.forEach((file) => {
        if (file.size > 1000000000) {
          showError('Error', `File size of ${file.name} should be less than 1GB`)
          _invalidFiles.push(file);
          return;
        }
  
        // Check if filename already exists in files array
        if (files.find((f) => f.name === file.name)) {
          showError('Error', `File ${file.name} already exists`)
          _invalidFiles.push(file);
          return;
        }
  
        _validFiles.push(file);
      }
    )};
  
    setFiles([...files, ..._validFiles]);
    setTotalSize(files.reduce((acc, file) => acc + file.size, 0));
  };

  const onDragOver = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const onDrop = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    let _files = [...e.dataTransfer.files];
    processFiles(_files);
  };

  const onFileSelect = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (fileSelectRef.current) {
      setProcessing(true);
      fileSelectRef.current.click();
    }
  };  

  const onFileSelectChange = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    let _files = [...e.target.files];
    processFiles(_files);
    setProcessing(false);
  };

  const onFolderSelect = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    if (folderSelectRef.current) {
      folderSelectRef.current.directory = true;
      folderSelectRef.current.webkitdirectory = true;
      setProcessing(true);
      folderSelectRef.current.click();
    }
  };

  const onFolderSelectChange = async (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    let _files = [...e.target.files];

    console.log("Test");
    

    // warning if folder is empty
    if (_files.length === 0) {
      showWarn('Warning', 'Folder is empty');
      setProcessing(false);
      return;
    }

    const zip = new JSZip();
    _files.forEach(file => {
      zip.file(file.name, file);
    });
    // formatted date 2023-01-01
    const filename = new Date().toISOString().split('T')[0] + '.zip';
    console.log(filename);
    
    const content = await zip.generateAsync({type:"blob"});
    const zipFile = new File([content], filename);
    processFiles([zipFile]);
    setProcessing(false);
  };

  const onClear = () => {
    setFiles([]);
    setTotalSize(0);
    setProgress(0);
    setProcessing(false);
  };

  const onUpload = () => {
    setProcessing(false);
    let _progress = 0;
    setProgress(_progress);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files[]', files[i]);
    }

    axios.post(apiRoutes.postUpload, formData, {
      withCredentials: true,
      onUploadProgress: (progressEvent) => {
        _progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total ?? 100));
        setProgress(_progress);
      }
    }).then(() => {
      setProgress(100);
      showInfo('Success', 'Files uploaded successfully');
    }).catch((err) => {
      showError('Error', err.message);
      setProgress(0);
    });
  };

  return (
    <div className="file-uploader border">
      <input type="file" ref={fileSelectRef} style={{display: "none"}} onChange={onFileSelectChange} />
      { /* @ts-ignore */}
      <input type="file" ref={folderSelectRef} style={{display: "none"}} onChange={onFolderSelectChange} directory="" webkitdirectory="" msdirectory="" />
      <div className='file-uploader__header'>
        <div className='grid'>
          <div className='col' style={{maxWidth: "min-content"}}>
          <Button icon="material-symbols-outlined mat-icon-document" onClick={onFileSelect} />
          </div>
          <div className='col' style={{maxWidth: "min-content"}}>
            <Button icon="material-symbols-outlined mat-icon-folder" onClick={onFolderSelect} />
          </div>
          <div className='col' style={{maxWidth: "min-content"}}>
            <Button icon="material-symbols-outlined mat-icon-upload" onClick={onUpload} disabled={files.length === 0} />
          </div>
          <div className='col' style={{maxWidth: "min-content"}}>
            <Button icon="material-symbols-outlined mat-icon-close" onClick={onClear} disabled={files.length === 0} />
          </div>
          <div className='col'>
            
          </div>
        </div>
      </div>
      <ProgressBar value={progress} displayValueTemplate={() => ""} mode={processing ? "indeterminate" : "determinate"} className='file-uploader__divider' />
      <div className='file-uploader__body' onDrop={onDrop} onDragOver={onDragOver} >
        <div className='grid'>
          {files.length === 0 ? (
            <div className='col'>
              <div className='file-uploader__body__empty'>
                <div className='file-uploader__body__empty__icon'>
                  <i className="material-symbols-outlined mat-icon-document-drop" style={{fontSize: "55px"}} />
                </div>
                <div className='file-uploader__body__empty__text'>
                  <span>Drag and Drop files Here</span>
                </div>
              </div>
            </div>
          ) : (
            <FileTable files={files} setFiles={setFiles} />
          )}
        </div>
      </div>
    </div>
  )
};

export default FileUploader;
import { useRef, useState } from 'react';
import { useToast } from '../../../../hooks/ToastHook';
import { ProgressBar } from 'primereact/progressbar';
import { Button } from 'primereact/button';
import JSZip from 'jszip'
import './FileUploader.scss'
import FileTable, { FileTableState } from './FileTable';
import axios from 'axios';
import apiRoutes from '../../../../routes/apiRoutes';
import { InputText } from 'primereact/inputtext';
import routesData from '../../../../data/routesData';

interface FileUploaderProps {
  onUploadFinished?: () => void;
}

const FileUploader: React.FC<FileUploaderProps> = (props) => {
  const { onUploadFinished } = props;

  const { showInfo, showError, showWarn } = useToast();
  const [totalSize, setTotalSize] = useState(0);
  const [name , setName] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState(0);
  const [processing, setProcessing] = useState(false);
  const fileSelectRef = useRef<any>(null);
  const folderSelectRef = useRef<any>(null);
  const [downloadUrl, setDownloadUrl] = useState<string>('');
  const navigator = window.navigator;

  const processFiles = (_files: File[]) => {
    let _validFiles: File[] = [];
    let _invalidFiles: File[] = [];
  
    // Files should have less than 10GB in size and should not exist in files array already
    if (_files.length > 0) {
      _files.forEach((file) => {
        if (file.size > 10000000000) {
          showError('Error', `File size of ${file.name} should be less than 10GB`)
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
    // If file is empty, return
    if (e.dataTransfer.files.length === 0) {
      showError('Error', 'File is empty');
      return;
    };

    // If a file has 0 size, return
    if (e.dataTransfer.files[0].size === 0) {
      showError('Error', 'File size should be greater than 0');
      return;
    };


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
    
    const content = await zip.generateAsync({type:"blob"});
    const zipFile = new File([content], filename);
    processFiles([zipFile]);
    setProcessing(false);
  };

  const onClear = () => {
    // remove selectted files from files array and update total size
    // if nothing selected remove all files
    if (selectedFiles.length > 0) {
      setFiles(files.filter((file) => !selectedFiles.includes(file)));
      setSelectedFiles([]);
      setTotalSize(files.reduce((acc, file) => acc + file.size, 0));
    } else {
      setFiles([]);
      setTotalSize(0);
    }
    
    setProgress(0);
    setProcessing(false);
    console.log(totalSize);
  };

  const onUpload = () => {
    setProcessing(false);
    let _progress = 0;
    setProgress(_progress);

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files[]', files[i]);
    }
    formData.append('name', name);

    axios.post(apiRoutes.postUpload, formData, {
      withCredentials: true,
      onUploadProgress: (progressEvent) => {
        _progress = Math.round((progressEvent.loaded * 100) / (progressEvent.total ?? 100));
        setProgress(_progress);
      }
    }).then((response) => {
      setProgress(100);
      showInfo('Success', response.data.message);
      setDownloadUrl(`${routesData.baseUrl()}/file/${response.data.location}`);
      setFiles([]);
      setTotalSize(0);
      setName('');
      // wait a second before resetting progress
      setTimeout(() => {
        setProgress(0);
        if (onUploadFinished) {
          onUploadFinished();
        }
      }, 1000);
    }).catch((error: any) => {
      console.log(error);
      
      if (error.response.data && error.response.data?.error) {
        showError('Error', error.response.data.error);
      } else {
        showError('Error', error.message);
      }
      setProgress(0);
    });
  };

  const copyToClipboard = () => {
    if (downloadUrl) {
        navigator.clipboard.writeText(downloadUrl)
            .then(() => {
                showInfo('Info', 'URL copied to clipboard!');
            })
            .catch(() => {
                showError('Error', 'Failed to copy URL to clipboard');
            });
    } else {
        showWarn('Warning', 'Nothing to copy!');
    }
  };

  return (
    <div className="file-uploader border">
      {downloadUrl && (
        <div className='mb-2'>
          <div className="p-inputgroup">
            <InputText value={downloadUrl} contentEditable={false} style={{userSelect: "contain", height: "50px"}} />
            <Button icon="material-symbols-outlined mat-icon-copy" onClick={copyToClipboard} />
          </div>
        </div>
      )}

      <input type="file" ref={fileSelectRef} style={{display: "none"}} onChange={onFileSelectChange} multiple />
      { /* @ts-ignore */}
      <input type="file" ref={folderSelectRef} style={{display: "none"}} onChange={onFolderSelectChange} directory="" webkitdirectory="" msdirectory="" />
      <div className='file-uploader__header'>
        <div className='grid'>
          <div className='col' style={{maxWidth: "min-content"}}>
            <Button icon="material-symbols-outlined mat-icon-document" onClick={onFileSelect} disabled={progress !== 0} 
                    tooltip="Documents" tooltipOptions={{ position: 'bottom' }}/>
          </div>
          <div className='col' style={{maxWidth: "min-content"}}>
            <Button icon="material-symbols-outlined mat-icon-folder" onClick={onFolderSelect} disabled={progress !== 0}
                    tooltip="Folder" tooltipOptions={{ position: 'bottom' }}/>
          </div>
          <div className='col' style={{maxWidth: "min-content"}}>
            <Button icon="material-symbols-outlined mat-icon-upload" onClick={onUpload} disabled={files.length === 0 || name.trim() === "" || progress !== 0}
                    tooltip="Upload" tooltipOptions={{ position: 'bottom' }}/>
          </div>
          <div className='col' style={{maxWidth: "min-content"}}>
            <Button icon="material-symbols-outlined mat-icon-close" onClick={onClear} disabled={files.length === 0 || progress !== 0}
                    tooltip="Clear" tooltipOptions={{ position: 'bottom' }}/>
          </div>
          <div className='col'>
            <InputText value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required className='file-uploader__header__name' style={{minWidth: "150px"}} disabled={progress !== 0}
                       tooltip="Upload name" tooltipOptions={{ position: 'bottom' }}/>
          </div>
        </div>
      </div>
      <ProgressBar value={progress} displayValueTemplate={() => ""} mode={processing ? "indeterminate" : "determinate"} className='file-uploader__divider mt-1' />
      <div className='file-uploader__body' onDrop={onDrop} onDragOver={onDragOver} >
        <div className='grid'>
          {files.length === 0 ? (
            <div className='col' onClick={onFileSelect}>
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
            <FileTable files={files} setFiles={setFiles} state={FileTableState.REMOVE} actionDisabled={progress !== 0} />
          )}
        </div>
      </div>
    </div>
  )
};

export default FileUploader;
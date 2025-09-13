import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './App.css';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';

function App() {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [downloadingFile, setDownloadingFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  // Allowed file types
  const allowedTypes = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'text/plain': 'txt',
    'application/json': 'json',
    'application/pdf': 'pdf',
    'text/csv': 'csv'
  };

  // Fetch files from backend
  const fetchFiles = async () => {
    try {
      const response = await axios.get('/api/files');
      setFiles(response.data);
    } catch (error) {
      console.error('Error fetching files:', error);
      // Fallback to empty array if backend is not available
      setFiles([]);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // Handle file upload
  const handleFileUpload = async (file, fileInputRef) => {
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const response = await axios.post('/api/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.data.success) {
        // Refresh files list
        await fetchFiles();
        alert('File uploaded successfully!');
      } else {
        alert('Upload failed: ' + response.data.message);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Upload failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };


  // Handle file click - download file
  const handleFileClick = async (file) => {
    setDownloadingFile(file.id);
    
    try {
      const downloadUrl = `/api/files/${file.id}/download`;
      
      // Use axios to download the file as blob
      const response = await axios.get(downloadUrl, {
        responseType: 'blob',
        headers: {
          'Accept': '*/*'
        }
      });
      
      // Create blob URL and trigger download
      const blob = new Blob([response.data], { type: response.headers['content-type'] });
      const url = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = file.originalName;
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Download error:', error);
      if (error.response?.status === 404) {
        alert('File not found. It may have been deleted.');
      } else {
        alert('Failed to download file. Please try again.');
      }
    } finally {
      setDownloadingFile(null);
    }
  };

  // Handle file delete
  const handleFileDelete = async (file, event) => {
    event.stopPropagation(); // Prevent triggering file click
    
    if (window.confirm(`Are you sure you want to delete "${file.originalName}"?`)) {
      try {
        const response = await axios.delete(`/api/files/${file.id}`);
        if (response.data.success) {
          // Remove file from the list
          setFiles(prevFiles => prevFiles.filter(f => f.id !== file.id));
          alert('File deleted successfully!');
        } else {
          alert('Failed to delete file: ' + response.data.message);
        }
      } catch (error) {
        console.error('Error deleting file:', error);
        alert('Failed to delete file: ' + (error.response?.data?.message || error.message));
      }
    }
  };




  return (
    <div className="file-manager">
      {/* Header */}
      <div className="header">
        <div className="container">
          <h1 className="app-title">📁 File Manager</h1>
          <p className="app-subtitle">Manage and view your files with ease</p>
        </div>
      </div>

      <div className="container main-content">
        {/* Upload Section */}
        <FileUpload 
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          onFileUpload={handleFileUpload}
          allowedTypes={allowedTypes}
        />

        {/* File List Section */}
        <FileList 
          files={files}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterType={filterType}
          setFilterType={setFilterType}
          downloadingFile={downloadingFile}
          onFileClick={handleFileClick}
          onFileDelete={handleFileDelete}
        />
      </div>
    </div>
  );
}

export default App;
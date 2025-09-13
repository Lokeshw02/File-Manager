import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './App.css';
import FileUpload from './components/FileUpload';
import FileList from './components/FileList';
import Popup from './components/Popup';
import ConfirmationPopup from './components/ConfirmationPopup';

function App() {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [downloadingFile, setDownloadingFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  
  // Popup state
  const [popup, setPopup] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });

  // Confirmation popup state
  const [confirmationPopup, setConfirmationPopup] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
  });

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

  // Helper function to show popup
  const showPopup = (title, message, type = 'info') => {
    setPopup({
      isOpen: true,
      title,
      message,
      type
    });
  };

  // Helper function to close popup
  const closePopup = () => {
    setPopup({
      isOpen: false,
      title: '',
      message: '',
      type: 'info'
    });
  };

  // Helper function to show confirmation popup
  const showConfirmationPopup = (title, message, onConfirm) => {
    setConfirmationPopup({
      isOpen: true,
      title,
      message,
      onConfirm
    });
  };

  // Helper function to close confirmation popup
  const closeConfirmationPopup = () => {
    setConfirmationPopup({
      isOpen: false,
      title: '',
      message: '',
      onConfirm: null
    });
  };

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
        showPopup('Success!', 'File uploaded successfully!', 'success');
      } else {
        showPopup('Upload Failed', 'Upload failed: ' + response.data.message, 'error');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showPopup('Upload Failed', 'Upload failed: ' + (error.response?.data?.message || error.message), 'error');
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
        showPopup('File Not Found', 'File not found. It may have been deleted.', 'error');
      } else {
        showPopup('Download Failed', 'Failed to download file. Please try again.', 'error');
      }
    } finally {
      setDownloadingFile(null);
    }
  };

  // Handle file delete
  const handleFileDelete = async (file, event) => {
    event.stopPropagation(); // Prevent triggering file click
    
    const deleteFile = async () => {
      try {
        const response = await axios.delete(`/api/files/${file.id}`);
        if (response.data.success) {
          // Remove file from the list
          setFiles(prevFiles => prevFiles.filter(f => f.id !== file.id));
          showPopup('Success!', 'File deleted successfully!', 'success');
        } else {
          showPopup('Delete Failed', 'Failed to delete file: ' + response.data.message, 'error');
        }
      } catch (error) {
        console.error('Error deleting file:', error);
        showPopup('Delete Failed', 'Failed to delete file: ' + (error.response?.data?.message || error.message), 'error');
      }
    };

    showConfirmationPopup(
      'Delete File',
      `Are you sure you want to delete "${file.originalName}"? This action cannot be undone.`,
      deleteFile
    );
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
          onShowPopup={showPopup}
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

      {/* Popup Component */}
      <Popup
        isOpen={popup.isOpen}
        onClose={closePopup}
        title={popup.title}
        message={popup.message}
        type={popup.type}
      />

      {/* Confirmation Popup Component */}
      <ConfirmationPopup
        isOpen={confirmationPopup.isOpen}
        onClose={closeConfirmationPopup}
        onConfirm={confirmationPopup.onConfirm}
        title={confirmationPopup.title}
        message={confirmationPopup.message}
        confirmText="Yes, Delete"
        cancelText="Cancel"
      />
    </div>
  );
}

export default App;
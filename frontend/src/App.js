import React, { useState, useEffect, useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './App.css';

function App() {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [downloadingFile, setDownloadingFile] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const fileInputRef = useRef(null);

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
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file type
    if (!allowedTypes[file.type]) {
      alert('File type not supported. Please upload: JPG, PNG, GIF, TXT, JSON, PDF, or CSV files.');
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size too large. Maximum size is 10MB.');
      return;
    }

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

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get file icon based on type
  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type === 'text/plain') return '📄';
    if (type === 'application/json') return '📋';
    if (type === 'application/pdf') return '📕';
    if (type === 'text/csv') return '📊';
    return '📁';
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


  // Filter files
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.originalName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || file.fileType.startsWith(filterType);
    return matchesSearch && matchesFilter;
  });


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
        <div className="upload-section">
          <div className="upload-card">
            <div className="upload-icon">📤</div>
            <h3>Upload New File</h3>
            <p>Supported formats: JPG, PNG, GIF, TXT, JSON, PDF, CSV</p>
            <p className="file-limit">Maximum file size: 10MB</p>
            <p className="file-info">📥 Download • 🗑️ Delete files</p>
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".jpg,.jpeg,.png,.gif,.txt,.json,.pdf,.csv"
              style={{ display: 'none' }}
            />
            
            <button 
              className="upload-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Choose File'}
            </button>
            
            {isUploading && (
              <div className="upload-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
                <span>{uploadProgress}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Search and Filter */}
        <div className="controls-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
          
          <select 
            value={filterType} 
            onChange={(e) => setFilterType(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Files</option>
            <option value="image/">Images</option>
            <option value="text/">Text Files</option>
            <option value="application/">Documents</option>
          </select>
        </div>

        {/* Files Grid */}
        <div className="files-section">
          <h2>Your Files ({filteredFiles.length})</h2>
          
          {filteredFiles.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📂</div>
              <h3>No files found</h3>
              <p>Upload your first file to get started!</p>
            </div>
          ) : (
            <div className="files-grid">
              {filteredFiles.map((file) => (
                <div 
                  key={file.id} 
                  className="file-card"
                  onClick={() => handleFileClick(file)}
                >
                  <div className="file-icon">{getFileIcon(file.fileType)}</div>
                  <div className="file-info">
                    <h4 className="file-name">{file.originalName}</h4>
                    <p className="file-meta">{file.formattedFileSize} • {new Date(file.uploadDate).toLocaleDateString()}</p>
                  </div>
                  <div className="file-actions">
                    <button 
                      className="action-btn download-btn" 
                      title="Download file"
                      disabled={downloadingFile === file.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFileClick(file);
                      }}
                    >
                      {downloadingFile === file.id ? '⏳' : '📥'}
                    </button>
                    <button 
                      className="action-btn delete-btn" 
                      title="Delete file"
                      onClick={(e) => handleFileDelete(file, e)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
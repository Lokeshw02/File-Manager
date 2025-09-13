import React, { useRef } from 'react';

const FileUpload = ({ 
  isUploading, 
  uploadProgress, 
  onFileUpload, 
  allowedTypes,
  onShowPopup
}) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file type
    if (!allowedTypes[file.type]) {
      onShowPopup('Invalid File Type', 'File type not supported. Please upload: JPG, PNG, GIF, TXT, JSON, PDF, or CSV files.', 'warning');
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      onShowPopup('File Too Large', 'File size too large. Maximum size is 10MB.', 'warning');
      return;
    }

    onFileUpload(file, fileInputRef);
  };

  return (
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
          onChange={handleFileChange}
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
  );
};

export default FileUpload;

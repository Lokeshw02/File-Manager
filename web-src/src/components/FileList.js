import React from 'react';

const FileList = ({ 
  files, 
  searchTerm, 
  setSearchTerm, 
  filterType, 
  setFilterType, 
  downloadingFile, 
  onFileClick, 
  onFileDelete 
}) => {
  // Get file icon based on type
  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return '🖼️';
    if (type === 'text/plain') return '📄';
    if (type === 'application/json') return '📋';
    if (type === 'application/pdf') return '📕';
    if (type === 'text/csv') return '📊';
    return '📁';
  };

  // Filter files
  const filteredFiles = files.filter(file => {
    const matchesSearch = file.originalName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || file.fileType.startsWith(filterType);
    return matchesSearch && matchesFilter;
  });

  return (
    <>
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
                onClick={() => onFileClick(file)}
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
                      onFileClick(file);
                    }}
                  >
                    {downloadingFile === file.id ? '⏳' : '📥'}
                  </button>
                  <button 
                    className="action-btn delete-btn" 
                    title="Delete file"
                    onClick={(e) => onFileDelete(file, e)}
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default FileList;

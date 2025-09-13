package com.example.demo.model;

import java.time.LocalDateTime;

public class FileUploadResponse {
    
    private boolean success;
    private String message;
    private FileData data;
    
    // Constructors
    public FileUploadResponse() {}
    
    public FileUploadResponse(boolean success, String message, FileData data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }
    
    // Static factory methods
    public static FileUploadResponse success(String message, FileData data) {
        return new FileUploadResponse(true, message, data);
    }
    
    public static FileUploadResponse error(String message) {
        return new FileUploadResponse(false, message, null);
    }
    
    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public FileData getData() {
        return data;
    }
    
    public void setData(FileData data) {
        this.data = data;
    }
    
    // Inner class for file data
    public static class FileData {
        private Long id;
        private String originalName;
        private String fileType;
        private String fileSize;
        private LocalDateTime uploadDate;
        private String downloadUrl;
        private String viewUrl;
        
        // Constructors
        public FileData() {}
        
        public FileData(Long id, String originalName, String fileType, 
                       String fileSize, LocalDateTime uploadDate) {
            this.id = id;
            this.originalName = originalName;
            this.fileType = fileType;
            this.fileSize = fileSize;
            this.uploadDate = uploadDate;
            this.downloadUrl = "/api/files/" + id + "/download";
            this.viewUrl = "/api/files/" + id + "/view";
        }
        
        // Getters and Setters
        public Long getId() {
            return id;
        }
        
        public void setId(Long id) {
            this.id = id;
        }
        
        public String getOriginalName() {
            return originalName;
        }
        
        public void setOriginalName(String originalName) {
            this.originalName = originalName;
        }
        
        public String getFileType() {
            return fileType;
        }
        
        public void setFileType(String fileType) {
            this.fileType = fileType;
        }
        
        public String getFileSize() {
            return fileSize;
        }
        
        public void setFileSize(String fileSize) {
            this.fileSize = fileSize;
        }
        
        public LocalDateTime getUploadDate() {
            return uploadDate;
        }
        
        public void setUploadDate(LocalDateTime uploadDate) {
            this.uploadDate = uploadDate;
        }
        
        public String getDownloadUrl() {
            return downloadUrl;
        }
        
        public void setDownloadUrl(String downloadUrl) {
            this.downloadUrl = downloadUrl;
        }
        
        public String getViewUrl() {
            return viewUrl;
        }
        
        public void setViewUrl(String viewUrl) {
            this.viewUrl = viewUrl;
        }
    }
}

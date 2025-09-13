package com.example.demo.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "file")
public class FileStorageConfig {
    
    private String uploadDir = "src/main/resources/uploads";
    private long maxFileSize = 10485760; // 10MB in bytes
    private String[] allowedTypes = {
        "image/jpeg", "image/png", "image/gif", 
        "text/plain", "application/json", 
        "application/pdf", "text/csv"
    };
    
    // Getters and Setters
    public String getUploadDir() {
        return uploadDir;
    }
    
    public void setUploadDir(String uploadDir) {
        this.uploadDir = uploadDir;
    }
    
    public long getMaxFileSize() {
        return maxFileSize;
    }
    
    public void setMaxFileSize(long maxFileSize) {
        this.maxFileSize = maxFileSize;
    }
    
    public String[] getAllowedTypes() {
        return allowedTypes;
    }
    
    public void setAllowedTypes(String[] allowedTypes) {
        this.allowedTypes = allowedTypes;
    }
    
    // Helper methods
    public boolean isAllowedType(String contentType) {
        for (String allowedType : allowedTypes) {
            if (allowedType.equals(contentType)) {
                return true;
            }
        }
        return false;
    }
    
    public String getMaxFileSizeFormatted() {
        return formatFileSize(maxFileSize);
    }
    
    private String formatFileSize(long bytes) {
        if (bytes == 0) return "0 Bytes";
        
        String[] units = {"Bytes", "KB", "MB", "GB"};
        int unitIndex = (int) (Math.log(bytes) / Math.log(1024));
        double size = bytes / Math.pow(1024, unitIndex);
        
        return String.format("%.1f %s", size, units[unitIndex]);
    }
}

package com.example.demo.controller;

import com.example.demo.exception.FileNotFoundException;
import com.example.demo.model.File;
import com.example.demo.model.FileUploadResponse;
import com.example.demo.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = "http://localhost:3000")
public class FileController {
    
    @Autowired
    private FileService fileService;
    
    // Upload file
    @PostMapping("/upload")
    public ResponseEntity<FileUploadResponse> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "userId", required = false) Long userId) {
        
        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(FileUploadResponse.error("Please select a file to upload"));
        }
        
        FileUploadResponse response = fileService.uploadFile(file, userId);
        
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    // Get all files
    @GetMapping
    public ResponseEntity<List<File>> getAllFiles() {
        List<File> files = fileService.getAllFiles();
        return ResponseEntity.ok(files);
    }
    
    // Get files by user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<File>> getFilesByUser(@PathVariable Long userId) {
        List<File> files = fileService.getFilesByUser(userId);
        return ResponseEntity.ok(files);
    }
    
    // Search files
    @GetMapping("/search")
    public ResponseEntity<List<File>> searchFiles(@RequestParam String q) {
        List<File> files = fileService.searchFiles(q);
        return ResponseEntity.ok(files);
    }
    
    // Filter files by type
    @GetMapping("/filter")
    public ResponseEntity<List<File>> getFilesByType(@RequestParam String type) {
        List<File> files = fileService.getFilesByType(type);
        return ResponseEntity.ok(files);
    }
    
    // Get file by ID
    @GetMapping("/{id}")
    public ResponseEntity<File> getFileById(@PathVariable Long id) {
        try {
            File file = fileService.getFileById(id);
            return ResponseEntity.ok(file);
        } catch (FileNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Download file
    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) {
        try {
            Resource resource = fileService.getFileResource(id);
            File file = fileService.getFileById(id);
            
            // Determine if file should be displayed inline or downloaded
            String contentDisposition = shouldDisplayInline(file.getFileType()) 
                ? "inline; filename=\"" + file.getOriginalName() + "\""
                : "attachment; filename=\"" + file.getOriginalName() + "\"";
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(file.getFileType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
                    .body(resource);
        } catch (FileNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Helper method to determine if file should be displayed inline
    private boolean shouldDisplayInline(String fileType) {
        return fileType != null && (
            fileType.startsWith("image/") || 
            fileType.equals("application/pdf") ||
            fileType.startsWith("text/")
        );
    }
    
    // View file content (for text files)
    @GetMapping("/{id}/view")
    public ResponseEntity<Map<String, Object>> viewFile(@PathVariable Long id) {
        try {
            File file = fileService.getFileById(id);
            String content = fileService.getFileContent(id);
            
            Map<String, Object> response = new HashMap<>();
            response.put("file", file);
            response.put("content", content);
            response.put("success", true);
            
            return ResponseEntity.ok(response);
        } catch (FileNotFoundException e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "File not found");
            return ResponseEntity.notFound().build();
        }
    }
    
    // View file inline (for binary files like PDFs, images)
    @GetMapping("/{id}/inline")
    public ResponseEntity<Resource> viewFileInline(@PathVariable Long id) {
        try {
            Resource resource = fileService.getFileResource(id);
            File file = fileService.getFileById(id);
            
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(file.getFileType()))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getOriginalName() + "\"")
                    .body(resource);
        } catch (FileNotFoundException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // Delete file
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteFile(@PathVariable Long id) {
        boolean deleted = fileService.deleteFile(id);
        
        Map<String, Object> response = new HashMap<>();
        if (deleted) {
            response.put("success", true);
            response.put("message", "File deleted successfully");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Failed to delete file");
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    // Get storage statistics
    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStorageStats() {
        Long totalStorage = fileService.getTotalStorageUsed();
        Long fileCount = fileService.getFileCount();
        
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalStorage", totalStorage);
        stats.put("totalStorageFormatted", formatFileSize(totalStorage));
        stats.put("fileCount", fileCount);
        
        return ResponseEntity.ok(stats);
    }
    
    // Helper method to format file size
    private String formatFileSize(long bytes) {
        if (bytes == 0) return "0 Bytes";
        
        String[] units = {"Bytes", "KB", "MB", "GB"};
        int unitIndex = (int) (Math.log(bytes) / Math.log(1024));
        double size = bytes / Math.pow(1024, unitIndex);
        
        return String.format("%.1f %s", size, units[unitIndex]);
    }
}

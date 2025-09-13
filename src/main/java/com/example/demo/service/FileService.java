package com.example.demo.service;

import com.example.demo.exception.FileNotFoundException;
import com.example.demo.exception.FileStorageException;
import com.example.demo.model.File;
import com.example.demo.model.FileUploadResponse;
import com.example.demo.repository.FileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Service
public class FileService {
    
    @Autowired
    private FileRepository fileRepository;
    
    @Autowired
    private FileStorageService fileStorageService;
    
    public FileUploadResponse uploadFile(MultipartFile multipartFile, Long userId) {
        try {
            // Store file in filesystem
            String filePath = fileStorageService.storeFile(multipartFile);
            
            // Create file entity
            File file = new File();
            file.setOriginalName(multipartFile.getOriginalFilename());
            file.setStoredName(extractStoredFileName(filePath));
            file.setFilePath(filePath);
            file.setFileType(multipartFile.getContentType());
            file.setFileSize(multipartFile.getSize());
            file.setUserId(userId);
            
            // Save to database
            File savedFile = fileRepository.save(file);
            
            // Create response
            FileUploadResponse.FileData fileData = new FileUploadResponse.FileData(
                savedFile.getId(),
                savedFile.getOriginalName(),
                savedFile.getFileType(),
                savedFile.getFormattedFileSize(),
                savedFile.getUploadDate()
            );
            
            return FileUploadResponse.success("File uploaded successfully", fileData);
            
        } catch (Exception e) {
            return FileUploadResponse.error("Failed to upload file: " + e.getMessage());
        }
    }
    
    public List<File> getAllFiles() {
        return fileRepository.findByIsActiveTrueOrderByUploadDateDesc();
    }
    
    public List<File> getFilesByUser(Long userId) {
        return fileRepository.findByUserIdAndIsActiveTrueOrderByUploadDateDesc(userId);
    }
    
    public List<File> searchFiles(String searchTerm) {
        return fileRepository.searchByOriginalName(searchTerm);
    }
    
    public List<File> getFilesByType(String fileType) {
        if (fileType.equals("all")) {
            return getAllFiles();
        }
        return fileRepository.findByFileTypePrefix(fileType);
    }
    
    public File getFileById(Long id) {
        Optional<File> file = fileRepository.findById(id);
        if (file.isPresent() && file.get().getIsActive()) {
            return file.get();
        }
        throw new FileNotFoundException("File not found with id: " + id);
    }
    
    public Resource getFileResource(Long id) {
        File file = getFileById(id);
        return fileStorageService.loadFileAsResource(file.getFilePath());
    }
    
    public String getFileContent(Long id) {
        File file = getFileById(id);
        Resource resource = fileStorageService.loadFileAsResource(file.getFilePath());
        
        try {
            // For text-based files, return content as string
            if (isTextFile(file.getFileType())) {
                return new String(resource.getInputStream().readAllBytes());
            } else {
                // For binary files, return a message
                return "Binary file content cannot be displayed as text";
            }
        } catch (Exception e) {
            throw new FileStorageException("Could not read file content", e);
        }
    }
    
    public boolean deleteFile(Long id) {
        Optional<File> fileOpt = fileRepository.findById(id);
        if (fileOpt.isPresent()) {
            File file = fileOpt.get();
            
            // Delete from filesystem
            boolean deleted = fileStorageService.deleteFile(file.getFilePath());
            
            if (deleted) {
                // Soft delete from database
                file.setIsActive(false);
                fileRepository.save(file);
                return true;
            }
        }
        return false;
    }
    
    public Long getTotalStorageUsed() {
        Long totalSize = fileRepository.getTotalStorageUsed();
        return totalSize != null ? totalSize : 0L;
    }
    
    public Long getFileCount() {
        return fileRepository.count();
    }
    
    private String extractStoredFileName(String filePath) {
        return filePath.substring(filePath.lastIndexOf("/") + 1);
    }
    
    private boolean isTextFile(String contentType) {
        return contentType != null && (
            contentType.startsWith("text/") ||
            contentType.equals("application/json") ||
            contentType.equals("application/xml") ||
            contentType.equals("text/csv")
        );
    }
}

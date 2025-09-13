package com.example.demo.repository;

import com.example.demo.model.File;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FileRepository extends JpaRepository<File, Long> {
    
    // Find all active files
    List<File> findByIsActiveTrueOrderByUploadDateDesc();
    
    // Find files by user ID
    List<File> findByUserIdAndIsActiveTrueOrderByUploadDateDesc(Long userId);
    
    // Find files by file type
    List<File> findByFileTypeContainingIgnoreCaseAndIsActiveTrueOrderByUploadDateDesc(String fileType);
    
    // Search files by original name
    @Query("SELECT f FROM File f WHERE f.originalName LIKE %:searchTerm% AND f.isActive = true ORDER BY f.uploadDate DESC")
    List<File> searchByOriginalName(@Param("searchTerm") String searchTerm);
    
    // Find file by stored name
    Optional<File> findByStoredName(String storedName);
    
    // Find files by file type prefix (e.g., "image/", "text/")
    @Query("SELECT f FROM File f WHERE f.fileType LIKE :typePrefix% AND f.isActive = true ORDER BY f.uploadDate DESC")
    List<File> findByFileTypePrefix(@Param("typePrefix") String typePrefix);
    
    // Count files by type
    @Query("SELECT COUNT(f) FROM File f WHERE f.fileType = :fileType AND f.isActive = true")
    Long countByFileType(@Param("fileType") String fileType);
    
    // Get total storage used
    @Query("SELECT SUM(f.fileSize) FROM File f WHERE f.isActive = true")
    Long getTotalStorageUsed();
    
    // Find files uploaded in date range
    @Query("SELECT f FROM File f WHERE f.uploadDate BETWEEN :startDate AND :endDate AND f.isActive = true ORDER BY f.uploadDate DESC")
    List<File> findByUploadDateBetween(@Param("startDate") java.time.LocalDateTime startDate, 
                                      @Param("endDate") java.time.LocalDateTime endDate);
}

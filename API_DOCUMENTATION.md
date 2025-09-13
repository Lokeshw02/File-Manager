# 📁 File Manager API Documentation

## 🚀 Overview
The File Manager API provides comprehensive file management capabilities including upload, download, view, search, and delete operations.

## 🔗 Base URL
```
http://localhost:8080/api/files
```

## 📋 API Endpoints

### 1. Upload File
**POST** `/api/files/upload`

Upload a new file to the system.

**Request:**
- **Content-Type:** `multipart/form-data`
- **Body:**
  - `file` (required): The file to upload
  - `userId` (optional): User ID for file ownership

**Response:**
```json
{
  "success": true,
  "message": "File uploaded successfully",
  "data": {
    "id": 1,
    "originalName": "document.pdf",
    "fileType": "application/pdf",
    "fileSize": "2.3 MB",
    "uploadDate": "2024-01-15T10:30:00",
    "downloadUrl": "/api/files/1/download",
    "viewUrl": "/api/files/1/view"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "File type not supported",
  "error": "FILE_STORAGE_ERROR"
}
```

### 2. Get All Files
**GET** `/api/files`

Retrieve all uploaded files.

**Response:**
```json
[
  {
    "id": 1,
    "originalName": "document.pdf",
    "storedName": "uuid-filename.pdf",
    "filePath": "2024/01/15/uuid-filename.pdf",
    "fileType": "application/pdf",
    "fileSize": 2400000,
    "uploadDate": "2024-01-15T10:30:00",
    "userId": null,
    "description": null,
    "isActive": true
  }
]
```

### 3. Get Files by User
**GET** `/api/files/user/{userId}`

Retrieve files uploaded by a specific user.

**Parameters:**
- `userId` (path): User ID

**Response:** Same as Get All Files

### 4. Search Files
**GET** `/api/files/search?q={query}`

Search files by name.

**Parameters:**
- `q` (query): Search term

**Response:** Same as Get All Files

### 5. Filter Files by Type
**GET** `/api/files/filter?type={fileType}`

Filter files by file type.

**Parameters:**
- `type` (query): File type prefix (e.g., "image/", "text/", "application/")

**Response:** Same as Get All Files

### 6. Get File by ID
**GET** `/api/files/{id}`

Retrieve a specific file by ID.

**Parameters:**
- `id` (path): File ID

**Response:**
```json
{
  "id": 1,
  "originalName": "document.pdf",
  "storedName": "uuid-filename.pdf",
  "filePath": "2024/01/15/uuid-filename.pdf",
  "fileType": "application/pdf",
  "fileSize": 2400000,
  "uploadDate": "2024-01-15T10:30:00",
  "userId": null,
  "description": null,
  "isActive": true
}
```

### 7. Download File
**GET** `/api/files/{id}/download`

Download a file.

**Parameters:**
- `id` (path): File ID

**Response:**
- **Content-Type:** Based on file type
- **Content-Disposition:** `attachment; filename="original-filename"`
- **Body:** File content

### 8. View File Content
**GET** `/api/files/{id}/view`

View file content (for text-based files).

**Parameters:**
- `id` (path): File ID

**Response:**
```json
{
  "file": {
    "id": 1,
    "originalName": "document.txt",
    "fileType": "text/plain",
    "fileSize": 1024,
    "uploadDate": "2024-01-15T10:30:00"
  },
  "content": "File content here...",
  "success": true
}
```

### 9. Delete File
**DELETE** `/api/files/{id}`

Delete a file (soft delete).

**Parameters:**
- `id` (path): File ID

**Response:**
```json
{
  "success": true,
  "message": "File deleted successfully"
}
```

### 10. Get Storage Statistics
**GET** `/api/files/stats`

Get storage usage statistics.

**Response:**
```json
{
  "totalStorage": 10485760,
  "totalStorageFormatted": "10.0 MB",
  "fileCount": 25
}
```

## 🔧 Configuration

### File Upload Limits
- **Maximum file size:** 10MB
- **Maximum request size:** 10MB

### Supported File Types
- **Images:** `image/jpeg`, `image/png`, `image/gif`
- **Text:** `text/plain`, `text/csv`
- **Documents:** `application/json`, `application/pdf`

### File Storage
- **Storage path:** `src/main/resources/uploads/`
- **Directory structure:** `YYYY/MM/DD/`
- **File naming:** UUID + original extension

## 🚨 Error Handling

### HTTP Status Codes
- **200 OK:** Successful operation
- **400 Bad Request:** Invalid request or file validation failed
- **404 Not Found:** File not found
- **413 Payload Too Large:** File size exceeds limit
- **500 Internal Server Error:** Server error

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "ERROR_CODE"
}
```

### Common Error Codes
- `FILE_NOT_FOUND`: File doesn't exist
- `FILE_STORAGE_ERROR`: File system error
- `FILE_SIZE_EXCEEDED`: File too large
- `INVALID_ARGUMENT`: Invalid request parameters
- `INTERNAL_SERVER_ERROR`: Unexpected server error

## 🔒 Security Features

1. **File Type Validation:** Only allowed file types can be uploaded
2. **File Size Limits:** Maximum 10MB per file
3. **Path Traversal Protection:** Prevents directory traversal attacks
4. **CORS Configuration:** Configured for React frontend
5. **Input Validation:** All inputs are validated and sanitized

## 📊 Database Schema

### Files Table
```sql
CREATE TABLE files (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    original_name VARCHAR(255) NOT NULL,
    stored_name VARCHAR(255) NOT NULL UNIQUE,
    file_path VARCHAR(500) NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    file_size BIGINT NOT NULL,
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    user_id BIGINT,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);
```

## 🧪 Testing

### Test File Upload
```bash
curl -X POST http://localhost:8080/api/files/upload \
  -F "file=@test.txt" \
  -F "userId=1"
```

### Test File Download
```bash
curl -X GET http://localhost:8080/api/files/1/download \
  -o downloaded_file.txt
```

### Test Search
```bash
curl -X GET "http://localhost:8080/api/files/search?q=document"
```

## 🚀 Getting Started

1. **Start the backend:**
   ```bash
   mvn spring-boot:run
   ```

2. **Start the frontend:**
   ```bash
   cd frontend
   npm start
   ```

3. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8080/api/files

## 📝 Notes

- Files are stored in a date-based directory structure for better organization
- All file operations are logged for audit purposes
- The system supports soft deletion (files are marked as inactive)
- File metadata is stored in the database while actual files are stored on disk
- CORS is configured to allow requests from the React frontend

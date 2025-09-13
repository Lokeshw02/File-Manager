# 📁 File Manager Frontend

The React frontend for the File Manager application. A modern, responsive user interface for uploading, downloading, and managing files.

## ✨ Features

- **File Upload**: Drag & drop or click to upload files
- **File Type Support**: JPG, PNG, GIF, TXT, JSON, PDF, CSV
- **File Viewer**: Click any file to view its contents
- **Search & Filter**: Find files quickly with search and type filtering
- **Responsive Design**: Works perfectly on desktop and mobile
- **Modern UI**: Beautiful gradient design with smooth animations
- **File Restrictions**: Built-in validation for file types and sizes

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Java 17
- Maven

### Installation

1. **Backend Setup**:
   ```bash
   cd /path/to/project
   mvn spring-boot:run
   ```
   The backend will start on `http://localhost:8080`

2. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm start
   ```
   The frontend will start on `http://localhost:3000`

## 📱 Usage

1. **Upload Files**: Click the "Choose File" button to upload new files
2. **View Files**: Click on any file card to view its contents
3. **Search**: Use the search bar to find specific files
4. **Filter**: Use the dropdown to filter by file type
5. **File Viewer**: View images, text files, JSON data, and more in a beautiful modal

## 🎨 Design Features

- **Gradient Background**: Beautiful purple-blue gradient
- **Glass Morphism**: Frosted glass effect on cards and inputs
- **Smooth Animations**: Hover effects and transitions
- **Responsive Grid**: Adaptive layout for all screen sizes
- **Modern Typography**: Clean, readable fonts
- **Interactive Elements**: Engaging buttons and hover states

## 🔧 Technical Details

- **Frontend**: React 18, Bootstrap 5, Custom CSS
- **Backend**: Spring Boot 3.4.9, JPA, MySQL
- **File Types**: Images, Text, JSON, PDF, CSV
- **Max File Size**: 10MB
- **Browser Support**: Modern browsers with ES6+ support

## 📁 Supported File Types

| Type | Extensions | Icon |
|------|------------|------|
| Images | .jpg, .jpeg, .png, .gif | 🖼️ |
| Text | .txt | 📄 |
| JSON | .json | 📋 |
| PDF | .pdf | 📕 |
| CSV | .csv | 📊 |

## 🎯 Future Enhancements

- File download functionality
- File sharing capabilities
- User authentication
- File versioning
- Advanced search filters
- File preview thumbnails
- Drag & drop upload
- File organization with folders

## 📄 License

This project is open source and available under the MIT License.
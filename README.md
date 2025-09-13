# 📁 File Manager

A modern, full-stack file management system built with **Spring Boot** and **React**. Upload, download, and manage your files with a beautiful, responsive user interface.

## ✨ Features

- **📤 File Upload** - Drag & drop or click to upload files
- **📥 File Download** - One-click download with progress indicators
- **🗑️ File Management** - Delete files with confirmation
- **🔍 Search & Filter** - Find files quickly with search and type filtering
- **📱 Responsive Design** - Works perfectly on desktop and mobile
- **🎨 Modern UI** - Beautiful gradient design with smooth animations
- **🔒 File Validation** - Built-in validation for file types and sizes

## 🚀 Tech Stack

### Backend
- **Java 17**
- **Spring Boot 3.4.9**
- **Spring Data JPA**
- **MySQL Database**
- **Maven**

### Frontend
- **React 18**
- **Bootstrap 5**
- **Axios**
- **Modern CSS with Animations**

## 📁 Supported File Types

| Type | Extensions | Icon |
|------|------------|------|
| **Images** | .jpg, .jpeg, .png, .gif | 🖼️ |
| **Documents** | .pdf | 📕 |
| **Text** | .txt | 📄 |
| **Data** | .json, .csv | 📋 |

## 🛠️ Installation & Setup

### Prerequisites
- Java 17 or higher
- Node.js 14 or higher
- MySQL Database
- Maven

### Backend Setup

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd file-manager
   ```

2. **Configure Database:**
   ```bash
   # Create MySQL database
   mysql -u root -p
   CREATE DATABASE demo;
   ```

3. **Update Database Configuration:**
   ```properties
   # src/main/resources/application.properties
   spring.datasource.url=jdbc:mysql://localhost:3306/demo
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

4. **Run Backend:**
   ```bash
   ./mvnw spring-boot:run
   ```
   Backend will start on `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start Frontend:**
   ```bash
   npm start
   ```
   Frontend will start on `http://localhost:3000`

## 🎯 Usage

1. **Upload Files:** Click "Choose File" to upload new files
2. **Download Files:** Click the 📥 download button on any file
3. **Delete Files:** Click the 🗑️ delete button to remove files
4. **Search Files:** Use the search bar to find specific files
5. **Filter Files:** Use the dropdown to filter by file type

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/files/upload` | Upload a new file |
| `GET` | `/api/files` | Get all files |
| `GET` | `/api/files/{id}` | Get file by ID |
| `GET` | `/api/files/{id}/download` | Download file |
| `DELETE` | `/api/files/{id}` | Delete file |
| `GET` | `/api/files/search?q={query}` | Search files |
| `GET` | `/api/files/filter?type={type}` | Filter files by type |

## 🗂️ Project Structure

```
file-manager/
├── src/main/java/com/example/demo/
│   ├── controller/          # REST API Controllers
│   ├── service/            # Business Logic
│   ├── repository/         # Data Access Layer
│   ├── model/              # Entity Models
│   ├── config/             # Configuration
│   └── exception/          # Exception Handling
├── src/main/resources/
│   ├── uploads/            # File Storage Directory
│   └── application.properties
├── frontend/               # React Application
│   ├── src/
│   │   ├── components/     # React Components
│   │   ├── services/       # API Services
│   │   └── styles/         # CSS Styles
│   └── public/
└── README.md
```

## 🔧 Configuration

### File Upload Limits
- **Maximum file size:** 10MB
- **Supported types:** JPG, PNG, GIF, TXT, JSON, PDF, CSV

### File Storage
- **Local storage:** `src/main/resources/uploads/`
- **Directory structure:** `YYYY/MM/DD/`
- **File naming:** UUID + original extension

## 🚀 Deployment

### Development
```bash
# Terminal 1 - Backend
./mvnw spring-boot:run

# Terminal 2 - Frontend
cd frontend && npm start
```

### Production
```bash
# Build frontend
cd frontend && npm run build

# Copy to backend static folder
cp -r build/* ../src/main/resources/static/

# Run backend (serves both API and frontend)
./mvnw spring-boot:run
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Lokesh Wagadre**
- GitHub: [@lokeshwagadre](https://github.com/lokeshwagadre)

## 🙏 Acknowledgments

- Spring Boot team for the amazing framework
- React team for the powerful frontend library
- Bootstrap for the beautiful UI components

---

⭐ **Star this repository if you found it helpful!**
# File-Manager

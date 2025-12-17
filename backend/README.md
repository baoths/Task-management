# Backend - Task Management API

Thư mục này chứa mã nguồn phía máy chủ (API, logic nghiệp vụ) của ứng dụng.

## 🚀 Cách chạy

### 1. Cài đặt dependencies
```bash
cd backend
npm install
# hoặc
pnpm install
```

### 2. Cấu hình môi trường
Copy file `.env.example` thành `.env`:
```bash
cp .env.example .env
```

Nội dung file `.env`:
```
APP_PORT=3000
MONGO_URL=mongodb://localhost:27017/todo-app
SECRET_TOKEN=your-secret-token-change-this-in-production
```

### 3. Import dữ liệu mẫu (nếu có)
```bash
node scripts/importDB.js
```

### 4. Chạy server
```bash
npm start
# hoặc
pnpm start
```

### 5. Truy cập
- Frontend: http://localhost:3000
- API: http://localhost:3000/auth, http://localhost:3000/task

## 📦 Export/Import Database

**Export (backup):**
```bash
node scripts/exportDB.js
```

**Import (restore):**
```bash
node scripts/importDB.js
```

File backup: `database_export/todo-app-backup.json`
# Task Management - Ứng dụng Quản Lý Công Việc

Ứng dụng web quản lý công việc (To-Do List) với đầy đủ tính năng CRUD, xác thực người dùng và giao diện đẹp mắt.

## ✨ Tính năng

- 🔐 **Xác thực người dùng**: Đăng ký, đăng nhập, đăng xuất với JWT
- 📝 **Quản lý công việc**: Tạo, sửa, xóa, đánh dấu hoàn thành
- 🏷️ **Lọc theo trạng thái**: Tất cả, Chờ xử lý, Đang làm, Hoàn thành
- 🎨 **Giao diện hiện đại**: Responsive, animation đẹp mắt

## 🛠️ Công nghệ sử dụng

### Backend
| Công nghệ | Mô tả |
|-----------|-------|
| Node.js | Runtime JavaScript |
| Express.js | Web framework |
| MongoDB | Cơ sở dữ liệu NoSQL |
| Mongoose | ODM cho MongoDB |
| JWT | Xác thực token |
| bcryptjs | Mã hóa mật khẩu |

### Frontend
| Công nghệ | Mô tả |
|-----------|-------|
| HTML5 | Cấu trúc trang |
| CSS3 | Giao diện & Animation |
| JavaScript | Logic & API calls |

## 📁 Cấu trúc thư mục

```
Work app/
├── backend/                    # Server-side code
│   ├── application/           
│   │   └── usecases/          # Business logic (Clean Architecture)
│   ├── controllers/           # Xử lý HTTP request/response
│   ├── domain/               
│   │   ├── entities/          # Domain models
│   │   └── repositories/      # Repository interfaces
│   ├── infrastructure/       
│   │   └── repositories/      # Repository implementations
│   ├── middleware/            # Auth, logging middleware
│   ├── models/                # Mongoose schemas
│   ├── routes/                # API routes
│   ├── scripts/               # Export/Import database
│   ├── server.js               # Entry point
│   ├── package.json           # Dependencies
│   └── .env.example           # Environment template
│
├── frontend/                   # Client-side code
│   ├── index.html             # Trang đăng nhập/đăng ký
│   └── public/
│       ├── tasks.html         # Trang quản lý công việc
│       ├── css/
│       │   └── style.css      # Stylesheet
│       └── js/
│           ├── auth.js        # Xử lý xác thực
│           ├── tasks.js       # Xử lý công việc
│           └── utils.js       # API helper, utilities
│
├── database_export/            # Database backup
│   └── todo-app-backup.json
├── LICENSE
└── README.md
```

## 🚀 Cài đặt & Chạy

### Yêu cầu
- Node.js >= 18
- MongoDB

### Các bước

```bash

# 1. Cài đặt dependencies
cd backend
npm install   # hoặc: pnpm install

# 2. Import database mẫu (tùy chọn)
node scripts/importDB.js

# 5. Chạy server
npm start
```

### Truy cập
- 🌐 **Website**: http://localhost:3000
- 🔗 **API**: http://localhost:3000/auth, http://localhost:3000/task

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/auth/register` | Đăng ký tài khoản |
| POST | `/auth/login` | Đăng nhập |
| POST | `/auth/logout` | Đăng xuất |

### Tasks
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/task/getTasks` | Lấy danh sách công việc |
| POST | `/task/createTask` | Tạo công việc mới |
| POST | `/task/updateTask` | Cập nhật công việc |
| POST | `/task/markDone` | Đánh dấu hoàn thành |
| POST | `/task/markUnDone` | Đánh dấu chưa hoàn thành |
| POST | `/task/deActivateTask` | Xóa công việc |

## Members

**Nhật Minh,**
**Kim Bảo**


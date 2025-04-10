# ✍️ Freelance – Personal Blog

Welcome! This is the source code for my full-stack **Personal Blog** platform built for a freelance client. It features a clean UI, rich blog post management, and secure user roles using modern web technologies.

🌐 [Visit Personal Blog - LIVE](https://hans-blog-new-repo.onrender.com)

---

## 🤔 What’s Inside?

This blog platform is designed for clients who want a personal or business blog with rich functionality, secure access levels, and seamless user experience. Admins can fully manage blog content, and regular users can interact via reading and commenting.

---


## 🧱INFRASTRUCTURE

![Architecture review (1)](https://github.com/user-attachments/assets/f9b9280d-15d6-4298-935f-fcf123461b5e)


---



## 🧱 Tech Stack

### Frontend
- **React**
- **Tailwind CSS**
- **JavaScript**

### Backend
- **Node.js**
- **Express.js**
- **MongoDB** (with Mongoose)
- **Firebase** (Auth & Storage)
- **Multer** + **Cloudinary** (for image uploads)

### APIs & Integrations
- **JWT + bcrypt.js** – user authentication & password security
- **Firebase Google Auth** – seamless login via Google
- **Web3Forms** – contact form with email notifications

### Deployment & Monitoring
- **Render** – server & app hosting
- **UptimeRobot** – app availability monitoring

---

## 🛠️ Key Features

- 🔐 **User Authentication**
  - Google Sign-In via Firebase
  - JWT-secured sessions with hashed passwords
- 👥 **Role-Based Access Control (RBAC)**
  - **Admin**: Create, edit, delete blog posts, manage users, assign roles
  - **User**: Read blog posts, sign up, and comment
- 📝 **CRUD Functionality** for posts and users
- ☁️ **File Uploads** via Multer & Cloudinary
- 💬 **Contact Form** integrated with Web3Forms
- 📱 **Fully Responsive Design** (Mobile-first)
- 🚦 **Status Monitoring** with UptimeRobot

---

## 📦 Setup Instructions

### 🔧 Development

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
npm install
```

Create a `.env` file and add environment variables for:
- MongoDB connection
- Firebase config
- JWT secret
- Cloudinary API keys
- Web3Forms endpoint

Start the development server:

```bash
npm run dev
```

---

### 🚀 Deployment

This app is configured for deployment on **Render**.  
CI/CD and uptime monitoring is handled through **GitHub Actions** and **UptimeRobot**.

---

## 🧪 Final Thoughts

This personal blog app was developed for a freelance client needing a robust platform with user management and publishing capabilities. It reflects the scalability and performance focus I bring to all my projects.

---

## 🙋‍♂️ About Me

👋 I'm Hans Kang, a full-stack developer with a passion for creating high-performance, modern web apps.  
🔗 [Personal Portfolio](https://hanskang.com)  
📫 [LinkedIn](https://www.linkedin.com/in/hanskkang)

---

# LMS Admin Panel Frontend 🎨

This repository contains the **frontend** of the **Learning Management System (LMS) Admin Panel**, built with **React, Tailwind CSS, and Redux Toolkit**.

The dashboard provides a **clean, responsive UI** for managing courses, modules, lessons, users, and enrollments with **role-based access control**.

---

## ✨ Key Highlights

*   **Fully Role-Based UI**: Distinct views for Admin, Instructor, and Student.
*   **Real-Time Analytics**: Live dashboard statistics using **Server-Sent Events (SSE)**.
*   **Interactive Charts**: Data visualization with **Recharts**.
*   **Modern UI**: Built with **Radix UI** (shadcn/ui) and **Framer Motion** animations.
*   **Secure Authentication**: Includes Login, Registration, **OTP Verification**, and Password Recovery.
*   **Dynamic Forms**: Robust validation using **Formik & Yup**.
*   **Responsive Design**: Optimized for mobile, tablet, and desktop.
*   **State Management**: Centralized state using **Redux Toolkit**.

---

## 🔹 Role-Based Access

The frontend enforces **role-based visibility** and actions based on logged-in user:

| Role           | Access & Permissions                                |
| -------------- | --------------------------------------------------- |
| **ADMIN**      | Full access to users, courses, enrollments, and system settings. |
| **INSTRUCTOR** | Can create and manage courses, modules, lessons, and view enrollments. |
| **STUDENT**    | Access to enrolled courses, progress tracking, and student dashboard. |

*   Navigation menus and buttons change dynamically based on the role.
*   Protected routes prevent unauthorized access.

---

🎥 **Demo Preview**

The current preview showcases core functionality of the project.  
A refreshed walkthrough highlighting recent UI improvements will be added soon.

**Watch Demo:** [View Here](https://drive.google.com/file/d/1OwtpI2WYLKZF514XHwPU26b_E2rlsv4Q/view?usp=sharing)

---

## 📚 Dashboard Modules

### 📊 Dashboard
*   **Real-time Stats**: Live updates for users, courses, and enrollments via SSE.
*   **Visualizations**: Line charts for monthly activity and Pie charts for course status.
*   **Recent Activity**: Quick view of recent enrollments.

### 🎓 Courses
*   View all courses with filters (Search, Status).
*   Create, update, and delete courses (Admin/Instructor).
*   **Rich Media**: Support for video lessons and thumbnails.
*   See course status: `DRAFT`, `PUBLISHED`, `UNPUBLISHED`.

### 📝 Modules & Lessons

*   Nested module → lesson structure.
*   Add, update, reorder modules and lessons.
*   Lesson fields include:

  * Video URL / embedded content
  * Duration
  * Additional resources (files / links)

### 👥 Users

*   Admin can view and search users.
*   Role assignment and status management (`ACTIVE`, `PENDING`, `SUSPENDED`).
*   **Views**: Table view for desktop, Card view for mobile.

### 📚 Enrollments

*   Track which students are enrolled in which courses.
*   See progress, completion, and enrollment status.
*   Admin actions to cancel or activate enrollments.

### ⚙️ Settings
*   Profile management.
*   Change password functionality.
*   Notification and appearance preferences.

---

## 🛠️ Tech Stack

* **React (Vite)** – Frontend framework
* **Tailwind CSS** – Styling and layout
* **UI Components** – shadcn/ui (Radix UI)
* **Redux Toolkit** – State management
* **React Router v6** – Routing
* **Formik & Yup** – Forms & validation
* **Recharts** – Data visualization
* **Axios** – API requests
* **Sonner** – Toast notifications
* **Framer Motion** – Animations
* **Lucide Icons** – UI icons

---

## 📁 Folder Structure

```bash
src/
│
├── components/        # Reusable UI components (ui/ for shadcn)
├── pages/             # Page-level components (Dashboard, Courses, Auth)
├── features/          # Redux setup
│   ├── slice/         # Redux slices (userSlice, courseSlice, etc.)
│   └── axios.js       # Axios instance
├── utils/             # Helper functions (formatters, validators)
├── App.jsx            # Main App component
└── main.jsx           # React DOM rendering and setup
```

---

## 🚀 Key Features

*   **Authentication Flow**: Login, Register, OTP Verification, Password Reset.
*   **Dynamic Forms**: For adding/editing courses, modules, and lessons.
*   **Sorting, Filtering, & Search**: Across all data lists.
*   **Real-time Feedback**: Toast notifications for user actions.
*   **Responsive Layouts**: Adaptive designs for mobile cards vs. desktop tables.
*   **Video Player**: Integrated player for course content.

---

## 🧩 Security & Best Practices

* Role-based route protection
* Frontend validations using Yup
* Proper error handling for API calls
* Modular component design for reusability

---

## 🌟 Scalability & Future Enhancements

* Add **quiz and certificate modules**
* Integrate **real-time notifications** using WebSockets
* Add **analytics dashboard** for student progress
* Implement **theme switcher** (dark/light mode)
* Progressive web app (PWA) support for offline access

---

## 📌 Status

✅ Dashboard Layout (with SSE)  
✅ Authentication (Login, Register, OTP, Password Reset)  
✅ Courses CRUD  
✅ Modules & Lessons CRUD  
✅ Users Management  
✅ Role-Based UI  
✅ Enrollment & Progress Tracking  
✅ Settings Page

---

## ❤️ Links / Contact

Made by **Rajendra Behera**

**Email:** [rajendrabehera8116@gmail.com](mailto:rajendrabehera8116@gmail.com)  
**LinkedIn:** [/behera-rajendra](https://www.linkedin.com/in/behera-rajendra/)  
**GitHub:** [/BRajendra10](https://github.com/BRajendra10)

**Frontend** [/EdTech-frontend](https://github.com/BRajendra10/EdTech-fronted)  
**Backend** [/EdTech-backend](https://github.com/BRajendra10/EdTech-backend)

---

# LMS Admin Panel Frontend 🎨

This repository contains the **frontend** of the **Learning Management System (LMS) Admin Panel**, built with **React, Tailwind CSS, and Redux Toolkit**.

The dashboard provides a **clean, responsive UI** for managing courses, modules, lessons, users, and enrollments with **role-based access control**.

---

## ✨ Key Highlights

* Fully **role-based UI** for Admin, Instructor, and Student views
* **Responsive design** for mobile, tablet, and desktop
* **Dynamic forms** with validation using Formik & Yup
* **Async state management** via Redux Toolkit and RTK Query
* **Real-time feedback** via toast notifications
* **Clean and reusable component architecture**

---

## 🔹 Role-Based Access

The frontend enforces **role-based visibility** and actions based on logged-in user:

| Role           | Access & Permissions                                |
| -------------- | --------------------------------------------------- |
| **ADMIN**      | Full access to all dashboard modules and users      |
| **INSTRUCTOR** | Can create and manage own courses, modules, lessons |
| **STUDENT**    | Can view enrolled courses and track progress        |

* Navigation menus and buttons change dynamically based on the role
* Protected routes prevent unauthorized access
* Form and action validations prevent accidental misuse

---

## 📚 Dashboard Modules

### Courses

* View all courses with filters and sorting
* Create, update, and delete courses
* Assign instructors to courses
* See course status: `DRAFT`, `PUBLISHED`, `ARCHIVED`

### Modules & Lessons

* Nested module → lesson structure
* Add, update, reorder modules and lessons
* Lesson fields include:

  * Video URL / embedded content
  * Duration
  * Additional resources (files / links)

### Users

* Admin can view, edit, or remove users
* Role assignment and status management

### Enrollments

* Track which students are enrolled in which courses
* See progress, completion, and enrollment status

---

## 🛠️ Tech Stack

* **React (Vite)** – Frontend framework
* **Tailwind CSS** – Styling and layout
* **Redux Toolkit** – State management
* **React Router v6** – Routing
* **Formik & Yup** – Forms & validation
* **Axios** – API requests
* **Lucide Icons** – UI icons

---

## 📁 Folder Structure

```bash
frontend/
│
├── components/        # Reusable UI components (buttons, inputs, cards)
├── pages/             # Page-level components (Dashboard, Courses, Users)
├── features/          # Redux slices & async thunks
├── routes/            # React Router route definitions
├── services/          # API service calls
├── utils/             # Helper functions (formatters, validators)
├── App.jsx            # Main App component
└── main.jsx           # React DOM rendering and setup
```

---

## 🚀 Key Features

* **Dynamic forms** for adding/editing courses, modules, and lessons
* **Sorting, filtering, and search** across all lists
* **Real-time toast notifications** for actions like create, update, delete
* **Responsive, mobile-friendly dashboard**
* **Clean, modular codebase** for scalability

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

✅ Dashboard Layout  
✅ Courses CRUD  
✅ Modules & Lessons CRUD  
✅ Users Management  
✅ Role-Based UI  
✅ Enrollment Overview  

Perfect, Rajendra! A **footer section** adds a nice finishing touch — you can include things like **contact info, social links, GitHub, LinkedIn, or a “Made with ❤️” message**.

Here’s a **consistent footer section** you can add to **both backend and frontend READMEs**:

---

## ❤️ Links / Contact

Made by **Rajendra Behera**

**Email:** [rajendrabehera8116@gmail.com](mailto:rajendrabehera8116@gmail.com)  
**LinkedIn:** [/behera-rajendra](https://www.linkedin.com/in/behera-rajendra/)  
**GitHub:** [/BRajendra10](https://github.com/BRajendra10)

**Frontend** [/EdTech-frontend](https://github.com/BRajendra10/EdTech-fronted)  
**Backend** [/EdTech-backend](https://github.com/BRajendra10/EdTech-backend)

---

# Talentflow: A Mini Hiring Platform

**Talentflow** is a mini hiring platform designed to help HR teams manage jobs, candidates, and assessments. This project was developed as a front-end technical assignment and simulates a back-end API using **Mock Service Worker (MSW)**. All data is persisted locally using **IndexedDB**. The application is built with **React** and **Vite**.

---

## 🌟 Features

### 1. Dashboard
Provides a high-level overview of the hiring pipeline. Displays key metrics such as total jobs, total candidates, and assessments submitted.

### 2. Jobs
- **Jobs Board**: List jobs with server-like pagination and filtering by title, status, and tags.
- **Job Management**: Create, edit, and archive jobs.
- **Reordering**: Drag-and-drop interface with optimistic updates and rollback on failure.
- **Deep Linking**: Unique URL for each job (`/jobs/:jobId`).

### 3. Candidates
- **Virtualized List**: Handles 1000+ seeded candidates. Supports client-side search and filtering by stage.
- **Kanban Board**: Move candidates between stages with drag-and-drop.
- **Candidate Profile**: Shows a timeline of status changes and allows notes with `@mentions`.

### 4. Assessments
- **Assessment Builder**: Build assessments with sections and questions.
- **Live Preview**: Render assessments as fillable forms in real time.
- **Form Runtime**: Supports validation rules (required, numeric range, max length) and conditional questions.

---

## 💻 Project Structure

```
/Talentflow
├── node_modules/
├── public/
├── src/
│   ├── assets/                # Static assets like images and fonts
│   ├── components/            # Reusable components
│   │   ├── assessments/
│   │   ├── candidates/
│   │   ├── common/
│   │   ├── jobs/
│   │   └── Navbar.jsx
│   ├── pages/                 # Top-level route components
│   │   ├── assessments/
│   │   ├── candidates/
│   │   ├── dashboard/
│   │   └── jobs/
│   ├── utils/                 # Utility functions and helpers
│   ├── App.css
│   ├── App.jsx                # Main app component
│   ├── index.css
│   └── main.jsx               # Entry point
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── README.md
├── vercel.json
└── vite.config.js
```

### Technical Decisions
- **API Simulation**: **MSW** intercepts network requests to simulate a REST API for front-end development without a backend.
- **Local Persistence**: Data stored in **IndexedDB** ensures state persists after page refresh.
- **State Management**: Uses **React Context API** and **React Hooks** for centralized, easy-to-manage state.
- **Folder Structure**: "By feature" folder organization ensures maintainability and scalability.

---

## 🚀 Getting Started

### Prerequisites
- npm 

### Installation
```bash
git clone [repository-link]
cd talentflow
npm install
npm run dev
```
Access the app at `https://talent-flow-entnt-zeta.vercel.app/`.

### Seed Data
On first run, the app seeds 25 jobs, 1,000 candidates, and several assessments to test all features with realistic data.

---

## 🛠️ Tech Stack

| Technology | Icon |
|------------|------|
| React      | ![React](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg) |
| Vite       | ![Vite](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vite/vite-original.svg) |
| Tailwind CSS | ![Tailwind](https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg) |
| MSW        | ![MSW](https://raw.githubusercontent.com/mswjs/media/main/logo.png) |
| IndexedDB  | ![IndexedDB](https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/IndexedDB_logo.svg/800px-IndexedDB_logo.svg.png) |
| Lodash     | ![Lodash](https://raw.githubusercontent.com/devicons/devicon/master/icons/lodash/lodash-original.svg) |
| date-fns   | ![date-fns](https://raw.githubusercontent.com/date-fns/date-fns/master/docs/logo.svg) |

---
## 📸 Screenshots
> Replace with your actual screenshots

**Dashboard**  
![Dashboard]
<img width="1894" height="867" alt="Screenshot 2025-09-20 195750" src="https://github.com/user-attachments/assets/e1972302-5d59-4441-9126-48d1f0ea45d4" />


**Job Board**  
![Jobs]
<img width="1894" height="866" alt="Screenshot 2025-09-20 195810" src="https://github.com/user-attachments/assets/f75bd68f-2a29-4399-8c5a-c7a71722a3f0" />


**Candidates**  
![Candidates]
<img width="1895" height="873" alt="Screenshot 2025-09-20 195828" src="https://github.com/user-attachments/assets/722bba3e-47a8-48a6-b66f-0263271e2784" />


**Assessments**  
<img width="1916" height="868" alt="Screenshot 2025-09-20 195854" src="https://github.com/user-attachments/assets/fd4c5802-d65a-432f-986f-d7ca90d328da" />



## 🔮 Future Improvements
- **Backend Integration**: Replace MSW with a real REST API or GraphQL server.
- **Authentication**: Login/logout with role-based access.
- **Notifications**: Real-time candidate updates.
- **Analytics**: Charts and insights for hiring trends.
- **Mobile Optimization**: Fully responsive design.
- 
---

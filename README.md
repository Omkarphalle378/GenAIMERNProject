# 🚀 HireSmart AI — Fullstack AI Interview Strategy & Career Intelligence Platform

> **HireSmart AI** is a state-of-the-art career preparation platform that uses Artificial Intelligence to transform job descriptions and candidate resumes into actionable, role-tailored interview preparation strategies, interactive practice arenas, and recruiter outreach materials.

---

## 🌟 Key Features & Modules

### 1. 🤖 AI Interview Strategy & Report Engine
- **Resume & Job Description Analysis**: Upload PDF resumes or input self-descriptions alongside target job descriptions to analyze match scores.
- **ATS Match Score & Skill Gap Detection**: Calculates candidate match percentage and highlights missing technical skills (High / Medium / Low severity).
- **Tailored Question Bank**: Generates role-specific **Technical Questions** and **Behavioral Questions** with interviewer intent.
- **7-Day Skill Milestone Roadmap**: Formulates a day-by-day action plan to bridge candidate skill gaps before the interview.

### 2. 📄 Styled PDF Report Exporter
- **Custom PDF Exporter (`PDFKit`)**: Exports full interview strategy reports as polished PDFs.
- Includes dark banner headers, match score badges, color-coded skill gap pills, and automated page footers (`Page X of Y`).

### 3. 🎯 Interactive AI Skill Assessment Quizzes
- **Dynamic 5-Question Micro-Quizzes**: Generates targeted multiple-choice quizzes based on candidate skill gaps (*Docker*, *System Design*, *MongoDB*, *React*, *Node.js*).
- **Instant Evaluation & AI Explanations**: Computes score percentages (`80% Passed!`) and provides detailed AI explanations for every answer.

### 4. ✉️ AI Cover Letter & Recruiter Pitch Studio
- **1-Click Strategy Auto-Fill**: Auto-imports target job titles and job descriptions from candidate reports.
- **Tailored Cover Letter**: Generates a 3-paragraph persuasive cover letter with 1-click **Copy** and **Download TXT**.
- **Recruiter Cold Email Pitch**: Generates punchy outreach emails with catchy subject lines for cold messaging engineering managers and recruiters.

### 5. 🎙️ AI Interactive Mock Interview Arena
- **Timed Simulator**: Features a live timer ticker (`⏱️ 01:24`) for time management practice.
- **Instant AI Feedback Engine**: Scores candidate answers (0–100) and displays:
  - **✓ Key Strengths**: What the candidate answered well.
  - **💡 Missing Concepts**: Crucial technical points to include next time.
  - **⭐ Senior Model Answer**: Demonstration of how a staff engineer would answer the question.

### 6. 📊 Candidate Analytics & Progress Chart
- **Interactive SVG Trend Line**: Plots ATS match scores over time across historical strategy reports (`65%` → `78%` → `85%` → `92%`).
- Hover tooltips display report titles and exact match percentages.

### 7. 🎨 Dark & Light Mode Design System
- Built with Vanilla SCSS and CSS variables (`[data-theme="dark"]` and `[data-theme="light"]`).
- Seamless contrast across all pages, glassmorphism cards, and navigation panels.

---

## 🛠️ Technology Stack

| Layer | Technologies Used |
| :--- | :--- |
| **Frontend** | React 18, Vite, Vanilla SCSS, React Router DOM, Context API, Axios |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose, JWT, Cookie-Parser, Multer |
| **AI Integration** | Google Generative AI (`gemini-2.0-flash`), Ollama fallback |
| **PDF Generation** | PDFKit, PDF-Parse |

---

## 📡 REST API Reference

### Auth Routes (`/api/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new candidate account | Public |
| `POST` | `/api/auth/login` | Authenticate user & issue JWT | Public |
| `POST` | `/api/auth/logout` | Revoke session & blacklist token | Private |
| `GET` | `/api/auth/get-me` | Fetch active logged-in user profile | Private |

### Interview & AI Routes (`/api/interview`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/interview/` | Generate new interview report from resume & JD | Private |
| `GET` | `/api/interview/` | Fetch all strategy reports for logged-in user | Private |
| `GET` | `/api/interview/report/:id` | Fetch specific interview strategy report | Private |
| `POST` | `/api/interview/resume/pdf/:id` | Download generated PDF summary report | Private |
| `POST` | `/api/interview/quiz/generate` | Generate 5-question AI skill quiz | Private |
| `POST` | `/api/interview/cover-letter/generate` | Generate Cover Letter & Cold Email Pitch | Private |
| `POST` | `/api/interview/mock/evaluate` | Evaluate candidate mock answer with AI scoring | Private |

---

## 🚀 Quick Setup & Installation

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas or Local MongoDB instance
- Google Gemini API Key (`GOOGLE_GENAI_API_KEY`)

### 1. Environment Configuration
Create a `.env` file inside the `Backend` directory:
```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/hiresmart_ai
JWT_SECRET=your_super_secret_jwt_key
GOOGLE_GENAI_API_KEY=your_gemini_api_key
```

### 2. Install & Start Backend
```bash
cd Backend
npm install
npm run dev
# Server running on http://localhost:3000
```

### 3. Install & Start Frontend
```bash
cd Fronted
npm install
npm run dev
# App running on http://localhost:5173
```

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

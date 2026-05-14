# MediGuardian Phase 1: Architecture & Implementation

Phase 1 of MediGuardian has been successfully architected and built with a scalable MERN-style structure, utilizing Firebase for Authentication, Firestore, and Cloud Messaging.

## 🏗️ System Architecture

### 🛡️ Backend (`/server`)
- **Framework**: Node.js & Express.js (ES Modules)
- **Firebase Integration**: `firebase-admin` SDK for secure server-side operations.
- **Middleware**: 
  - `authMiddleware.js`: Verifies Firebase ID tokens.
  - `errorHandler.js`: Centralized error management.
- **Routing**: Modular REST API structure (`/routes`, `/controllers`).
- **Security**: `helmet`, `cors`, and `morgan` for logging.

### 🎨 Frontend (`/src`)
- **Framework**: React.js 19 + Vite.
- **Styling**: Tailwind CSS 4.0 + Shadcn-ready architecture.
- **State Management**: React Context API (`AuthContext`) for auth & user profiles.
- **Animations**: Framer Motion for premium "startup-grade" transitions.
- **Layout**: Modular design with `MainLayout` (sidebar) and protected routing.

## 📁 Directory Structure

```text
MediGuardian/
├── server/                 # Node/Express Backend
│   ├── config/             # Server configuration
│   ├── controllers/        # Route controllers (Medication CRUD)
│   ├── firebase/           # Admin SDK initialization
│   ├── middlewares/        # Auth & Error handling
│   ├── routes/             # API endpoints
│   └── server.js           # Main Entry Point
├── src/                    # React Frontend
│   ├── components/         # Reusable UI (ProtectedRoute, etc.)
│   ├── context/            # AuthContext
│   ├── hooks/              # Custom hooks (useNotifications)
│   ├── layouts/            # MainLayout with Sidebar
│   ├── pages/              # Dashboard, Login, Signup, Medication Mgmt
│   ├── services/           # Firebase Client Service
│   └── main.tsx            # App Initialization
└── package.json            # Root configuration
```

## 🚀 Key Features Implemented

1.  **Premium UI/UX**: Glassmorphism, high-contrast accessible typography (Elderly-friendly), and smooth motion.
2.  **Auth System**: Complete Signup/Login/Logout flow with role-based profiles (Patient, Doctor, Caretaker).
3.  **Medication Management**: CRUD-ready pages with advanced form logic (dynamic timings, dosage).
4.  **Notification Ready**: FCM integration with permission handling and background message support.
5.  **Dashboard**: AI-powered look & feel with adherence tracking and upcoming schedule timeline.

## 🛠️ Manual Steps for You

To fully activate the system, please complete these steps:

### 1. Backend Environment Variables
Create a `.env` file in the `server/` directory:
```env
PORT=5000
FIREBASE_PROJECT_ID=your-project-id
# JSON string of your Firebase Service Account Key
FIREBASE_SERVICE_ACCOUNT='{...}' 
```
> [!TIP]
> You can get the Service Account Key from: **Firebase Console > Project Settings > Service Accounts > Generate New Private Key**.

### 2. Frontend VAPID Key
In `src/hooks/useNotifications.ts`, replace `'YOUR_VAPID_KEY'` with the key from:
**Firebase Console > Project Settings > Cloud Messaging > Web Push certificates**.

### 3. Start the Servers
Open two terminals:

**Terminal 1 (Backend):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

## 🔮 Future Scalability
The current architecture is prepared for:
- **AI Agents**: `/api/ai` routes can be added to interact with LLMs.
- **Caregiver Escalation**: Firestore listeners in `server/services` can trigger emergency alerts.
- **Advanced Analytics**: Real-time adherence data is already structured in Firestore collections.

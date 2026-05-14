<div align="center">
  <img width="1200" alt="MediGuardian Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
  
  # 🏥 MediGuardian
  ### *Intelligent Care for Every Heartbeat.*
  
  [![Vite](https://img.shields.io/badge/Vite-6.0+-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
  [![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0+-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
  [![Firebase](https://img.shields.io/badge/Firebase-Auth/Firestore-FFCA28?logo=firebase&logoColor=white)](https://firebase.google.com/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
</div>

---

## 🌟 Overview

**MediGuardian** is a premium, AI-assisted medication adherence platform designed to bridge the gap between clinical data and emotional connection. Built with a focus on seniors, caregivers, and healthcare professionals, it leverages advanced AI to ensure medication compliance while providing a futuristic, "Apple-Health" style user experience.

## ✨ Core Features

### 🧠 AI Neural Health Engine
- **Predictive Analytics**: Analyzes intake patterns to predict potential health deviations before they occur.
- **Adaptive Reminders**: Context-aware notifications that learn from user behavior and daily routines.
- **Natural Language Log**: Log medications simply by talking to the Virtual Guardian.

### 🛡️ Clinical & Security
- **HIPAA-Compliant Architecture**: End-to-end encryption for all sensitive medical data.
- **Role-Based Access**: Dedicated dashboards for Patients, Doctors, and Caregivers with seamless data sharing.
- **Emergency Triggers**: Automated alerts to caregivers and providers if critical doses are missed.

### 🎨 Premium Experience
- **Stitch Design System**: Adheres to Google's Stitch design tokens for a cohesive, professional look.
- **High-Fidelity UI**: Glassmorphism, 3D assets, and custom Lottie animations for a "wow" factor.
- **Bento-Grid Layouts**: Modern, responsive dashboard and landing page structures.

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React, Vite, TailwindCSS v4, Framer Motion |
| **Animations** | DotLottie, Lottie-React, GSAP |
| **Backend** | Node.js, Express |
| **Database** | Firebase Firestore |
| **Auth** | Firebase Authentication |
| **Icons** | Lucide React |

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/siddharthg-7/MediGuardian.git
   cd MediGuardian
   ```

2. **Install Frontend Dependencies:**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies:**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Environment Variables:**
   Create a `.env` file in the root and `/server` directories with your Firebase and API configurations:
   ```env
   # Root .env
   VITE_FIREBASE_API_KEY=your_key
   VITE_FIREBASE_PROJECT_ID=your_id
   
   # Server .env
   FIREBASE_SERVICE_ACCOUNT_JSON=your_service_account
   ```

5. **Run the Application:**
   ```bash
   # Start frontend
   npm run dev
   
   # Start backend
   cd server
   npm start
   ```

## 📸 Screenshots

*(Add your generated images or screenshots here)*

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">
  Built with ❤️ by the MediGuardian Team
</div>

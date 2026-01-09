# 🛡️ Sentinel.ai - Industrial IoT Anomaly Detection

> **Bridging the gap between Silicon & Intelligence.**

**Live Demo:** [View Dashboard](https://projectsentinel-beryl.vercel.app/)

---

## 📸 Gallery


<img width="1919" height="1020" alt="Screenshot 2026-01-09 051854" src="https://github.com/user-attachments/assets/c745d00f-7ce4-4a15-89d8-184279f930ed" />
<br />


| **Operator Console** |



<img width="1915" height="1013" alt="Screenshot 2026-01-09 055110" src="https://github.com/user-attachments/assets/b0adabe6-fb8f-4771-aee2-fd880020894a" />

| **Developer Profile** |
<img width="1919" height="1026" alt="Screenshot 2026-01-09 051948" src="https://github.com/user-attachments/assets/91f189ab-41a7-4349-bf8f-dd1d2d31c8ac" />

---

## 💡 The Idea
Industrial machinery generates terabytes of vibration data that usually goes unnoticed until something breaks. **I wanted to build a system that listens.**

**Sentinel** is an end-to-end IoT solution that monitors machine health in real-time. Instead of sending raw noise to the cloud, it uses an **Edge AI Agent** (running on the device/laptop) to analyze vibrations locally using an LSTM Autoencoder.

* **Green Status:** The machine is vibrating normally.
* **Red Alert:** The AI detected a pattern it has never seen before (Anomaly).

This reduces latency, saves bandwidth, and provides instant visual feedback to operators via a modern React dashboard.

---

## 🛠️ Tech Stack
I built this using a full-stack approach, combining low-level hardware simulation with high-level web technologies.

### **Frontend (The Dashboard)**
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white) ![Framer Motion](https://img.shields.io/badge/Framer-Motion-black?style=for-the-badge&logo=framer&logoColor=blue)

### **Backend & Cloud**
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white) ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)

### **Edge AI & Agent**
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54) ![TensorFlow](https://img.shields.io/badge/TensorFlow-%23FF6F00.svg?style=for-the-badge&logo=TensorFlow&logoColor=white) ![Pandas](https://img.shields.io/badge/pandas-%23150458.svg?style=for-the-badge&logo=pandas&logoColor=white) ![PyInstaller](https://img.shields.io/badge/PyInstaller-Run_Standalone-blue?style=for-the-badge)

---

## 🚀 How It Works
1.  **The Agent:** A Python script (`SentinelAgent.exe`) simulates a vibration sensor. It feeds data into a trained **LSTM Autoencoder**.
2.  **The Brain:** If the "Reconstruction Error" is high, the AI flags it as an anomaly.
3.  **The Cloud:** Data is pushed instantly to **Supabase** (PostgreSQL).
4.  **The View:** The **React Dashboard** listens to database changes and updates the charts in milliseconds.

---

## 💻 Running Locally

**1. Clone the Repo**
```bash
git clone [https://github.com/Swarup6002/Project-Sentinel.git](https://github.com/Swarup6002/Project-Sentinel.git)

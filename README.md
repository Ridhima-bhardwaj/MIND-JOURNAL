# 🧠 Mind Journal — A Personal Digital Diary

![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)

## 🌐 Live Demo
👉 [https://mind-journal-seven.vercel.app/](https://mind-journal-seven.vercel.app/)

Welcome to **Mind Journal**, a minimal and intuitive journaling web app designed to help you **write your thoughts**, **track your mood**, and **reflect on your mental well-being** — all in one private, secure place.

> ✨ “Write your mind, free your soul.” ✨

---

## 🌟 Features

- ✍️ **Daily Journaling** — Write, edit, and save your personal entries securely.  
- 🔐 **Secure Authentication** — Firebase Authentication ensures your privacy.  
- 📅 **Mood Tracker** — Log your daily mood and view your emotional journey.  
- 🌓 **Dark & Light Modes** — Journal comfortably any time of day.  
- 🧭 **Distraction-Free UI** — Clean, simple interface designed for clarity and focus.  
- ☁️ **Cloud Storage** — All entries are stored safely in Firebase Firestore.

---

## 🛠️ Tech Stack

| Layer            | Technology Used                              |
|------------------|----------------------------------------------|
| Frontend         | React.js (Vite), JavaScript (ES6+), HTML5, CSS3 |
| State Management | React Hooks (useState, useEffect)            |
| Backend / DB     | Firebase Authentication, Cloud Firestore     |
| Deployment       | Vercel                                       |
---

## 📂 Project Structure

```
mind-journal/
├── public/              # Static assets
├── src/                 # App source code
│   ├── components/      # Reusable UI components
│   ├── pages/           # App pages (Home, Journal, Login, etc.)
│   ├── services/        # Firebase and utility functions
│   └── styles/         # CSS or Tailwind files
├── .env                # Environment variables (Firebase config)
├── package.json
└── README.md
```

---

## ⚡ Getting Started

Follow these steps to set up **Mind Journal** locally:

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Ridhima-Bhardwaj/mind-journal.git
cd mind-journal
```

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Configure Firebase
Create a `.env` file in the root folder and add:
```
VITE_API_KEY=your_api_key
VITE_AUTH_DOMAIN=your_auth_domain
VITE_PROJECT_ID=your_project_id
VITE_STORAGE_BUCKET=your_storage_bucket
VITE_MESSAGING_SENDER_ID=your_sender_id
VITE_APP_ID=your_app_id
```

### 4️⃣ Run the Development Server
```bash
npm run dev
```

Visit 👉 `http://localhost:5173` to view the app.

---

## 🚀 Deployment

Deploy the app using **Firebase Hosting**:
```bash
firebase login
firebase init
firebase deploy
```

Or deploy with **Vercel / Netlify** by linking your GitHub repo.

---

## 🧪 Future Enhancements

- 📊 Mood Analytics Dashboard — Visualize mood trends  
- 📝 Rich Text Editor — More expressive journaling  
- 🌐 Multi-language Support  
- 📅 Calendar View — Navigate entries quickly

---

## 🤝 Contributing

Contributions are welcome!  
1. Fork the repository 🍴  
2. Create a new branch:  
   ```bash
   git checkout -b feature-name
   ```  
3. Make your changes and commit:  
   ```bash
   git commit -m "Add new feature"
   ```  
4. Push and open a Pull Request ✅

---

## 📝 License

This project is licensed under the **MIT License**.  
You are free to use and modify it for personal or educational purposes.

---

## 👩‍💻 Author

**Ridhima Bhardwaj**  
🌐 [GitHub](https://github.com/Ridhima-Bhardwaj)

---

⭐ If you like this project, consider giving it a **star** on GitHub to support it!

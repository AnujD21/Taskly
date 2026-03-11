# 📝 Todo App — Full Stack Learning Project

A beginner-friendly full-stack web app built with **Node.js + Express** (backend) and **vanilla HTML/CSS/JS** (frontend).

## 🗂️ Project Structure

```
todo-app/
├── server.js       ← Backend server (Node.js + Express)
├── package.json    ← Project config & dependencies
├── todos.json      ← Database (stores todos as JSON)
└── public/
    ├── index.html  ← Main webpage
    ├── style.css   ← Styling
    └── app.js      ← Frontend JavaScript (talks to backend)
```

## 🚀 Run Locally

**Requirements:** [Node.js](https://nodejs.org) must be installed.

```bash
# 1. Install dependencies
npm install

# 2. Start the server
npm start

# 3. Open in your browser
# → http://localhost:3000
```

## 🌐 Deploy to Render.com (Free Hosting)

1. Push your code to a GitHub repository
2. Go to [render.com](https://render.com) → **New → Web Service**
3. Connect your GitHub repo
4. Set these settings:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Click **Deploy** — your app will be live in ~2 minutes! 🎉

## 📚 How Full Stack Works

```
Browser (Frontend)
    │
    │  fetch('/api/todos')   ← HTTP Requests
    ▼
Node.js Server (Backend)
    │
    │  fs.readFile / fs.writeFile
    ▼
todos.json (Database)
```

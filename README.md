# 📝 Todo App

A clean, full-stack task management app where you can create, complete, and delete your daily tasks — all saved persistently on the server.

## ✨ Features

- **Add tasks** — Type a task and hit Enter or click Add
- **Mark as done** — Click a task to toggle it complete/incomplete
- **Delete tasks** — Remove tasks you no longer need
- **Persistent storage** — Your todos are saved on the server, so they survive page refreshes
- **REST API backend** — The frontend communicates with a real Node.js server over HTTP

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Data Storage | JSON file (`todos.json`) |

## 📂 Project Structure

```
todo-app/
├── server.js        ← Express server & REST API
├── package.json     ← Dependencies & scripts
├── todos.json       ← Persistent data store
└── public/
    ├── index.html   ← App UI
    ├── style.css    ← Styling
    └── app.js       ← Frontend logic (fetch calls to API)
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/todos` | Fetch all todos |
| `POST` | `/api/todos` | Add a new todo |
| `PATCH` | `/api/todos/:id` | Toggle a todo's completion |
| `DELETE` | `/api/todos/:id` | Delete a todo |

## 🧠 How It Works

```
Browser (Frontend)
    │
    │  HTTP requests (fetch API)
    ▼
Node.js + Express (Backend)
    │
    │  Read / Write
    ▼
todos.json (Data Store)
```

The frontend never directly touches the data — it always goes through the API. This separation of concerns is the foundation of full-stack web development.

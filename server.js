// ============================================================
//  server.js — The BACKEND of our Full-Stack Todo App
//  This is the "brain" of the website. It:
//    1. Serves the frontend files (HTML, CSS, JS)
//    2. Handles API requests from the browser
//    3. Reads/writes data to todos.json (our database)
// ============================================================

const express = require('express');  // Web framework
const cors    = require('cors');     // Allows browser to talk to server
const fs      = require('fs');       // File system (to read/write todos.json)
const path    = require('path');     // Helps build file paths

const app  = express();
const PORT = process.env.PORT || 3000;
const DB   = path.join(__dirname, 'todos.json'); // Path to our "database"

// ─── Middleware ───────────────────────────────────────────────
// These run on EVERY request before our routes handle it
app.use(cors());                        // Allow cross-origin requests
app.use(express.json());                // Parse JSON request bodies
app.use(express.static('public'));      // Serve files from the /public folder

// ─── Helper: Read todos from file ────────────────────────────
function readTodos() {
  const data = fs.readFileSync(DB, 'utf-8');
  return JSON.parse(data);
}

// ─── Helper: Write todos to file ─────────────────────────────
function writeTodos(todos) {
  fs.writeFileSync(DB, JSON.stringify(todos, null, 2));
}

// ─── API Routes ───────────────────────────────────────────────

// GET /api/todos — Return all todos
// Example response: [{ id: 1, text: "Buy milk", done: false }, ...]
app.get('/api/todos', (req, res) => {
  const todos = readTodos();
  res.json(todos);
});

// POST /api/todos — Add a new todo
// Request body: { "text": "Buy milk" }
app.post('/api/todos', (req, res) => {
  const todos   = readTodos();
  const newTodo = {
    id:   Date.now(),          // Unique ID using current timestamp
    text: req.body.text,
    done: false
  };
  todos.push(newTodo);
  writeTodos(todos);
  res.status(201).json(newTodo); // 201 = "Created"
});

// PATCH /api/todos/:id — Toggle a todo's done status
app.patch('/api/todos/:id', (req, res) => {
  const todos = readTodos();
  const todo  = todos.find(t => t.id === Number(req.params.id));
  if (!todo) return res.status(404).json({ error: 'Todo not found' });
  todo.done = !todo.done;
  writeTodos(todos);
  res.json(todo);
});

// DELETE /api/todos/:id — Delete a todo by its ID
app.delete('/api/todos/:id', (req, res) => {
  let todos = readTodos();
  todos     = todos.filter(t => t.id !== Number(req.params.id));
  writeTodos(todos);
  res.json({ message: 'Deleted successfully' });
});

// ─── Start the server ─────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});

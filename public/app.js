// ── Taskly — app.js ──────────────────────────────────────────
// Connects the frontend to the Node.js/Express backend via fetch()

const API = '/api/todos';
let currentFilter = 'all';
let allTodos = [];

// ─── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setDate();
  loadTodos();

  document.getElementById('todoInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') addTodo();
  });
});

function setDate() {
  const now = new Date();
  const opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('headerDate').textContent = now.toLocaleDateString('en-US', opts);
}

// ─── Load todos from backend ───────────────────────────────────
async function loadTodos() {
  try {
    const res = await fetch(API);
    allTodos = await res.json();
    render();
  } catch {
    showToast('⚠️ Could not connect to server');
  }
}

// ─── Add a new todo ────────────────────────────────────────────
async function addTodo() {
  const input = document.getElementById('todoInput');
  const text = input.value.trim();
  if (!text) { shake(input); return; }

  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  if (res.ok) {
    const newTodo = await res.json();
    allTodos.push(newTodo);
    input.value = '';
    render();
    showToast('✅ Task added');
  }
}

// ─── Toggle done ───────────────────────────────────────────────
async function toggleTodo(id) {
  const res = await fetch(`${API}/${id}`, { method: 'PATCH' });
  if (res.ok) {
    const updated = await res.json();
    allTodos = allTodos.map(t => t.id === id ? updated : t);
    render();
  }
}

// ─── Delete a todo ─────────────────────────────────────────────
async function deleteTodo(id, el) {
  el.classList.add('removing');
  setTimeout(async () => {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    allTodos = allTodos.filter(t => t.id !== id);
    render();
    showToast('🗑️ Task removed');
  }, 280);
}

// ─── Clear all completed ───────────────────────────────────────
async function clearCompleted() {
  const completed = allTodos.filter(t => t.done);
  if (!completed.length) { showToast('No completed tasks to clear'); return; }
  await Promise.all(completed.map(t => fetch(`${API}/${t.id}`, { method: 'DELETE' })));
  allTodos = allTodos.filter(t => !t.done);
  render();
  showToast(`🧹 Cleared ${completed.length} task${completed.length > 1 ? 's' : ''}`);
}

// ─── Set filter ────────────────────────────────────────────────
function setFilter(filter) {
  currentFilter = filter;
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
  const titles = { all: 'All Tasks', active: 'Active', completed: 'Completed' };
  document.getElementById('filterTitle').textContent = titles[filter];
  render();
}

// ─── Render ────────────────────────────────────────────────────
function render() {
  const list = document.getElementById('todoList');
  const emptyState = document.getElementById('emptyState');

  const total     = allTodos.length;
  const doneCount = allTodos.filter(t => t.done).length;
  const activeCount = total - doneCount;

  // Update badges
  document.getElementById('allBadge').textContent = total;
  document.getElementById('activeBadge').textContent = activeCount;
  document.getElementById('completedBadge').textContent = doneCount;

  // Progress bar
  const pct = total === 0 ? 0 : Math.round((doneCount / total) * 100);
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressPct').textContent = pct + '%';

  // Filter
  const filtered = allTodos.filter(t => {
    if (currentFilter === 'active')    return !t.done;
    if (currentFilter === 'completed') return t.done;
    return true;
  });

  // Empty states
  if (filtered.length === 0) {
    list.innerHTML = '';
    emptyState.style.display = '';
    const msgs = {
      all:       ['No tasks yet', 'Add your first task above to get started.'],
      active:    ['All done! 🎉', 'You have no active tasks right now.'],
      completed: ['Nothing completed yet', 'Check off tasks to see them here.']
    };
    document.getElementById('emptyTitle').textContent = msgs[currentFilter][0];
    document.getElementById('emptySubtitle').textContent = msgs[currentFilter][1];
    return;
  }
  emptyState.style.display = 'none';

  // Build task items
  list.innerHTML = filtered.map(todo => `
    <li class="task-item" id="item-${todo.id}">
      <div
        class="task-check ${todo.done ? 'checked' : ''}"
        onclick="toggleTodo(${todo.id})"
        title="${todo.done ? 'Mark as active' : 'Mark as complete'}"
      ></div>
      <span class="task-text ${todo.done ? 'done' : ''}">${escHtml(todo.text)}</span>
      <button
        class="delete-btn"
        onclick="deleteTodo(${todo.id}, document.getElementById('item-${todo.id}'))"
        title="Delete task"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
      </button>
    </li>
  `).join('');
}

// ─── Helpers ───────────────────────────────────────────────────
function escHtml(text) {
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(text));
  return d.innerHTML;
}

function shake(el) {
  el.style.animation = 'none';
  el.offsetHeight; // reflow
  el.style.animation = 'shake 0.35s ease';
  el.addEventListener('animationend', () => el.style.animation = '', { once: true });
}

let toastTimer;
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2500);
}

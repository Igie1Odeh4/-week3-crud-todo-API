const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const app = express();
app.use(express.json());

const { body, validationResult } = require('express-validator');

let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false },
];

// ✅ Validation middleware
const validateTodo = [
  body('task').isString().notEmpty().withMessage('Task is required'),
];

// GET all
app.get('/todos', (req, res) => {
  res.json(todos);
});

// ✅ ACTIVE FIRST
app.get('/todos/active', (req, res) => {
  const active = todos.filter(t => !t.completed);
  res.json(active);
});

// GET by ID
app.get('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  res.json(todo);
});

// ✅ SINGLE POST (with validation)
app.post('/todos', validateTodo, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const newTodo = {
    id: Date.now(),
    task: req.body.task,
    completed: false
  };

  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PATCH with validation
app.patch('/todos/:id', (req, res) => {
  const todo = todos.find(t => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ message: 'Todo not found' });

  const { task, completed } = req.body;

  if (task !== undefined && typeof task !== 'string') {
    return res.status(400).json({ error: 'Task must be string' });
  }

  if (completed !== undefined && typeof completed !== 'boolean') {
    return res.status(400).json({ error: 'Completed must be boolean' });
  }

  if (task !== undefined) todo.task = task;
  if (completed !== undefined) todo.completed = completed;

  res.json(todo);
});

// DELETE Remove
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = todos.length;
  todos = todos.filter((t) => t.id !== id); // Array.filter() – non-destructive
  if (todos.length === initialLength)
    return res.status(404).json({ error: 'Not found' });
  res.status(204).send(); // Silent success
});

app.get('/todos/active', (req, res) => {
  const active = todos.filter((t) => !t.completed);
  res.json(active); // Custom Read!
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Server error!' });
});

const PORT = 3002;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));

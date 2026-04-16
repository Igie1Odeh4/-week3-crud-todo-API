const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const errorhandler = require('./middlewares/errorHandler.js');

const validateTodo = require('./middlewares/validator.js');


const app = express();
const logRequest = require('./middlewares/logger.js');



app.use(express.json());

const corsOptions = {
  origin: [
    "http://127.0.0.1:5500",
    "http://localhost:5500"
  ]
};
app.use(cors(corsOptions));

app.use(logRequest);

let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false },
];



/* GET all */
app.get('/', (req, res) => {
  res.send('Todo API is running...');
});


app.get('/todos', (req, res, next) => {
  res.json(todos);
});

/* GET active */
app.get('/todos/:id', (req, res, next) => {

  try {

    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "Invalid ID"
      });
    }

    const todo = todos.find(t => t.id === id);

    if (!todo) {
      return res.status(404).json({
        message: 'Todo not found'
      });
    }

    res.json(todo);

  } catch (err) {
    next(err);
  }

});

/* POST */
app.post('/todos', validateTodo, (req, res, next) => {
  try {

  const newTodo = {
    id: Date.now(),
    task: req.body.task,
    completed: req.body.completed || false
  };

  todos.push(newTodo);

  res.status(201).json({
    message: 'Todo created successfully',
    data: newTodo
  });

} catch (err) {
  next(err);
}
});



/* PATCH */
app.patch('/todos/:id', validateTodo, (req, res, next) => {

  try {

  const id = Number(req.params.id);

  const todo = todos.find(t => t.id === id);

  if (!todo)
    return res.status(404).json({
      message: 'Todo not found'
    });
  
  const { task, completed } = req.body;

  if (task !== undefined)
    todo.task = task;

  if (completed !== undefined)
    todo.completed = completed;

 return res.json({
      message: "Todo updated successfully",
      data: todo
    });

  } catch (err) {
    next(err);
  }

});

/* DELETE */
app.delete('/todos/:id', (req, res, next) => {

  try {
  const id = Number(req.params.id);

  const initialLength = todos.length;

  todos = todos.filter(t => t.id !== id);

  if (todos.length === initialLength)
    return res.status(404).json({
      error: 'Not found'
    });
  
  res.status(204).send();

}
 catch (err) {
    next(err);
  }
});

app.get('/completed', (req, res, next) => {
  try {
  const completedTodos = todos.filter(t => t.completed === true);
  res.json(completedTodos);
} catch (err) {
  next(err);
}

});

app.use(errorhandler);

const PORT = process.env.PORT || 3002;

app.listen(PORT, () =>
  console.log(`Server on port ${PORT}`)
);
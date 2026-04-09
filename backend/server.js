const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

// In-memory storage (Trade-off for 1-2 hour scope) [cite: 3, 31, 33]
let tasks = [];

// GET /tasks - Return all tasks [cite: 23]
app.get('/tasks', (req, res) => {
    res.json(tasks);
});

// POST /tasks - Create a new task [cite: 23]
app.post('/tasks', (req, res) => {
    const { title } = req.body;
    // Basic validation 
    if (!title || title.trim() === "") {
        return res.status(400).json({ error: "Title is required" });
    }

    const newTask = {
        id: uuidv4(), // Unique identifier [cite: 25]
        title: title.trim(), // Task title [cite: 25]
        completed: false, // Boolean status [cite: 27]
        createdAt: new Date().toISOString() // Timestamp [cite: 27]
    };
    tasks.push(newTask);
    res.status(201).json(newTask);
});

// PATCH /tasks/:id - Update task status [cite: 23]
app.patch('/tasks/:id', (req, res) => {
    const task = tasks.find(t => t.id === req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    task.completed = !task.completed; // Toggle status [cite: 14]
    res.json(task);
});

// DELETE /tasks/:id - Delete a task [cite: 23]
app.delete('/tasks/:id', (req, res) => {
    tasks = tasks.filter(t => t.id !== req.params.id); // Allow task to be deleted [cite: 15]
    res.json({ message: "Task deleted" });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
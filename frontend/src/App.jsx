import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:5000/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError("Failed to load tasks. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      if (res.ok) {
        setTitle('');
        fetchTasks();
      }
    } catch (err) {
      setError("Could not add task.");
    }
  };

  const toggleTask = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'PATCH' });
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchTasks();
  };

  return (
  <div className="min-h-screen bg-gray-50 p-8">
    <div className="max-w-md mx-auto bg-white rounded-xl shadow p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">Task Manager</h1>
      
      {/* 1. Add Task Form */}
      <form onSubmit={addTask} className="flex gap-2 mb-6">
        <input 
          className="flex-1 border p-2 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Add</button>
      </form>

      {/* 2. User Feedback States */}
      {loading && <p className="text-gray-500 mb-4">Loading...</p>}
      {error && <p className="text-red-500 mb-4 text-sm">{error}</p>}

      {/* 3. Filter Buttons (Bonus Feature) */}
      <div className="flex justify-center gap-2 mb-6 border-t pt-4">
        {['all', 'pending', 'completed'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-3 py-1 rounded-full text-xs capitalize transition ${
              filter === type ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* 4. SINGLE Filtered Task List */}
      <ul className="space-y-3">
        {tasks
          .filter(task => {
            if (filter === 'pending') return !task.completed;
            if (filter === 'completed') return task.completed;
            return true;
          })
          .map(task => (
            <li key={task.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition">
              <div className="flex items-center gap-3">
                <input 
                  type="checkbox" 
                  checked={task.completed} 
                  onChange={() => toggleTask(task.id)} 
                  className="w-5 h-5 cursor-pointer"
                />
                <span className={task.completed ? "line-through text-gray-400" : "text-gray-700 font-medium"}>
                  {task.title}
                </span>
              </div>
              <button 
                onClick={() => deleteTask(task.id)} 
                className="text-red-500 hover:text-red-700 text-sm font-medium"
              >
                Delete
              </button>
            </li>
          ))}
      </ul>
      
      {/* Show empty state message if no tasks match the filter */}
      {tasks.length > 0 && tasks.filter(t => filter === 'all' || (filter === 'completed' ? t.completed : !t.completed)).length === 0 && (
        <p className="text-center text-gray-400 text-sm mt-4">No {filter} tasks found.</p>
      )}
    </div>
  </div>
);
}

export default App;
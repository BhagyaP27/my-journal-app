import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Save } from 'lucide-react';

function App() {
  // Existing journal state
  const [entries, setEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState({ 
    id: null, 
    title: '', 
    content: '', 
    date: '' 
  });
  const [view, setView] = useState('write');

  // NEW: Add task state
  const [tasks, setTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState({
    id: null,
    title: '',
    description: '',
    completed: false,
    priority: 'medium',
    dueDate: '',
    createdAt: ''
  });
  const [mode, setMode] = useState('journal'); // 'journal' or 'tasks'

  // Load entries and tasks when app first loads
  useEffect(() => {
    // Load journal entries
    const savedEntries = localStorage.getItem('journalEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }

    // Load tasks
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
  }, []);

  // Function to save a journal entry
  const saveEntry = () => {
    // Validation: make sure title and content aren't empty
    if (!currentEntry.title.trim() || !currentEntry.content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    // Create the entry object
    const entry = {
      id: currentEntry.id || Date.now().toString(),
      title: currentEntry.title,
      content: currentEntry.content,
      date: currentEntry.date || new Date().toISOString()
    };

    // Update the entries array
    let updatedEntries;
    if (currentEntry.id) {
      updatedEntries = entries.map(e => e.id === entry.id ? entry : e);
    } else {
      updatedEntries = [...entries, entry];
    }

    // Sort by date (newest first)
    updatedEntries.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Save to localStorage
    localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));

    // Update state
    setEntries(updatedEntries);
    
    // Clear the form
    setCurrentEntry({ id: null, title: '', content: '', date: '' });
    
    // Switch to list view
    setView('list');
  };

  // Function to save a task
  const saveTask = () => {
    // Validation
    if (!currentTask.title.trim()) {
      alert('Please fill in the task title');
      return;
    }

    // Create the task object
    const task = {
      id: currentTask.id || Date.now().toString(),
      title: currentTask.title,
      description: currentTask.description,
      completed: currentTask.completed,
      priority: currentTask.priority,
      dueDate: currentTask.dueDate,
      createdAt: currentTask.createdAt || new Date().toISOString()
    };

    // Update tasks array
    let updatedTasks;
    if (currentTask.id) {
      // Editing existing task
      updatedTasks = tasks.map(t => t.id === task.id ? task : t);
    } else {
      // Adding new task
      updatedTasks = [...tasks, task];
    }

    // Sort by creation date (newest first)
    updatedTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Save to localStorage
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));

    // Update state
    setTasks(updatedTasks);

    // Clear form
    setCurrentTask({
      id: null,
      title: '',
      description: '',
      completed: false,
      priority: 'medium',
      dueDate: '',
      createdAt: ''
    });

    // Switch to task list view
    setView('list');
  };

  // Function to toggle task completion
  const toggleTaskComplete = (taskId) => {
    const updatedTasks = tasks.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };

  // Function to delete a task
  const deleteTask = (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    localStorage.setItem('tasks', JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-emerald-400" />
              <h1 className="text-3xl font-bold text-white">
                {mode === 'journal' ? 'My Journal' : 'My Tasks'}
              </h1>
            </div>
            <button 
              onClick={() => {
                if (mode === 'journal') {
                  setCurrentEntry({ id: null, title: '', content: '', date: '' });
                } else {
                  setCurrentTask({
                    id: null,
                    title: '',
                    description: '',
                    completed: false,
                    priority: 'medium',
                    dueDate: '',
                    createdAt: ''
                  });
                }
                setView('write');
              }}
              className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-500 transition-all shadow-lg hover:shadow-emerald-500/50"
            >
              <Plus className="w-5 h-5" />
              {mode === 'journal' ? 'New Entry' : 'New Task'}
            </button>
          </div>

          {/* Mode Switcher */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setMode('journal')}
              className={`flex-1 py-2 rounded-lg transition-all ${
                mode === 'journal'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              📔 Journal
            </button>
            <button
              onClick={() => setMode('tasks')}
              className={`flex-1 py-2 rounded-lg transition-all ${
                mode === 'tasks'
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              ✓ Tasks
            </button>
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setView('write')}
              className={`flex-1 py-2 rounded-lg transition-all ${
                view === 'write'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {mode === 'journal' ? 'Write' : 'Add Task'}
            </button>
            <button
              onClick={() => setView('list')}
              className={`flex-1 py-2 rounded-lg transition-all ${
                view === 'list'
                  ? 'bg-emerald-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {mode === 'journal' ? `Entries (${entries.length})` : `Tasks (${tasks.length})`}
            </button>
          </div>
        </div>

        {/* JOURNAL MODE */}
        {mode === 'journal' && (
          <>
            {/* Write View */}
            {view === 'write' && (
              <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-6">
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-gray-400 mb-4">
                    <span className="text-sm">
                      {new Date(currentEntry.date || Date.now()).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={currentEntry.title}
                    onChange={(e) => setCurrentEntry({ ...currentEntry, title: e.target.value })}
                    placeholder="Entry title..."
                    className="w-full text-2xl font-bold bg-transparent border-none outline-none mb-4 text-white placeholder-gray-500"
                  />
                  <div className="w-full h-px bg-gradient-to-r from-emerald-500/0 via-emerald-500/50 to-emerald-500/0 mb-4"></div>
                  <textarea
                    value={currentEntry.content}
                    onChange={(e) => setCurrentEntry({ ...currentEntry, content: e.target.value })}
                    placeholder="What's on your mind today?"
                    className="w-full h-96 bg-transparent border-none outline-none resize-none text-gray-300 placeholder-gray-600 leading-relaxed"
                  />
                </div>
                <button 
                  onClick={saveEntry}
                  className="flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-500 transition-all shadow-lg hover:shadow-emerald-500/50"
                >
                  <Save className="w-5 h-5" />
                  Save Entry
                </button>
              </div>
            )}

            {/* List View */}
            {view === 'list' && (
              <div>
                {entries.length === 0 ? (
                  <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-12 text-center">
                    <BookOpen className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">
                      No journal entries yet. Start writing!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {entries.map((entry) => (
                      <div
                        key={entry.id}
                        className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-6 hover:shadow-emerald-500/20 hover:border-emerald-500/50 transition-all cursor-pointer group"
                      >
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                          {entry.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-3">
                          {new Date(entry.date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                        <p className="text-gray-400 leading-relaxed">
                          {entry.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* TASKS MODE - We'll add this next */}
        {mode === 'tasks' && (
          <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-12 text-center">
            <p className="text-gray-400 text-lg">
              Task next
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
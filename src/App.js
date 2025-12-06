import React, { useState, useEffect } from 'react';
import { BookOpen, Plus, Save } from 'lucide-react';

// Storage abstraction - works in both web and Electron
const storage = {
  getItem: async (key) => {
    if (window.electronStore) {
      return await window.electronStore.get(key);
    }
    return localStorage.getItem(key);
  },
  setItem: async (key, value) => {
    if (window.electronStore) {
      await window.electronStore.set(key, value);
    } else {
      localStorage.setItem(key, value);
    }
  }
};

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

  // Task state
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
  const [mode, setMode] = useState('journal');
  const [isLoading, setIsLoading] = useState(true);

  // Load entries and tasks when app first loads
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load journal entries
        const savedEntries = await storage.getItem('journalEntries');
        if (savedEntries) {
          setEntries(JSON.parse(savedEntries));
        }

        // Load tasks
        const savedTasks = await storage.getItem('tasks');
        if (savedTasks) {
          setTasks(JSON.parse(savedTasks));
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Function to save a journal entry
  const saveEntry = async () => {
    if (!currentEntry.title.trim() || !currentEntry.content.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    const entry = {
      id: currentEntry.id || Date.now().toString(),
      title: currentEntry.title,
      content: currentEntry.content,
      date: currentEntry.date || new Date().toISOString()
    };

    let updatedEntries;
    if (currentEntry.id) {
      updatedEntries = entries.map(e => e.id === entry.id ? entry : e);
    } else {
      updatedEntries = [...entries, entry];
    }

    updatedEntries.sort((a, b) => new Date(b.date) - new Date(a.date));

    await storage.setItem('journalEntries', JSON.stringify(updatedEntries));
    setEntries(updatedEntries);
    setCurrentEntry({ id: null, title: '', content: '', date: '' });
    setView('list');
  };

  // Function to delete a journal entry
  const deleteEntry = async (entryId) => {
    if (!window.confirm('Are you sure you want to delete this journal entry?')) return;
    
    const updatedEntries = entries.filter(e => e.id !== entryId);
    await storage.setItem('journalEntries', JSON.stringify(updatedEntries));
    setEntries(updatedEntries);
    
    if (currentEntry.id === entryId) {
      setCurrentEntry({ id: null, title: '', content: '', date: '' });
    }
  };

  // Function to edit a journal entry
  const editEntry = (entry) => {
    setCurrentEntry(entry);
    setView('write');
  };

  // Function to save a task
  const saveTask = async () => {
    if (!currentTask.title.trim()) {
      alert('Please fill in the task title');
      return;
    }

    const task = {
      id: currentTask.id || Date.now().toString(),
      title: currentTask.title,
      description: currentTask.description,
      completed: currentTask.completed,
      priority: currentTask.priority,
      dueDate: currentTask.dueDate,
      createdAt: currentTask.createdAt || new Date().toISOString()
    };

    let updatedTasks;
    if (currentTask.id) {
      updatedTasks = tasks.map(t => t.id === task.id ? task : t);
    } else {
      updatedTasks = [...tasks, task];
    }

    updatedTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    await storage.setItem('tasks', JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
    setCurrentTask({
      id: null,
      title: '',
      description: '',
      completed: false,
      priority: 'medium',
      dueDate: '',
      createdAt: ''
    });
    setView('list');
  };

  // Function to toggle task completion
  const toggleTaskComplete = async (taskId) => {
    const updatedTasks = tasks.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    );
    await storage.setItem('tasks', JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };

  // Function to delete a task
  const deleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    await storage.setItem('tasks', JSON.stringify(updatedTasks));
    setTasks(updatedTasks);
  };

  // Function to edit a task
  const editTask = (task) => {
    setCurrentTask(task);
    setView('write');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <BookOpen className={`w-8 h-8 ${mode === 'journal' ? 'text-emerald-400' : 'text-red-400'}`} />
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
              className={`flex items-center gap-2 ${
                mode === 'journal' 
                  ? 'bg-emerald-600 hover:bg-emerald-500 hover:shadow-emerald-500/50' 
                  : 'bg-red-600 hover:bg-red-500 hover:shadow-red-500/50'
              } text-white px-4 py-2 rounded-lg transition-all shadow-lg`}
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
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              📔 Journal
            </button>
            <button
              onClick={() => setMode('tasks')}
              className={`flex-1 py-2 rounded-lg transition-all ${
                mode === 'tasks'
                  ? 'bg-red-600 text-white shadow-lg shadow-red-500/30'
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
                  ? mode === 'journal'
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'bg-red-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {mode === 'journal' ? 'Write' : 'Add Task'}
            </button>
            <button
              onClick={() => setView('list')}
              className={`flex-1 py-2 rounded-lg transition-all ${
                view === 'list'
                  ? mode === 'journal'
                    ? 'bg-emerald-600 text-white shadow-lg'
                    : 'bg-red-600 text-white shadow-lg'
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
                        className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-6 hover:shadow-emerald-500/20 hover:border-emerald-500/50 transition-all group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                            {entry.title}
                          </h3>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => editEntry(entry)}
                              className="text-emerald-500 hover:text-emerald-400 px-3 py-1 rounded-lg hover:bg-emerald-500/10 transition-colors text-sm"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => deleteEntry(entry.id)}
                              className="text-red-500 hover:text-red-400 px-3 py-1 rounded-lg hover:bg-red-500/10 transition-colors text-sm"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                        
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

        {/* TASKS MODE */}
        {mode === 'tasks' && (
          <>
            {/* Add/Edit Task View */}
            {view === 'write' && (
              <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-6">
                <div className="mb-6">
                  <input
                    type="text"
                    value={currentTask.title}
                    onChange={(e) => setCurrentTask({ ...currentTask, title: e.target.value })}
                    placeholder="Task title..."
                    className="w-full text-2xl font-bold bg-transparent border-none outline-none mb-4 text-white placeholder-gray-500"
                  />
                  <div className="w-full h-px bg-gradient-to-r from-red-500/0 via-red-500/50 to-red-500/0 mb-6"></div>
                  
                  <textarea
                    value={currentTask.description}
                    onChange={(e) => setCurrentTask({ ...currentTask, description: e.target.value })}
                    placeholder="Task description (optional)..."
                    className="w-full h-32 bg-transparent border-none outline-none resize-none text-gray-300 placeholder-gray-600 leading-relaxed mb-6"
                  />

                  {/* Priority Selector */}
                  <div className="mb-4">
                    <label className="block text-gray-400 text-sm mb-2">Priority</label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentTask({ ...currentTask, priority: 'high' })}
                        className={`flex-1 py-2 rounded-lg transition-all ${
                          currentTask.priority === 'high'
                            ? 'bg-red-600 text-white shadow-lg'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        🔴 High
                      </button>
                      <button
                        onClick={() => setCurrentTask({ ...currentTask, priority: 'medium' })}
                        className={`flex-1 py-2 rounded-lg transition-all ${
                          currentTask.priority === 'medium'
                            ? 'bg-orange-600 text-white shadow-lg'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        🟠 Medium
                      </button>
                      <button
                        onClick={() => setCurrentTask({ ...currentTask, priority: 'low' })}
                        className={`flex-1 py-2 rounded-lg transition-all ${
                          currentTask.priority === 'low'
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        🔵 Low
                      </button>
                    </div>
                  </div>

                  {/* Due Date */}
                  <div className="mb-6">
                    <label className="block text-gray-400 text-sm mb-2">Due Date (optional)</label>
                    <input
                      type="date"
                      value={currentTask.dueDate}
                      onChange={(e) => setCurrentTask({ ...currentTask, dueDate: e.target.value })}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white outline-none focus:border-red-500 transition-colors"
                    />
                  </div>
                </div>

                <button 
                  onClick={saveTask}
                  className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-500 transition-all shadow-lg hover:shadow-red-500/50"
                >
                  <Save className="w-5 h-5" />
                  Save Task
                </button>
              </div>
            )}

            {/* Task List View */}
            {view === 'list' && (
              <div>
                {tasks.length === 0 ? (
                  <div className="bg-gray-800 border border-gray-700 rounded-2xl shadow-2xl p-12 text-center">
                    <div className="text-6xl mb-4">✓</div>
                    <p className="text-gray-400 text-lg">
                      No tasks yet. Start adding some!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`bg-gray-800 border rounded-2xl shadow-2xl p-6 transition-all ${
                          task.completed 
                            ? 'border-gray-600 opacity-60' 
                            : 'border-gray-700 hover:shadow-red-500/20 hover:border-red-500/50'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <button
                            onClick={() => toggleTaskComplete(task.id)}
                            className={`mt-1 w-6 h-6 rounded border-2 flex items-center justify-center transition-all ${
                              task.completed
                                ? 'bg-red-600 border-red-600'
                                : 'border-gray-500 hover:border-red-500'
                            }`}
                          >
                            {task.completed && <span className="text-white text-sm">✓</span>}
                          </button>

                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className={`text-xl font-bold ${
                                task.completed ? 'text-gray-500 line-through' : 'text-white'
                              }`}>
                                {task.title}
                              </h3>
                              
                              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                task.priority === 'high' ? 'bg-red-600/20 text-red-400' :
                                task.priority === 'medium' ? 'bg-orange-600/20 text-orange-400' :
                                'bg-blue-600/20 text-blue-400'
                              }`}>
                                {task.priority === 'high' ? '🔴 High' :
                                 task.priority === 'medium' ? '🟠 Medium' :
                                 '🔵 Low'}
                              </span>
                            </div>

                            {task.description && (
                              <p className={`mb-3 ${
                                task.completed ? 'text-gray-600' : 'text-gray-400'
                              }`}>
                                {task.description}
                              </p>
                            )}

                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              {task.dueDate && (
                                <span>📅 Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                              )}
                              <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2">
                            <button
                              onClick={() => editTask(task)}
                              className="text-orange-500 hover:text-orange-400 transition-colors text-sm"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => deleteTask(task.id)}
                              className="text-red-500 hover:text-red-400 transition-colors text-sm"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}

export default App;
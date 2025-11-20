import React, { useState } from 'react';
import { BookOpen, Plus } from 'lucide-react';

function App() {
  // State: Think of these as variables that React watches for changes
  const [entries, setEntries] = useState([]); // Array to hold all journal entries
  const [currentEntry, setCurrentEntry] = useState({ 
    id: null, 
    title: '', 
    content: '', 
    date: '' 
  }); // The entry being written/edited right now
  const [view, setView] = useState('write'); // Are we in 'write' mode or 'list' mode?

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-amber-600" />
              <h1 className="text-3xl font-bold text-gray-800">My Journal</h1>
            </div>
            <button className="flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700">
              <Plus className="w-5 h-5" />
              New Entry
            </button>
          </div>

          {/* Navigation buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setView('write')}
              className={`flex-1 py-2 rounded-lg transition-colors ${
                view === 'write'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Write
            </button>
            <button
              onClick={() => setView('list')}
              className={`flex-1 py-2 rounded-lg transition-colors ${
                view === 'list'
                  ? 'bg-amber-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Entries ({entries.length})
            </button>
          </div>
        </div>

        {/* We'll add the write and list views here next */}
        {view === 'write' &&(
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <input
              type="text"
              value={currentEntry.title}
              onChnage={{e} => setCurrentEntry({ ...currentEntry, title: e.target.value })}
              placeholder="Entry Title"
              className="w-full text-2xl font-bold mb-4 p-2 border-b border-gray-300 focus:outline-none"
            />
            <textarea
              value={currentEntry.content}
              onChange={e => setCurrentEntry({ ...currentEntry, content: e.target.value })}
              placeholder="Write your thoughts for today"
              classBane="w-full h-64 p-2 border border-gray-300 rounded-lg focus:outline-none"
            />
            <button className="flex items-center gap-2 bg-green-600 text-white px-6py-3 rounded-lg hover:bg-green-700 mt-4">
              Save entry
            </button>
      </div>
        )};
    </div>
    );
  }
}

export default App;
import React, { useState, useEffect } from 'react';
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

  // Load entries when app first loads
  React.useEffect(() => {
    const savedEntries = localStorage.getItem('journalEntries');
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries));
    }
  }, []); // The empty [] means "only run this once when app loads"

  //functions to save an entry
  const saveEntry = () => {
    //validation
    if(!currentEntry.title.trim() || !currentEntry.content.trim()) {
      alert("Title and content cannot be empty!");
      return;
    }

    //create the entry object
    const entry ={
      id: currentEntry.id || Date.now().toString(), // use existing id or create a new one
      title: currentEntry.title,
      content: currentEntry.content,
      date: currentEntry.date || new Date().toISOString(),
    };

    //update entries array
    let updatedEntries;
    if(currentEntry.id) {
      //editing existing entry
      updatedEntries = entries.map(e => e.id === entry.id ? entry : e);
    } else {
      //adding new entry
      updatedEntries = [... entries, entry];
    }

    // Sort by date(newest first)
    updatedEntries.sort((a,b) => new Date(b.date) - new Date(a.date));
    //save to localstotage (IMPORTANT)
    localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));
    //update state
    setEntries (updatedEntries);
    //clear current entry
    setCurrentEntry({ id: null, title: '', content: '', date: '' });
    //switch to list view
    setView('list');
  };


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

        {/* Write View - only shows when view === 'write' */}
        {view === 'write' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <input
              type="text"
              value={currentEntry.title}
              onChange={(e) => setCurrentEntry({ ...currentEntry, title: e.target.value })}
              placeholder="Entry title..."
              className="w-full text-2xl font-bold border-none outline-none mb-4 text-gray-800 placeholder-gray-400"
            />
            <textarea
              value={currentEntry.content}
              onChange={(e) => setCurrentEntry({ ...currentEntry, content: e.target.value })}
              placeholder="What's on your mind today?"
              className="w-full h-96 border-none outline-none resize-none text-gray-700 placeholder-gray-400 leading-relaxed"
            />
            <button 
              onClick={saveEntry}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 mt-4">
              Save Entry
            </button>
          </div>
        )}
        {/* List View - only shows when view === 'list' */}
        {view === 'list' && (
          <div>
            {entries.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">
                  No journal entries yet. Start writing!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                  >
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
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
                    <p className="text-gray-600">
                      {entry.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
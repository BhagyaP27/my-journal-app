import React, { useState } from 'react';
import { BookOpen, Plus} from 'lucide-react';

function App() {

  //State: variables that react watches for changes
  const [entries, setEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState({
    id: null,
    title: '',
    content: '',
    date: '',
  }); //the entry being written or edited right now
  const [view, setView] = useState('write'); // Are we in write or list mode


  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="max-w-6xl mx-auto p-6">
        {/*Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-amber-600" />
            <h1 className="text-3xl font-bold text-gray-800">My Journal</h1>
          </div>
          <button className="flex items-center gap-2 mt-4 px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600">
            <Plus className="w-5 h-5" />
           New Entry
          </button>
        </div>

        {/* Navigation buttons */}
      </div>
    </div>
  );
}

export default App;
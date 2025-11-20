import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="max-w-6xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-amber-600" />
            <h1 className="text-3xl font-bold text-gray-800">My Journal</h1>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
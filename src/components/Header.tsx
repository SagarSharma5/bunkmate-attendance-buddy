import React from 'react';

interface HeaderProps {
  onAddSubject: () => void;
}

export function Header({ onAddSubject }: HeaderProps) {
  return (
    <header className="w-full bg-black border-b border-gray-800 pt-6 pb-4">
      <div className="container px-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">BM</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">BunkMate</h1>
          </div>
          <button
            onClick={onAddSubject}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center sm:justify-start sm:space-x-2"
          >
            <span className="text-lg">+</span>
            <span className="hidden sm:inline">Add Subject</span>
          </button>
        </div>
      </div>
    </header>
  );
}

import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">LinguistAI</span>
        </div>
        <nav className="hidden md:flex space-x-8">
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">Dashboard</a>
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">Style Guide</a>
          <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition">Support</a>
        </nav>
        <button className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold hover:bg-indigo-100 transition">
          Upgrade to Pro
        </button>
      </div>
    </header>
  );
};

export default Header;

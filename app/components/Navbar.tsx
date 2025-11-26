'use client';

import { Bell, Search, User, Settings } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [searchFocus, setSearchFocus] = useState(false);

  return (
    <nav className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-xl">
          <div
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-100 transition-all duration-300 ${
              searchFocus
                ? 'ring-2 ring-indigo-500 bg-white shadow-md'
                : 'hover:bg-slate-200'
            }`}
          >
            <Search
              size={20}
              className={`transition-colors duration-300 ${
                searchFocus ? 'text-indigo-600' : 'text-slate-400'
              }`}
            />
            <input
              type="text"
              placeholder="Search..."
              onFocus={() => setSearchFocus(true)}
              onBlur={() => setSearchFocus(false)}
              className="flex-1 bg-transparent outline-none text-slate-700 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 ml-6">
          {/* Notifications */}
          <button className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition-all duration-300 group">
            <Bell size={20} className="group-hover:animate-pulse" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse" />
          </button>

          {/* Settings */}
          <button className="p-2.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition-all duration-300 group">
            <Settings size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          </button>

          {/* User Profile */}
          <button className="flex items-center gap-3 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-300 group">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
              <User size={18} />
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-semibold">Admin User</p>
              <p className="text-xs opacity-80">Administrator</p>
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
}

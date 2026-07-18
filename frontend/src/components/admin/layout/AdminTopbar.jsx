'use client';

import React from 'react';
import { Menu, Search, Bell, User } from 'lucide-react';

export function AdminTopbar({ toggleSidebar, isCollapsed }) {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <Menu size={20} />
        </button>
        
        {/* Global Admin Search Placeholder */}
        <div className="hidden md:flex max-w-md w-full relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search products, orders, customers (Ctrl+K)" 
            className="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-lg text-sm focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        <button className="p-2 rounded-lg hover:bg-gray-100 text-gray-600 relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block"></div>
        
        <button className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
            A
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-semibold text-gray-900 leading-tight">Admin User</p>
            <p className="text-xs text-gray-500 leading-tight">Super Admin</p>
          </div>
        </button>
      </div>
    </header>
  );
}

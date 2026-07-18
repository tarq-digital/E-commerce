'use client';

import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '../../components/admin/layout/AdminSidebar';
import { AdminTopbar } from '../../components/admin/layout/AdminTopbar';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AdminLayout({ children }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const { user, loading } = useAuth();
  const router = useRouter();

  // Layout Persistence Strategy
  useEffect(() => {
    setIsMounted(true);
    const savedState = localStorage.getItem('weebster_admin_sidebar_collapsed');
    if (savedState !== null) {
      setIsCollapsed(savedState === 'true');
    }
  }, []);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'ADMIN')) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem('weebster_admin_sidebar_collapsed', String(newState));
  };

  // Prevent hydration mismatch on the sidebar class
  if (!isMounted || loading) return null;
  if (!user || user.role !== 'ADMIN') return null;

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <AdminSidebar isCollapsed={isCollapsed} />
      
      <div 
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          isCollapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        <AdminTopbar toggleSidebar={toggleSidebar} isCollapsed={isCollapsed} />
        
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}

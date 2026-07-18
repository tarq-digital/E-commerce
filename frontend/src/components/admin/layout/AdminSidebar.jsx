'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Users, 
  Settings,
  Tags,
  Image as ImageIcon,
  LogOut
} from 'lucide-react';
import { deleteCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';

export function AdminSidebar({ isCollapsed }) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Categories', href: '/admin/categories', icon: Tags },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Media', href: '/admin/media', icon: ImageIcon },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    deleteCookie('token');
    deleteCookie('user');
    router.push('/login');
  };

  return (
    <aside 
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-gray-900 text-white border-r border-gray-800 ${
        isCollapsed ? 'w-20' : 'w-64'
      } flex flex-col`}
    >
      <div className="h-16 flex items-center justify-center border-b border-gray-800 shrink-0">
        <Link href="/admin" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">W</div>
          {!isCollapsed && <span>Weebster</span>}
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-4 scrollbar-thin">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            
            return (
              <li key={item.name}>
                <Link 
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-primary text-white' 
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                  title={isCollapsed ? item.name : undefined}
                >
                  <Icon size={20} className="shrink-0" />
                  {!isCollapsed && <span className="font-medium text-sm">{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="p-4 border-t border-gray-800 shrink-0">
        <button 
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full px-3 py-2.5 text-gray-400 hover:bg-gray-800 hover:text-white rounded-lg transition-colors ${isCollapsed ? 'justify-center' : ''}`}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut size={20} className="shrink-0" />
          {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
        </button>
      </div>
    </aside>
  );
}

'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { Package, User, MapPin, Heart, LogOut } from 'lucide-react';

export default function AccountLayout({ children }) {
    const pathname = usePathname();
    const router = useRouter();
    const { logout, user, loading } = useAuth();
    
    React.useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [loading, user, router]);

    const links = [
        { href: '/account', label: 'Profile', icon: User },
        { href: '/account/orders', label: 'Orders', icon: Package },
        { href: '/account/addresses', label: 'Addresses', icon: MapPin },
        { href: '/wishlist', label: 'Wishlist', icon: Heart }
    ];

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!user) return null;

    return (
        <div className="container mx-auto px-4 py-12 lg:py-24 max-w-6xl">
            <h1 className="text-3xl font-bold mb-8">My Account</h1>
            <div className="flex flex-col lg:flex-row gap-8">
                <aside className="w-full lg:w-64 shrink-0">
                    <nav className="flex flex-col space-y-1">
                        {links.map((link) => {
                            const Icon = link.icon;
                            const isActive = pathname === link.href;
                            return (
                                <Link 
                                    key={link.href} 
                                    href={link.href}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${isActive ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-black'}`}
                                >
                                    <Icon size={18} />
                                    <span className="font-medium text-sm">{link.label}</span>
                                </Link>
                            )
                        })}
                        <button 
                            onClick={() => logout()}
                            className="flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-red-600 hover:bg-red-50"
                        >
                            <LogOut size={18} />
                            <span className="font-medium text-sm">Logout</span>
                        </button>
                    </nav>
                </aside>
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}

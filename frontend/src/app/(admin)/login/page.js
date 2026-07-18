'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';

export default function AdminLoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            
            if (res.ok && data.success) {
                if (data.data.user.role !== 'ADMIN') {
                    setError('Unauthorized. Admin access required.');
                    return;
                }
                login(data.data.user, data.data.token);
                router.push('/admin');
            } else {
                setError(data.error || 'Failed to login');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="mt-6 text-center text-3xl font-extrabold text-white">Weebster Admin Portal</h2>
            </div>
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-900 border border-red-500 text-red-100 px-4 py-3 rounded-md text-sm">
                                {error}
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Email address</label>
                            <div className="mt-1">
                                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300">Password</label>
                            <div className="mt-1">
                                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                            </div>
                        </div>
                        <div>
                            <button type="submit" disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50">
                                {loading ? 'Authenticating...' : 'Sign in securely'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

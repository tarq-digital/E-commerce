'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { useCartDispatch } from '../../../context/CartContext';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const router = useRouter();
    const { login } = useAuth();
    const { mergeGuestCart } = useCartDispatch();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('registered')) {
            setSuccessMessage('Registration successful. Please sign in.');
        }
    }, []);

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
                console.log("Login response", data);
                console.log("Access Token", data.data.accessToken);
                
                login(data.data.user, data.data.accessToken);

                // Merge guest cart if exists
                const guestToken = localStorage.getItem('guest_cart_token');
                if (guestToken) {
                    await mergeGuestCart(guestToken, data.data.accessToken);
                }

                // redirect based on role
                if (data.data.user.role === 'ADMIN') {
                    router.push('/admin');
                } else {
                    router.push('/account');
                }
            } else {
                const errorMessage = data.details?.[0]?.message || data.message || data.error || 'Login failed';
                setError(errorMessage);
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }

    };

    return (
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
            <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    {successMessage && !error && (
                        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
                            {successMessage}
                        </div>
                    )}
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                            {error}
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email address</label>
                        <div className="mt-1">
                            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Password</label>
                        <div className="mt-1">
                            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <Link href="/forgot-password" className="font-medium text-primary hover:text-primary-dark">
                                Forgot your password?
                            </Link>
                        </div>
                    </div>
                    <div>
                        <button type="submit" disabled={loading}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50">
                            {loading ? 'Logging in...' : 'Sign in'}
                        </button>
                    </div>
                </form>
                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Don't have an account?</span>
                        </div>
                    </div>
                    <div className="mt-6 text-center">
                        <Link href="/register" className="font-medium text-primary hover:text-primary-dark">
                            Register now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

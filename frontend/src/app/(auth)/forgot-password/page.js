'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/auth/forgot-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });
            const data = await res.json();
            
            if (res.ok && data.success) {
                setSuccess(true);
            } else {
                setError(data.error || 'Failed to send reset link');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Reset your password</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
                Enter your email and we will send you a reset link.
            </p>
            <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                {success ? (
                    <div className="text-center">
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm mb-6">
                            If an account exists with this email, a reset link has been sent.
                        </div>
                        <Link href="/login" className="font-medium text-primary hover:text-primary-dark">
                            Return to login
                        </Link>
                    </div>
                ) : (
                    <form className="space-y-6" onSubmit={handleSubmit}>
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
                            <button type="submit" disabled={loading}
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50">
                                {loading ? 'Sending...' : 'Send reset link'}
                            </button>
                        </div>
                    </form>
                )}
                {!success && (
                    <div className="mt-6 text-center">
                        <Link href="/login" className="font-medium text-primary hover:text-primary-dark text-sm">
                            Back to login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

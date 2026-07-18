'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { Button } from '../../../../components/ui/Button/Button';

export default function ProfilePage() {
  const { user, token } = useAuth();
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: ''
  });
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
        setFormData({
            first_name: user.first_name || '',
            last_name: user.last_name || '',
            email: user.email || ''
        });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/auth/profile`, {
            method: 'PATCH',
            headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                first_name: formData.first_name,
                last_name: formData.last_name
            })
        });
        
        if (res.ok) {
            setSuccess(true);
        }
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border p-6 max-w-2xl">
      <h2 className="text-xl font-bold mb-6">Profile Settings</h2>
      {success && (
          <div className="bg-green-50 text-green-700 p-3 rounded-md mb-6 text-sm">
              Profile updated successfully.
          </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input type="text" required value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input type="text" required value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm" />
            </div>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input type="email" disabled value={formData.email} className="mt-1 block w-full border border-gray-300 bg-gray-50 rounded-md px-3 py-2 text-sm text-gray-500" />
            <p className="text-xs text-gray-500 mt-1">Email address cannot be changed.</p>
        </div>
        <div>
            <Button type="submit" disabled={loading} variant="primary">
                {loading ? 'Saving...' : 'Save Changes'}
            </Button>
        </div>
      </form>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../../context/AuthContext';
import { Button } from '../../../../components/ui/Button/Button';

export default function AddressesPage() {
    const { token } = useAuth();
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!token) return;
        const fetchAddresses = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/store/addresses`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setAddresses(data.data || []);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchAddresses();
    }, [token]);

    if (loading) return <div>Loading addresses...</div>;

    return (
        <div className="bg-white rounded-lg border p-6 max-w-4xl">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">My Addresses</h2>
                <Button variant="secondary" size="sm">Add New Address</Button>
            </div>
            {addresses.length === 0 ? (
                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border border-dashed">
                    You have not saved any addresses yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((address) => (
                        <div key={address.id} className="border p-4 rounded-lg relative">
                            {address.is_default && (
                                <span className="absolute top-4 right-4 bg-gray-100 text-xs px-2 py-1 rounded font-medium">Default</span>
                            )}
                            <p className="font-bold">{address.full_name}</p>
                            <p className="text-sm text-gray-600 mt-1">{address.phone_number}</p>
                            <p className="text-sm text-gray-600 mt-2">{address.address_line1}</p>
                            {address.address_line2 && <p className="text-sm text-gray-600">{address.address_line2}</p>}
                            <p className="text-sm text-gray-600">{address.city}, {address.state} {address.postal_code}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

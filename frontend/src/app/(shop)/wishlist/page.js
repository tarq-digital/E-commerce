'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { ProductCard } from '../../../components/product/ProductCard/ProductCard';

export default function WishlistPage() {
    const { token, loading } = useAuth();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!token) {
            setIsLoading(false);
            return;
        }

        const fetchWishlist = async () => {
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1'}/store/wishlist`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setWishlistItems(data.data || []);
                }
            } catch (e) {
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        };
        fetchWishlist();
    }, [token]);

    if (loading || isLoading) return <div className="container mx-auto px-4 py-24 text-center">Loading wishlist...</div>;

    if (!token) {
        return (
            <div className="container mx-auto px-4 py-24 text-center max-w-lg">
                <h1 className="text-3xl font-bold mb-4">Your Wishlist</h1>
                <p className="text-gray-600 mb-8">Please log in to view and manage your wishlist.</p>
                <a href="/login" className="inline-block bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800">
                    Log in to continue
                </a>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12 lg:py-24 max-w-7xl">
            <h1 className="text-3xl font-bold mb-8">Your Wishlist</h1>
            {wishlistItems.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed">
                    <p className="text-gray-500 mb-4">Your wishlist is currently empty.</p>
                    <a href="/shop" className="text-primary font-medium hover:underline">Continue shopping</a>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {wishlistItems.map((item) => (
                        <ProductCard key={item.id} product={item} />
                    ))}
                </div>
            )}
        </div>
    );
}

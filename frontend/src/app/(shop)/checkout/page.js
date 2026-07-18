'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../context/AuthContext';
import { useCartState, useCartDispatch } from '../../../../context/CartContext';

export default function CheckoutPage() {
    const { user, loading, token } = useAuth();
    const { items, subtotal } = useCartState();
    const { clearCart } = useCartDispatch();
    const router = useRouter();

    const [address, setAddress] = useState({
        line1: '',
        line2: '',
        city: '',
        state: '',
        pincode: '',
        phone: ''
    });
    
    const [step, setStep] = useState(1); // 1 = Address, 2 = Payment processing
    const [error, setError] = useState('');

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
        if (items.length === 0) {
            router.push('/cart');
        }
    }, [user, loading, router, items]);

    if (loading || !user) return <div className="p-8 text-center">Loading...</div>;

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        // Zod validation is now strictly enforced on the backend (Bug-004 fix in progress),
        // we must ensure pincode is set.
        if (!address.pincode || !address.line1 || !address.city || !address.state || !address.phone) {
            setError('Please fill all required fields');
            return;
        }

        setStep(2);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';
            
            // Call create checkout order
            const res = await fetch(`${apiUrl}/store/checkout/initiate`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}` 
                },
                body: JSON.stringify({
                    shipping_address: address,
                    billing_address: address, // Same for simplicity
                    payment_method: 'RAZORPAY',
                    notes: ''
                })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to create order');

            // Initialize Razorpay
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || data.data.payment.key_id || 'rzp_test_TEe0UY95f38WAK',
                amount: data.data.payment.amount,
                currency: data.data.payment.currency || 'INR',
                name: 'Weebster',
                description: 'Order Payment',
                order_id: data.data.payment.razorpay_order_id,
                handler: async function (response) {
                    try {
                        const verifyRes = await fetch(`${apiUrl}/webhooks/razorpay`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                payload: {
                                    payment: {
                                        entity: {
                                            order_id: response.razorpay_order_id,
                                            id: response.razorpay_payment_id
                                        }
                                    }
                                }
                            })
                        });
                        
                        if (verifyRes.ok) {
                            clearCart();
                            router.push('/account/orders');
                        } else {
                            setError('Payment verification failed.');
                            setStep(1);
                        }
                    } catch (e) {
                        setError('Payment verification error.');
                        setStep(1);
                    }
                },
                prefill: {
                    name: `${user.first_name} ${user.last_name}`,
                    email: user.email,
                    contact: address.phone
                },
                theme: { color: '#000000' }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                setError('Payment failed: ' + response.error.description);
                setStep(1);
            });
            rzp.open();

        } catch (err) {
            setError(err.message);
            setStep(1);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 pt-24 min-h-screen">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>
            
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    {step === 1 && (
                        <form onSubmit={handleAddressSubmit} className="space-y-4">
                            <h2 className="text-xl font-bold border-b pb-2">Shipping Address</h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phone</label>
                                <input type="tel" required value={address.phone} onChange={(e) => setAddress({...address, phone: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Address Line 1</label>
                                <input type="text" required value={address.line1} onChange={(e) => setAddress({...address, line1: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Address Line 2</label>
                                <input type="text" value={address.line2} onChange={(e) => setAddress({...address, line2: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">City</label>
                                    <input type="text" required value={address.city} onChange={(e) => setAddress({...address, city: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">State</label>
                                    <input type="text" required value={address.state} onChange={(e) => setAddress({...address, state: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Pincode</label>
                                <input type="text" required value={address.pincode} onChange={(e) => setAddress({...address, pincode: e.target.value})} className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" />
                            </div>
                            <button type="submit" className="w-full bg-black text-white py-3 rounded-md font-bold hover:bg-gray-800 transition-colors">
                                Continue to Payment
                            </button>
                        </form>
                    )}
                    {step === 2 && (
                        <div className="text-center p-8 bg-gray-50 rounded-lg border">
                            <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="font-medium">Waiting for payment...</p>
                            <p className="text-sm text-gray-500 mt-2">Please complete the payment in the Razorpay popup.</p>
                        </div>
                    )}
                </div>

                <div className="bg-gray-50 p-6 rounded-lg h-fit">
                    <h2 className="text-xl font-bold border-b pb-2 mb-4">Order Summary</h2>
                    <div className="space-y-4 mb-4">
                        {items.map(item => (
                            <div key={item.variant_id} className="flex justify-between">
                                <span className="text-gray-600">{item.product_name} x {item.quantity}</span>
                                <span className="font-medium">${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t pt-4 flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${parseFloat(subtotal).toFixed(2)}</span>
                    </div>
                </div>
            </div>
            
            {/* Load Razorpay Script */}
            <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        </div>
    );
}

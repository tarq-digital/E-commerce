'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { useCartState, useCartDispatch } from '../../../context/CartContext';

// --- Constants ---
const PAYMENT_STATES = {
    IDLE: 'IDLE',
    ADDRESS: 'ADDRESS',
    PROCESSING: 'PROCESSING', // Initializing order
    PAYMENT_OPEN: 'PAYMENT_OPEN', // Razorpay active
    VERIFYING: 'VERIFYING', // Verifying webhook
    SUCCESS: 'SUCCESS',
    FAILED: 'FAILED',
    CANCELLED: 'CANCELLED'
};

async function waitForRazorpay(maxWait = 5000) {
    const start = Date.now();

    while (Date.now() - start < maxWait) {
        if (
            typeof window !== "undefined" &&
            typeof window.Razorpay === "function"
        ) {
            return true;
        }

        await new Promise(resolve => setTimeout(resolve, 100));
    }

    return false;
}

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
    
    const [paymentState, setPaymentState] = useState(PAYMENT_STATES.ADDRESS);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
        
        // Prevent redirecting to cart if we just successfully checked out
        if (items.length === 0 && paymentState !== PAYMENT_STATES.SUCCESS) {
            router.push('/cart');
        }
    }, [user, loading, router, items, paymentState]);

    if (loading || !user) return <div className="p-8 text-center">Loading...</div>;

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        
        // Prevent double clicks and duplicate windows
        if (paymentState === PAYMENT_STATES.PROCESSING || paymentState === PAYMENT_STATES.PAYMENT_OPEN) return;
        
        setError('');
        
        if (!address.pincode || !address.line1 || !address.city || !address.state || !address.phone) {
            setError('Please fill all required fields');
            return;
        }

        if (!token) {
            console.error("Authentication token missing");
            setError('Please login again.');
            return;
        }

        const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        if (!razorpayKey) {
            setError('Missing Razorpay Key.');
            return;
        }

        console.log("Checkout Started");
        await startPayment(razorpayKey);
    };

    const startPayment = async (razorpayKey) => {
        setPaymentState(PAYMENT_STATES.PROCESSING);
        
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';
            
            const headers = { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}` 
            };
            const guestToken = localStorage.getItem('guest_cart_token');
            if (guestToken) {
                headers['x-guest-cart-token'] = guestToken;
            }

            const res = await fetch(`${apiUrl}/store/checkout/initiate`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    shipping_address: address,
                    billing_address: address, // Same for simplicity
                    payment_method: 'RAZORPAY',
                    notes: ''
                })
            });

            const data = await res.json();
            if (!res.ok) {
                console.error("Checkout initiate failed:", data);
                throw new Error(data.error || 'Payment gateway initialization failed.');
            }
            
            console.log("Order Created");

            // Validate Razorpay options
            const rzpOrderId = data.data.payment.razorpay_order_id;
            const amount = data.data.payment.amount;
            const currency = data.data.payment.currency || 'INR';
            const dynamicKey = razorpayKey || data.data.payment.key_id;
            
            if (!dynamicKey || !rzpOrderId || !amount || amount <= 0 || !currency) {
                throw new Error("Invalid payment parameters received from server.");
            }

            const loaded = await waitForRazorpay();

            if (!loaded) {
                throw new Error("Unable to load payment gateway. Please refresh the page and try again.");
            }

            if (typeof window === "undefined") {
                throw new Error("Window object is unavailable.");
            }

            if (typeof window.Razorpay !== "function") {
                throw new Error("Razorpay SDK not loaded.");
            }

            openRazorpayPopup(dynamicKey, amount, currency, rzpOrderId, apiUrl);

        } catch (err) {
            setError(err.message || "An unexpected error occurred.");
            setPaymentState(PAYMENT_STATES.ADDRESS);
        }
    };

    const openRazorpayPopup = (key, amount, currency, order_id, apiUrl) => {
        console.log("Opening Razorpay");
        setPaymentState(PAYMENT_STATES.PAYMENT_OPEN);
        
        const options = {
            key,
            amount,
            currency,
            name: 'Weebster',
            description: 'Order Payment',
            order_id,
            handler: async function (response) {
                await handlePaymentSuccess(response, apiUrl);
            },
            modal: {
                ondismiss: function() {
                    console.log("Popup Closed");
                    cancelPayment();
                }
            },
            prefill: {
                name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                contact: address.phone
            },
            theme: { color: '#000000' }
        };

        console.log("Razorpay Available:", window.Razorpay);
        console.log("Payment Options:", options);

        const rzp = new window.Razorpay(options);
        
        rzp.on('payment.failed', function (response) {
            handlePaymentFailure(response);
        });
        
        rzp.open();
        console.log("Razorpay Popup Opened");
    };

    const handlePaymentSuccess = async (response, apiUrl) => {
        console.log("Payment Success");
        console.log(response);
        
        setPaymentState(PAYMENT_STATES.VERIFYING);
        console.log("Verification Started");

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
                console.log("Verification Success");
                setPaymentState(PAYMENT_STATES.SUCCESS);
                clearCart();
                router.push('/account/orders');
            } else {
                console.error("Verification Failed");
                setError('Payment received but verification failed.\n\nPlease contact support.');
                setPaymentState(PAYMENT_STATES.FAILED);
            }
        } catch (e) {
            console.error("Verification Failed", e);
            setError('Payment verification error.\n\nPlease contact support.');
            setPaymentState(PAYMENT_STATES.FAILED);
        }
    };

    const handlePaymentFailure = (response) => {
        console.log("Payment Failed");
        console.log(response.error);
        
        const reason = response.error.description || 'Unknown error occurred.';
        setError(`Payment failed.\n\nReason: ${reason}\n\nPlease try again.`);
        
        setPaymentState(PAYMENT_STATES.ADDRESS);
    };

    const cancelPayment = () => {
        setError("Payment cancelled. You can try again whenever you're ready.");
        setPaymentState(PAYMENT_STATES.ADDRESS);
    };

    return (
        <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 pt-24 min-h-screen">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>
            
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-6 whitespace-pre-wrap">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div>
                    {(paymentState === PAYMENT_STATES.ADDRESS || paymentState === PAYMENT_STATES.FAILED || paymentState === PAYMENT_STATES.CANCELLED) && (
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
                            <button 
                                type="submit" 
                                className="w-full bg-black text-white py-3 rounded-md font-bold hover:bg-gray-800 transition-colors"
                            >
                                Continue to Payment
                            </button>
                        </form>
                    )}
                    
                    {(paymentState === PAYMENT_STATES.PROCESSING || paymentState === PAYMENT_STATES.PAYMENT_OPEN || paymentState === PAYMENT_STATES.VERIFYING) && (
                        <div className="text-center p-8 bg-white rounded-lg border shadow-sm">
                            <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                            
                            {paymentState === PAYMENT_STATES.PROCESSING && (
                                <>
                                    <h3 className="text-xl font-bold mb-2">Initializing...</h3>
                                    <p className="text-sm text-gray-500 mb-6">Preparing your secure payment.</p>
                                </>
                            )}
                            
                            {paymentState === PAYMENT_STATES.PAYMENT_OPEN && (
                                <>
                                    <h3 className="text-xl font-bold mb-2">Opening Secure Payment Gateway...</h3>
                                    <p className="text-sm text-gray-500 mb-6">Please complete the payment in the popup window. Do not refresh or close this page.</p>
                                    <button 
                                        onClick={cancelPayment} 
                                        className="px-6 py-2 border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        Cancel Payment
                                    </button>
                                </>
                            )}

                            {paymentState === PAYMENT_STATES.VERIFYING && (
                                <>
                                    <h3 className="text-xl font-bold mb-2">Verifying Payment...</h3>
                                    <p className="text-sm text-gray-500">Securing your order.</p>
                                </>
                            )}
                        </div>
                    )}

                    {paymentState === PAYMENT_STATES.SUCCESS && (
                         <div className="text-center p-8 bg-green-50 rounded-lg border border-green-200">
                             <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
                             <h3 className="text-xl font-bold text-green-800 mb-2">Payment Successful!</h3>
                             <p className="text-sm text-green-600">Redirecting to your orders...</p>
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
        </div>
    );
}

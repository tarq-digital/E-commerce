const fetch = require('node-fetch'); // Assuming node 18+ or node-fetch available. We'll just use native fetch in Node 18+
const mysql = require('mysql2/promise');

async function testFlow() {
  const apiUrl = 'http://127.0.0.1:8000/api/v1';

  try {
    console.log("1. Logging in...");
    const loginRes = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'john@example.com', password: 'Admin@123' })
    });
    const loginData = await loginRes.json();
    if (!loginRes.ok) throw new Error("Login failed");
    const authToken = loginData.data.token;
    console.log("Login successful! Token:", authToken.substring(0, 10) + '...');

    console.log("\\n2. Hitting merge API with both headers...");
    const guestCartToken = 'cc68c904-6008-4623-a982-79ba5a6ea61e'; // From previous dump
    const mergeRes = await fetch(`${apiUrl}/store/cart/merge`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
        'x-guest-cart-token': guestCartToken
      },
      body: JSON.stringify({ guest_cart_token: guestCartToken })
    });
    const mergeData = await mergeRes.json();
    console.log(`Merge API Status: ${mergeRes.status}`);
    console.log(`Merge API Response:`, mergeData);

    console.log("\\n3. Checking database for cart update...");
    const connection = await mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      password: 'Sumit@10042006',
      database: 'weebster_dev'
    });
    
    const [carts] = await connection.query(`SELECT id, user_id, cart_token FROM carts WHERE cart_token = ?`, [guestCartToken]);
    if (carts.length > 0) {
      console.log(`Cart Database State -> ID: ${carts[0].id}, User_ID: ${carts[0].user_id}, Token: ${carts[0].cart_token}`);
    } else {
      console.log("Cart not found in DB!");
    }
    await connection.end();

    console.log("\\n4. Hitting checkout initiate...");
    const checkoutRes = await fetch(`${apiUrl}/store/checkout/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({
        shipping_address: {
            line1: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            pincode: '123456',
            phone: '1234567890'
        },
        billing_address: {
            line1: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            pincode: '123456',
            phone: '1234567890'
        },
        payment_method: 'RAZORPAY'
      })
    });
    const checkoutData = await checkoutRes.json();
    console.log(`Checkout Initiate Status: ${checkoutRes.status}`);
    if (checkoutRes.ok) {
        console.log(`Checkout Success! Order ID: ${checkoutData.data?.order?.id}`);
    } else {
        console.log(`Checkout Error:`, checkoutData);
    }
    
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testFlow();

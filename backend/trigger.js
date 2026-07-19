const fetch = require('node-fetch');

async function triggerCart() {
    try {
        const res = await fetch('http://127.0.0.1:8000/api/v1/store/cart', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-guest-cart-token': 'cc68c904-6008-4623-a982-79ba5a6ea61e' // A known guest cart token
            }
        });
        const data = await res.json();
        console.log("Response:", JSON.stringify(data, null, 2));
    } catch (e) {
        console.error(e);
    }
}

triggerCart();

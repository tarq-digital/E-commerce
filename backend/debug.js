const fetch = require('node-fetch');

async function test() {
  const res = await fetch('http://127.0.0.1:8000/api/v1/store/checkout/initiate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      shipping_address: {
        phone: "1234567890",
        line1: "123",
        city: "City",
        state: "State",
        pincode: "123456"
      },
      billing_address: {
        phone: "1234567890",
        line1: "123",
        city: "City",
        state: "State",
        pincode: "123456"
      },
      payment_method: 'RAZORPAY',
      notes: ''
    })
  });
  const data = await res.json();
  console.log(res.status);
  console.log(data);
}

test();

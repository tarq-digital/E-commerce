const puppeteer = require('puppeteer');

(async () => {
  console.log("Launching browser...");
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  let mergeCalled = false;
  let mergeRequest = null;
  let mergeResponse = null;

  // Intercept network requests
  await page.setRequestInterception(true);
  page.on('request', request => {
    const url = request.url();
    if (url.includes('/store/cart/merge') && request.method() === 'POST') {
      mergeCalled = true;
      mergeRequest = {
        url,
        method: request.method(),
        headers: request.headers(),
        postData: request.postData()
      };
    }
    request.continue();
  });

  page.on('response', async response => {
    const url = response.url();
    if (url.includes('/store/cart/merge') && response.request().method() === 'POST') {
      mergeResponse = {
        status: response.status(),
        headers: response.headers()
      };
      try {
        mergeResponse.body = await response.text();
      } catch (e) {
        mergeResponse.body = 'Could not read body';
      }
    }
  });

  try {
    // 1. Go to homepage or product page and add to cart to get guest cart token
    console.log("Navigating to product page...");
    await page.goto('http://localhost:3000/product/gundam-aerial-1144-hg');
    
    // Assuming there's an "Add to Cart" button, let's just directly add guest cart token to localStorage for simulation if needed
    // But let's just go to login directly
    console.log("Navigating to login...");
    await page.goto('http://localhost:3000/login');
    
    // Add guest cart token to localStorage to ensure it exists
    await page.evaluate(() => {
      localStorage.setItem('guest_cart_token', 'test-guest-token-12345');
    });
    
    console.log("Filling login form...");
    // Assuming email and password fields exist
    await page.type('input[type="email"]', 'john@example.com'); // Admin user from seed
    await page.type('input[type="password"]', 'Admin@123'); // Password from seed
    
    console.log("Clicking submit...");
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 10000 }).catch(() => {}), // Ignore timeout if it doesn't navigate
      page.click('button[type="submit"]') // Submit button
    ]);
    
    // Wait a little bit for any background requests to fire
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log("=== TEST RESULTS ===");
    console.log(`1. Was merge API called? ${mergeCalled ? 'YES' : 'NO'}`);
    
    if (mergeCalled) {
      console.log(`2. Network request status: Sent`);
      console.log(`   Headers: ${JSON.stringify(mergeRequest.headers)}`);
      console.log(`   Body: ${mergeRequest.postData}`);
      if (mergeResponse) {
        console.log(`3. Backend response: Status ${mergeResponse.status}`);
        console.log(`   Body: ${mergeResponse.body}`);
      }
    } else {
      console.log("2. Network request status: NOT SENT");
      console.log("Reason: The AuthContext.login function does not contain any fetch call to /store/cart/merge. It only updates state and cookies.");
    }
    
  } catch (error) {
    console.error("Error during test:", error);
  } finally {
    await browser.close();
  }
})();

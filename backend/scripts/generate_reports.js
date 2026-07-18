const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'docs', 'testing');
if (!fs.existsSync(dir)){
    fs.mkdirSync(dir, { recursive: true });
}

const reports = {
    "01_Verified_Bug_Report.md": `# 01 Verified Bug Report\n\n## 1. Admin Analytics Token XSS\n- **Status:** Verified\n- **Evidence:** Found \`getCookie('token')\` directly invoked in \`analytics/reports/page.js:L18\`.\n- **Component:** \`ReportsDashboard\`\n\n## 2. Product Soft-Delete Leak\n- **Status:** Verified\n- **Evidence:** \`ProductRepository.getAll()\` does not enforce \`deleted_at IS NULL\`.`,
    "02_Root_Cause_Analysis.md": `# 02 Root Cause Analysis\n\n## Analytics Token Bug\n- **Root Cause:** Bypassed standardized \`lib/axios.js\` interceptor. React Client Component manually parsing cookies.\n- **File:** \`frontend/src/app/(admin)/admin/analytics/reports/page.js\`\n\n## Forgot Password Crash\n- **Root Cause:** SMTP transport is disconnected in \`services/email.service.js\`. \`password_reset_tokens\` table is missing from \`001_initial_schema.up.sql\`.\n- **File:** \`backend/src/services/email.service.js\``,
    "03_Console_Error_Report.md": `# 03 Console Error Report\n\n## Hydration Mismatch\n- **Error:** \`Text content does not match server-rendered HTML.\`\n- **Cause:** \`CartDrawer\` reads \`localStorage\` before \`useEffect\` mounts.\n- **Trace:** \`CartProvider\` -> \`CartDrawer\`.`,
    "04_Network_Error_Report.md": `# 04 Network Error Report\n\n## Wishlist Toggle\n- **Request:** \`POST /api/v1/wishlist\`\n- **Status:** \`404 Not Found\`\n- **Payload:** \`{ "productId": "uuid" }\`\n- **Trace:** \`Wishlist API route missing from index.js\`.`,
    "05_API_Failure_Report.md": `# 05 API Failure Report\n\n## Address Checkout Validation\n- **Endpoint:** \`POST /api/v1/store/checkout\`\n- **Error:** 500 Internal Server Error when pincode is null.\n- **Root Cause:** Missing Zod validation in \`checkout.routes.js\`.`,
    "06_Component_Failure_Report.md": `# 06 Component Failure Report\n\n## Customer Notes UI\n- **Component:** \`<CustomerNotesPanel>\` (Expected)\n- **Failure:** Does not exist.\n- **File:** \`frontend/src/app/(admin)/admin/customers/[id]/page.js\` lacks the integration.`,
    "07_Database_Failure_Report.md": `# 07 Database Failure Report\n\n## Soft Delete Filter\n- **Query:** \`SELECT * FROM products\`\n- **Expected:** \`SELECT * FROM products WHERE deleted_at IS NULL\`\n- **File:** \`backend/src/modules/catalog/repositories/product.repository.js\``,
    "08_Authentication_Report.md": `# 08 Authentication Report\n\n## Access Token Storage\n- **Trace:** \`auth.controller.js\` issues JWT -> Frontend stores in cookie -> \`page.js\` reads via \`getCookie\`. \n- **Verdict:** Insecure. Must be refactored to HttpOnly.`,
    "09_Third_Party_Integration_Report.md": `# 09 Third-Party Integration Report\n\n## Razorpay\n- **Status:** Verified Working.\n- **File:** \`payment.service.js\` correctly verifies HMAC-SHA256 signature.\n\n## Cloudinary\n- **Status:** Verified Working.\n- **File:** \`media.controller.js\` successfully streams to Cloudinary API.`,
    "10_Evidence_Based_Master_Bug_List.md": `# 10 Evidence-Based Master Bug List\n\n1. XSS Vulnerability in Token Storage (\`page.js:L18\`)\n2. Missing Wishlist Route (\`404 Not Found\`)\n3. Broken SMTP for Password Reset (\`500 Error\`)\n4. Hydration Error on Cart (\`Console Warning\`)\n5. Missing Zod Checkout Validation (\`SQL Error\`)`,
    "11_Bug_Fix_Order.md": `# 11 Bug Fix Order (Phase 4)\n\n1. **Critical:** Refactor Token Storage (Security).\n2. **Critical:** Implement Zod Validation on Checkout (Data Integrity).\n3. **Critical:** Fix Soft Deletes (Data Leak).\n4. **High:** Mount Wishlist APIs (Core Feature).\n5. **Medium:** Fix Cart Hydration (UX).`
};

for (const [filename, content] of Object.entries(reports)) {
    fs.writeFileSync(path.join(dir, filename), content);
    console.log(`Created ${filename}`);
}

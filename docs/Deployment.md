# Deployment & Infrastructure

## 1. Infrastructure Overview
Weebster is deployed on a Hostinger VPS running Ubuntu. The deployment consists of three main services running on the same machine (for the initial launch phase):
1. **Next.js Frontend Server** (Port 3000)
2. **Node.js Express API** (Port 5000)
3. **MySQL Database Server** (Port 3306)

**Reverse Proxy:** Nginx handles incoming HTTP/HTTPS traffic on ports 80/443 and routes it to the appropriate internal ports.

## 2. Environment Setup

### 2.1. Prerequisites on VPS
- Node.js (v18 or higher)
- npm or yarn
- PM2 (Process Manager: `npm install -g pm2`)
- Nginx
- MySQL Server
- Certbot (for Let's Encrypt SSL)

### 2.2. Environment Variables (.env)
*Never commit these to GitHub. Store securely on the VPS.*

**Backend `.env`:**
```env
PORT=5000
NODE_ENV=production
DB_HOST=localhost
DB_USER=weebster_admin
DB_PASS=secure_db_password
DB_NAME=weebster_db
JWT_SECRET=super_secret_jwt_key
CLOUDINARY_URL=cloudinary://...
RAZORPAY_KEY_ID=rzp_live_...
RAZORPAY_KEY_SECRET=secret_...
CORS_ORIGIN=https://weebster.in
```

**Frontend `.env.local`:**
```env
NEXT_PUBLIC_API_URL=https://api.weebster.in/api/v1
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_live_...
```

## 3. CI/CD Pipeline (GitHub Actions)
Automated deployments triggered on pushes to the `main` branch.

**Workflow Summary:**
1. Code pushed to `main`.
2. GitHub Action connects to Hostinger VPS via SSH.
3. Pulls latest code from Git.
4. Runs `npm install` for frontend and backend.
5. Runs `npm run build` for the Next.js frontend.
6. Restarts PM2 processes: `pm2 restart api`, `pm2 restart frontend`.

## 4. Manual Deployment Steps (Fallback)

### Backend (Node.js)
```bash
cd /var/www/weebster/backend
npm install
# Run migrations (if using Sequelize/Knex)
npx sequelize-cli db:migrate
pm2 start server.js --name "weebster-api"
pm2 save
```

### Frontend (Next.js)
```bash
cd /var/www/weebster/frontend
npm install
npm run build
pm2 start npm --name "weebster-frontend" -- start
pm2 save
```

## 5. Nginx Configuration
Nginx handles domain routing and SSL termination.

**Frontend (`weebster.in`):**
```nginx
server {
    server_name weebster.in www.weebster.in;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Backend API (`api.weebster.in`):**
```nginx
server {
    server_name api.weebster.in;
    
    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```
*Note: SSL generated via `certbot --nginx`.*

## 6. Backup & Recovery
- **Database Backups:** A cron job runs nightly (`0 2 * * *`) executing `mysqldump` and compressing the output to a secure backup directory.
- **Media Backups:** Not required locally as all product and banner images are hosted on Cloudinary, which provides its own redundancy.
- **Rollback Strategy:** In case of a failed deployment, PM2 can be reverted, and Next.js can fall back to the previous build directory. Git tags are used for versioning releases.

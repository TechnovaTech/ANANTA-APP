# 🚀 ANANTA APP - Complete VPS Deployment Guide

## 📋 Project Overview
- **Admin Panel Frontend**: Next.js (Port 3011)
- **Backend API**: Spring Boot Java (Port 8082)  
- **Mobile App**: React Native (Expo)
- **Database**: PostgreSQL
- **Reverse Proxy**: Nginx

## 🖥️ VPS Requirements
- **OS**: Ubuntu 20.04/22.04 LTS
- **RAM**: Minimum 4GB (8GB recommended)
- **Storage**: 50GB+ SSD
- **CPU**: 2+ cores

## 🔧 Step 1: Initial VPS Setup

### 1.1 Connect to VPS
```bash
ssh root@your-vps-ip
```

### 1.2 Update System
```bash
apt update && apt upgrade -y
```

### 1.3 Create Non-Root User
```bash
adduser ananta
usermod -aG sudo ananta
su - ananta
```

## 📦 Step 2: Install Required Software

### 2.1 Install Node.js 18+
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
node --version
npm --version
```

### 2.2 Install Java 17
```bash
sudo apt install openjdk-17-jdk -y
java -version
```

### 2.3 Install Maven
```bash
sudo apt install maven -y
mvn -version
```

### 2.4 Install PostgreSQL
```bash
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 2.5 Install Nginx
```bash
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 2.6 Install PM2 (Process Manager)
```bash
sudo npm install -g pm2
```

## 🗄️ Step 3: Database Setup

### 3.1 Configure PostgreSQL
```bash
sudo -u postgres psql
```

```sql
CREATE DATABASE ananta_db;
CREATE USER ananta_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE ananta_db TO ananta_user;
ALTER USER ananta_user CREATEDB;
\q
```

### 3.2 Configure PostgreSQL for Remote Access
```bash
sudo nano /etc/postgresql/14/main/postgresql.conf
```
Change: `listen_addresses = 'localhost'` to `listen_addresses = '*'`

```bash
sudo nano /etc/postgresql/14/main/pg_hba.conf
```
Add: `host all all 0.0.0.0/0 md5`

```bash
sudo systemctl restart postgresql
```

## 📁 Step 4: Deploy Project Files

### 4.1 Clone/Upload Project
```bash
cd /home/ananta
# Option 1: Git clone
git clone https://github.com/your-repo/ANANTA-APP.git
# Option 2: Upload via SCP/SFTP

cd ANANTA-APP
```

### 4.2 Set Permissions
```bash
sudo chown -R ananta:ananta /home/ananta/ANANTA-APP
chmod -R 755 /home/ananta/ANANTA-APP
```

## ☕ Step 5: Deploy Java Backend

### 5.1 Configure Application Properties
```bash
cd /home/ananta/ANANTA-APP/adminpanel/backend
nano src/main/resources/application.properties
```

Update database configuration:
```properties
spring.application.name=ananta-admin-backend
server.port=8082

# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/ananta_db
spring.datasource.username=ananta_user
spring.datasource.password=your_secure_password
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.jdbc.lob.non_contextual_creation=true

# Timezone Configuration
spring.jpa.properties.hibernate.jdbc.time_zone=Asia/Kolkata
spring.jackson.time-zone=Asia/Kolkata

# JWT Secret (Change this!)
jwt.secret=your-super-secure-jwt-secret-key-for-production-environment
jwt.expiration=86400000

# Agora Configuration
agora.appId=your_agora_app_id
agora.certificate=your_agora_certificate

# File upload limits
spring.servlet.multipart.max-file-size=50MB
spring.servlet.multipart.max-request-size=50MB
server.tomcat.max-swallow-size=50MB
```

### 5.2 Build Java Application
```bash
mvn clean package -DskipTests
```

### 5.3 Create Backend Service
```bash
sudo nano /etc/systemd/system/ananta-backend.service
```

```ini
[Unit]
Description=Ananta Backend Service
After=network.target

[Service]
Type=simple
User=ananta
WorkingDirectory=/home/ananta/ANANTA-APP/adminpanel/backend
ExecStart=/usr/bin/java -jar target/admin-backend-0.0.1-SNAPSHOT.jar
Restart=always
RestartSec=10
Environment=JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64

[Install]
WantedBy=multi-user.target
```

### 5.4 Start Backend Service
```bash
sudo systemctl daemon-reload
sudo systemctl enable ananta-backend
sudo systemctl start ananta-backend
sudo systemctl status ananta-backend
```

## 🌐 Step 6: Deploy Admin Panel (Next.js)

### 6.1 Install Dependencies
```bash
cd /home/ananta/ANANTA-APP/adminpanel
npm install
```

### 6.2 Update Next.js Configuration
```bash
nano next.config.js
```

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['mongoose']
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8082/api/:path*'
      }
    ]
  }
}

module.exports = nextConfig
```

### 6.3 Build Next.js Application
```bash
npm run build
```

### 6.4 Create Frontend PM2 Configuration
```bash
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'ananta-admin',
    script: 'npm',
    args: 'start',
    cwd: '/home/ananta/ANANTA-APP/adminpanel',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3011
    }
  }]
}
```

### 6.5 Start Frontend with PM2
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 🔧 Step 7: Configure Nginx Reverse Proxy

### 7.1 Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/ananta-app
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    # Admin Panel
    location / {
        proxy_pass http://localhost:3011;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Backend API
    location /api/ {
        proxy_pass http://localhost:8082/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Handle CORS
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
        add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization";
        
        if ($request_method = 'OPTIONS') {
            return 204;
        }
    }

    # File uploads
    client_max_body_size 50M;
}
```

### 7.2 Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/ananta-app /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 🔒 Step 8: SSL Certificate (Optional but Recommended)

### 8.1 Install Certbot
```bash
sudo apt install certbot python3-certbot-nginx -y
```

### 8.2 Get SSL Certificate
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 🔥 Step 9: Configure Firewall

```bash
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 8082
sudo ufw enable
```

## 📱 Step 10: Mobile App Configuration

### 10.1 Update API Endpoints
```bash
cd /home/ananta/ANANTA-APP/Anantaapp
nano config/env.ts
```

```typescript
export const API_BASE_URL = 'https://your-domain.com/api';
export const ADMIN_PANEL_URL = 'https://your-domain.com';
```

### 10.2 Build APK (Optional - for testing)
```bash
# Install Expo CLI globally
npm install -g @expo/cli

# Build APK
expo build:android
```

## 🔍 Step 11: Verification & Testing

### 11.1 Check Services Status
```bash
# Backend service
sudo systemctl status ananta-backend

# Frontend PM2
pm2 status

# Nginx
sudo systemctl status nginx

# PostgreSQL
sudo systemctl status postgresql
```

### 11.2 Test Endpoints
```bash
# Backend health check
curl http://localhost:8082/api/health

# Frontend check
curl http://localhost:3011

# External access
curl https://your-domain.com
```

### 11.3 Check Logs
```bash
# Backend logs
sudo journalctl -u ananta-backend -f

# Frontend logs
pm2 logs ananta-admin

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

## 🔄 Step 12: Backup & Maintenance

### 12.1 Database Backup Script
```bash
nano /home/ananta/backup-db.sh
```

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump -h localhost -U ananta_user ananta_db > /home/ananta/backups/ananta_db_$DATE.sql
find /home/ananta/backups -name "*.sql" -mtime +7 -delete
```

```bash
chmod +x /home/ananta/backup-db.sh
mkdir -p /home/ananta/backups
```

### 12.2 Setup Cron Job
```bash
crontab -e
```

Add:
```bash
0 2 * * * /home/ananta/backup-db.sh
```

## 🚀 Step 13: Production Optimizations

### 13.1 Enable Gzip in Nginx
```bash
sudo nano /etc/nginx/nginx.conf
```

Uncomment gzip settings:
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

### 13.2 Optimize PostgreSQL
```bash
sudo nano /etc/postgresql/14/main/postgresql.conf
```

```ini
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
```

```bash
sudo systemctl restart postgresql
```

## 📋 Step 14: Final Checklist

- [ ] VPS setup complete
- [ ] PostgreSQL database created and configured
- [ ] Java backend deployed and running (Port 8082)
- [ ] Next.js admin panel deployed and running (Port 3011)
- [ ] Nginx reverse proxy configured
- [ ] SSL certificate installed (if using domain)
- [ ] Firewall configured
- [ ] Services auto-start on boot
- [ ] Backup system in place
- [ ] Mobile app API endpoints updated

## 🌐 Access URLs

- **Admin Panel**: `https://your-domain.com` or `http://your-vps-ip`
- **Backend API**: `https://your-domain.com/api` or `http://your-vps-ip:8082/api`
- **Default Admin Login**: 
  - Email: `admin@ananta.com`
  - Password: `Admin@123`

## 🆘 Troubleshooting

### Backend Issues
```bash
# Check backend logs
sudo journalctl -u ananta-backend -f

# Restart backend
sudo systemctl restart ananta-backend
```

### Frontend Issues
```bash
# Check PM2 logs
pm2 logs ananta-admin

# Restart frontend
pm2 restart ananta-admin
```

### Database Issues
```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Connect to database
psql -h localhost -U ananta_user -d ananta_db
```

### Nginx Issues
```bash
# Test configuration
sudo nginx -t

# Check logs
sudo tail -f /var/log/nginx/error.log
```

## 🔧 Maintenance Commands

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Restart all services
sudo systemctl restart ananta-backend
pm2 restart ananta-admin
sudo systemctl restart nginx

# Check disk space
df -h

# Check memory usage
free -h

# Check running processes
htop
```

---

**🎉 Your ANANTA APP is now fully deployed on VPS!**

**Support**: For issues, check logs and ensure all services are running properly.
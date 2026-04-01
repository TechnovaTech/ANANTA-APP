# 🚀 COMPLETE ANANTA DEPLOYMENT COMMANDS - PORT 3011
**Frontend**: Next.js Admin Panel (Port 3011) + **Backend**: Spring Boot API (Port 8082)
**Domain**: admin.anantalive.com

## 📋 **STEP-BY-STEP DEPLOYMENT COMMANDS**

### **Step 1: Initial Server Setup**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Java 17 (for Spring Boot backend)
sudo apt install openjdk-17-jdk -y
java -version

# Set JAVA_HOME
echo 'export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64' >> ~/.bashrc
echo 'export PATH=$PATH:$JAVA_HOME/bin' >> ~/.bashrc
source ~/.bashrc

# Install Node.js 18 (for Next.js frontend)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installations
node -v
npm -v
java -version

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Install other dependencies
sudo apt install git maven nginx pm2 -y

# Install PM2 globally for Node.js process management
sudo npm install -g pm2
```

### **Step 2: Setup Database**
```bash
# Create database and user
sudo -u postgres psql << EOF
CREATE DATABASE ananta_db;
CREATE USER ananta_user WITH PASSWORD 'AnantaSecure2024!';
GRANT ALL PRIVILEGES ON DATABASE ananta_db TO ananta_user;
ALTER USER ananta_user CREATEDB;
\q
EOF

# Test database connection
PGPASSWORD=AnantaSecure2024! psql -h localhost -U ananta_user -d ananta_db -c "SELECT version();"
```

### **Step 3: Clone Your Project**
```bash
# Navigate to web directory
cd /var/www

# Clone repository (replace with your actual repo URL)
sudo git clone https://github.com/mukundsparknet/ananta-app.git
sudo chown -R $USER:$USER ananta-app
cd ananta-app
```

### **Step 4: Setup Spring Boot Backend**
```bash
# Navigate to backend
cd /var/www/ananta-app/adminpanel/backend

# Update application.properties for production
cat > src/main/resources/application.properties << EOF
spring.application.name=ananta-admin-backend
server.port=8082

# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/ananta_db
spring.datasource.username=ananta_user
spring.datasource.password=AnantaSecure2024!
spring.datasource.driver-class-name=org.postgresql.Driver

# JPA / Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.properties.hibernate.jdbc.lob.non_contextual_creation=true

# Timezone Configuration - Force IST (Indian Standard Time)
spring.jpa.properties.hibernate.jdbc.time_zone=Asia/Kolkata
spring.jackson.time-zone=Asia/Kolkata

# JWT Secret
jwt.secret=your-super-secret-jwt-key-that-should-be-very-long-and-secure-production-2024
jwt.expiration=86400000

# Agora
agora.appId=d5a2b8ce22984e4899432783c16a1729
agora.certificate=

# File upload settings
spring.servlet.multipart.max-file-size=50MB
spring.servlet.multipart.max-request-size=50MB
server.tomcat.max-swallow-size=50MB

# Production settings
logging.level.com.ananta=INFO
server.error.include-stacktrace=never
EOF

# Build the Spring Boot application
mvn clean package -DskipTests

# Create application directory
sudo mkdir -p /opt/ananta/backend
sudo mkdir -p /opt/ananta/logs
sudo mkdir -p /opt/ananta/uploads

# Copy JAR file
sudo cp target/admin-backend-*.jar /opt/ananta/backend/ananta-admin-backend.jar

# Set permissions
sudo chown -R $USER:$USER /opt/ananta
```

### **Step 5: Setup Next.js Admin Panel Frontend (Port 3011)**
```bash
# Navigate to admin panel frontend
cd /var/www/ananta-app/adminpanel

# Create environment file for production with port 3011
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:8082/api
NODE_ENV=production
PORT=3011
EOF

# Update package.json to use port 3011
cat > package.json << EOF
{
  "name": "ananta-admin",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev -p 3011",
    "build": "next build",
    "start": "next start -p 3011"
  },
  "dependencies": {
    "next": "14.0.4",
    "react": "^18",
    "react-dom": "^18",
    "axios": "^1.6.2",
    "xlsx": "^0.18.5"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18"
  }
}
EOF

# Install dependencies
npm install

# Build the Next.js application
npm run build

# Create frontend directory
sudo mkdir -p /opt/ananta/frontend

# Copy built application
sudo cp -r .next /opt/ananta/frontend/
sudo cp -r public /opt/ananta/frontend/
sudo cp -r node_modules /opt/ananta/frontend/
sudo cp package.json /opt/ananta/frontend/
sudo cp .env.local /opt/ananta/frontend/

# Set permissions
sudo chown -R $USER:$USER /opt/ananta/frontend
```

### **Step 6: Create Systemd Service for Backend**
```bash
# Create backend service file
sudo tee /etc/systemd/system/ananta-backend.service << EOF
[Unit]
Description=ANANTA Admin Backend Service
After=network.target postgresql.service

[Service]
Type=simple
User=$USER
WorkingDirectory=/opt/ananta/backend
ExecStart=/usr/bin/java -jar -Xmx1024m -Xms512m /opt/ananta/backend/ananta-admin-backend.jar
Restart=always
RestartSec=10
StandardOutput=append:/opt/ananta/logs/backend.log
StandardError=append:/opt/ananta/logs/backend-error.log

Environment=SPRING_PROFILES_ACTIVE=prod
Environment=JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64

[Install]
WantedBy=multi-user.target
EOF

# Start backend service
sudo systemctl daemon-reload
sudo systemctl enable ananta-backend
sudo systemctl start ananta-backend

# Check backend status
sudo systemctl status ananta-backend
```

### **Step 7: Setup PM2 for Next.js Frontend (Port 3011)**
```bash
# Navigate to frontend directory
cd /opt/ananta/frontend

# Create PM2 ecosystem file for port 3011
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'ananta-frontend',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -p 3011',
    cwd: '/opt/ananta/frontend',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3011
    },
    error_file: '/opt/ananta/logs/frontend-error.log',
    out_file: '/opt/ananta/logs/frontend.log',
    log_file: '/opt/ananta/logs/frontend-combined.log'
  }]
};
EOF

# Start frontend with PM2 on port 3011
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the command that PM2 shows you (it will be something like: sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp /home/$USER)
```

### **Step 8: Configure Nginx (Frontend Port 3011 + Backend Port 8082)**
```bash
# Create Nginx configuration for port 3011 frontend and port 8082 backend
sudo tee /etc/nginx/sites-available/ananta << EOF
server {
    listen 80;
    server_name admin.anantalive.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Handle large file uploads
    client_max_body_size 50M;

    # API routes - proxy to Spring Boot backend (port 8082)
    location /api/ {
        proxy_pass http://localhost:8082/api/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
        
        # CORS headers
        add_header Access-Control-Allow-Origin *;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
        add_header Access-Control-Allow-Headers "Origin, X-Requested-With, Content-Type, Accept, Authorization";
    }

    # Health check for backend
    location /health {
        proxy_pass http://localhost:8082/health;
        access_log off;
    }

    # Static uploads
    location /uploads/ {
        alias /opt/ananta/uploads/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Next.js frontend - proxy to port 3011
    location / {
        proxy_pass http://localhost:3011;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        
        # WebSocket support for Next.js hot reload (dev mode)
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Next.js static files
    location /_next/static/ {
        proxy_pass http://localhost:3011/_next/static/;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
EOF

# Enable site and restart Nginx
sudo ln -s /etc/nginx/sites-available/ananta /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx
```

### **Step 9: Setup SSL Certificate**
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx -y

# Get SSL certificate (replace your-email@domain.com with your actual email)
sudo certbot --nginx -d admin.anantalive.com --non-interactive --agree-tos --email your-email@domain.com

# Test auto-renewal
sudo certbot renew --dry-run

# Set up auto-renewal cron job
echo "0 12 * * * /usr/bin/certbot renew --quiet" | sudo crontab -
```

### **Step 10: Configure Firewall**
```bash
# Setup firewall
sudo ufw --force enable
sudo ufw allow ssh
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 3011  # Next.js frontend
sudo ufw allow 8082  # Spring Boot backend
sudo ufw status verbose
```

### **Step 11: Initialize Database**
```bash
# Create admin user in database
PGPASSWORD=AnantaSecure2024! psql -h localhost -U ananta_user -d ananta_db << EOF
INSERT INTO admin (id, username, email, password, created_at, updated_at) 
VALUES (
    1, 
    'admin', 
    'admin@ananta.com', 
    '\$2a\$10\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    NOW(), 
    NOW()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO app_settings (id, app_name, app_version, maintenance_mode, created_at, updated_at)
VALUES (
    1,
    'ANANTA Live',
    '1.0.0',
    false,
    NOW(),
    NOW()
) ON CONFLICT (id) DO NOTHING;
EOF
```

### **Step 12: Create Management Scripts**

#### Complete Update Script
```bash
cat > /home/$USER/update-ananta.sh << 'EOF'
#!/bin/bash
set -e
echo "🔄 Updating ANANTA Admin Panel (Frontend Port 3011 + Backend Port 8082)..."

# Navigate to project directory
cd /var/www/ananta-app
git pull origin main

# Update Backend
echo "🏗️ Building backend..."
cd adminpanel/backend
mvn clean package -DskipTests

echo "⏹️ Stopping backend service..."
sudo systemctl stop ananta-backend

# Backup current JAR
sudo cp /opt/ananta/backend/ananta-admin-backend.jar /opt/ananta/backend/ananta-admin-backend.jar.backup

# Copy new JAR
sudo cp target/admin-backend-*.jar /opt/ananta/backend/ananta-admin-backend.jar

echo "▶️ Starting backend service..."
sudo systemctl start ananta-backend

# Update Frontend
echo "🎨 Building frontend..."
cd ../

# Update package.json for port 3011
cat > package.json << 'PACKAGE_EOF'
{
  "name": "ananta-admin",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev -p 3011",
    "build": "next build",
    "start": "next start -p 3011"
  },
  "dependencies": {
    "next": "14.0.4",
    "react": "^18",
    "react-dom": "^18",
    "axios": "^1.6.2",
    "xlsx": "^0.18.5"
  },
  "devDependencies": {
    "typescript": "^5",
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18"
  }
}
PACKAGE_EOF

npm install
npm run build

echo "⏹️ Stopping frontend..."
pm2 stop ananta-frontend

# Update frontend files
sudo cp -r .next /opt/ananta/frontend/
sudo cp -r public /opt/ananta/frontend/
sudo cp -r node_modules /opt/ananta/frontend/
sudo cp package.json /opt/ananta/frontend/
sudo chown -R $USER:$USER /opt/ananta/frontend

echo "▶️ Starting frontend on port 3011..."
pm2 start ananta-frontend

# Check status
sleep 5
sudo systemctl status ananta-backend
pm2 status

echo "✅ Update completed successfully!"
echo "🌐 Frontend: https://admin.anantalive.com (Port 3011)"
echo "🔧 Backend API: https://admin.anantalive.com/api (Port 8082)"
EOF

chmod +x /home/$USER/update-ananta.sh
```

#### Backup Script
```bash
cat > /home/$USER/backup-ananta.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/$USER/backups"
mkdir -p $BACKUP_DIR

# Database backup
PGPASSWORD=AnantaSecure2024! pg_dump -h localhost -U ananta_user ananta_db > $BACKUP_DIR/ananta_db_$DATE.sql
gzip $BACKUP_DIR/ananta_db_$DATE.sql

# Application backup
tar -czf $BACKUP_DIR/ananta_app_$DATE.tar.gz -C /opt ananta/

# Remove old backups (keep 7 days)
find $BACKUP_DIR -name "ananta_*" -mtime +7 -delete

echo "✅ Backup completed:"
echo "   Database: ananta_db_$DATE.sql.gz"
echo "   Application: ananta_app_$DATE.tar.gz"
EOF

chmod +x /home/$USER/backup-ananta.sh

# Add to crontab for daily backup
(crontab -l 2>/dev/null; echo "0 2 * * * /home/$USER/backup-ananta.sh") | crontab -
```

### **Step 13: Setup Log Rotation**
```bash
sudo tee /etc/logrotate.d/ananta << EOF
/opt/ananta/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 $USER $USER
    postrotate
        systemctl reload ananta-backend
        pm2 reload ananta-frontend
    endscript
}
EOF
```

### **Step 14: Final Testing**
```bash
# Test backend API (port 8082)
curl -X GET http://localhost:8082/health

# Test frontend (port 3011)
curl -X GET http://localhost:3011

# Test admin login API
curl -X POST http://localhost:8082/api/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"Admin@123"}'

# Test via domain
curl -X GET https://admin.anantalive.com/health
curl -X GET https://admin.anantalive.com

# Check all services
sudo systemctl status postgresql ananta-backend nginx
pm2 status

# Check ports (should see 3011 and 8082)
sudo netstat -tlnp | grep -E ':(80|443|3011|5432|8082)'

# View logs
tail -f /opt/ananta/logs/backend.log
tail -f /opt/ananta/logs/frontend.log
```

## 🎉 **DEPLOYMENT COMPLETE!**

Your ANANTA Admin Panel is now live at:
- **URL**: https://admin.anantalive.com
- **Login**: admin@ananta.com
- **Password**: Admin@123

## 🏗️ **Architecture Overview (Port 3011)**
```
Internet → Nginx (Port 80/443) → {
    / → Next.js Frontend (Port 3011)
    /api/ → Spring Boot Backend (Port 8082) → PostgreSQL (Port 5432)
}
```

## 📋 **Quick Management Commands**

```bash
# Check all services status
sudo systemctl status ananta-backend nginx postgresql
pm2 status

# View logs
tail -f /opt/ananta/logs/backend.log          # Backend logs
tail -f /opt/ananta/logs/frontend.log         # Frontend logs (port 3011)
sudo journalctl -u ananta-backend -f          # Backend system logs

# Restart services
sudo systemctl restart ananta-backend         # Restart backend
pm2 restart ananta-frontend                   # Restart frontend (port 3011)
sudo systemctl restart nginx                  # Restart Nginx

# Update application (both frontend + backend)
/home/$USER/update-ananta.sh

# Backup everything
/home/$USER/backup-ananta.sh

# Check SSL certificate
sudo certbot certificates

# PM2 management
pm2 list                                      # List all processes
pm2 logs ananta-frontend                      # View frontend logs (port 3011)
pm2 monit                                     # Monitor processes

# Check if port 3011 is running
sudo netstat -tlnp | grep :3011
curl -X GET http://localhost:3011
```

## ⚠️ **Important Notes:**

1. **Frontend runs on PORT 3011** (instead of default 3000)
2. **Backend runs on PORT 8082** (as specified)
3. **Replace** `https://github.com/yourusername/ananta-app.git` with your actual repository URL
4. **Replace** `your-email@domain.com` with your actual email for SSL certificate
5. **Make sure** your domain `admin.anantalive.com` points to your VPS IP address
6. **Change** the JWT secret in production for security
7. **Nginx proxies** frontend requests to port 3011 and API requests to port 8082

## 🔧 **Service Management**

- **Backend**: Managed by systemd (`ananta-backend.service`) on port 8082
- **Frontend**: Managed by PM2 (`ananta-frontend`) on port 3011
- **Database**: PostgreSQL system service on port 5432
- **Web Server**: Nginx system service on ports 80/443

Your complete ANANTA admin panel is now deployed with **Next.js on port 3011** and **Spring Boot on port 8082**! 🚀
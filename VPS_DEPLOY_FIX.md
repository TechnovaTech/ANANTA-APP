# Fix Image Upload Path on VPS

## Problem
Images were not being saved to VPS because the upload path was incorrect.

## Fix Applied
Changed upload directory from:
```java
Paths.get(System.getProperty("user.dir")).getParent().resolve("public").resolve("uploads")
```

To:
```java
System.getProperty("user.dir") + "/public/uploads"
```

## Deploy to VPS

### 1. Upload the fixed file to VPS
Upload: `adminpanel/backend/src/main/java/com/ananta/admin/controller/AppUserController.java`

### 2. Rebuild backend on VPS
```bash
cd /var/www/ANANTA-APP/adminpanel/backend
mvn clean package -DskipTests
```

### 3. Restart backend service
```bash
# Stop current backend
pkill -f "java.*backend"

# Start backend
nohup java -jar target/backend-0.0.1-SNAPSHOT.jar > backend.log 2>&1 &
```

### 4. Verify upload directory exists
```bash
mkdir -p /var/www/ANANTA-APP/adminpanel/public/uploads
chmod 755 /var/www/ANANTA-APP/adminpanel/public/uploads
```

### 5. Test image upload
- Open mobile app
- Edit profile and upload image
- Check: `/var/www/ANANTA-APP/adminpanel/public/uploads/`
- New images should appear with today's date

## Verify
```bash
# Check if backend is running
ps aux | grep java

# Check backend logs
tail -f /var/www/ANANTA-APP/adminpanel/backend/backend.log

# List recent uploads
ls -lht /var/www/ANANTA-APP/adminpanel/public/uploads/ | head -10
```

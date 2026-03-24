# 🔧 Server Deployment Fix - IST Implementation

## Issue Fixed
Changed `javax.annotation.PostConstruct` to `jakarta.annotation.PostConstruct` for Spring Boot 3.x compatibility.

---

## 📝 What Changed

### File: `AnantaAdminApplication.java`

**Before (Wrong):**
```java
import javax.annotation.PostConstruct;  // ❌ Not available in Spring Boot 3.x
```

**After (Correct):**
```java
import jakarta.annotation.PostConstruct;  // ✅ Correct for Spring Boot 3.x
```

---

## 🚀 Server Deployment Commands

### Step 1: Update the file on server
```bash
cd /var/www/ANANTA-APP/adminpanel/backend/src/main/java/com/ananta/admin
nano AnantaAdminApplication.java
```

**Change line 6 from:**
```java
import javax.annotation.PostConstruct;
```

**To:**
```java
import jakarta.annotation.PostConstruct;
```

Save and exit (Ctrl+X, Y, Enter)

---

### Step 2: Build the project
```bash
cd /var/www/ANANTA-APP/adminpanel/backend
./apache-maven-3.9.6/bin/mvn clean package -DskipTests
```

**Expected Output:**
```
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
```

---

### Step 3: Start the backend
```bash
sudo systemctl start ananta-backend
```

Or if using direct Java:
```bash
nohup java -jar target/admin-backend-0.0.1-SNAPSHOT.jar > backend.log 2>&1 &
```

---

### Step 4: Verify IST is working
```bash
# Check the log for timezone message
tail -f backend.log
```

**Expected Output:**
```
Application timezone set to: Asia/Kolkata
```

Or check systemctl logs:
```bash
sudo journalctl -u ananta-backend -f
```

---

## ✅ Verification Checklist

- [ ] File updated with `jakarta.annotation.PostConstruct`
- [ ] Maven build successful (BUILD SUCCESS)
- [ ] Backend started without errors
- [ ] Log shows: "Application timezone set to: Asia/Kolkata"
- [ ] API endpoints responding correctly

---

## 🔍 Quick Test

Test the API:
```bash
curl http://localhost:8082/api/app/live/list
```

Should return JSON response without errors.

---

## 📋 Complete Server Commands (Copy-Paste)

```bash
# Navigate to backend directory
cd /var/www/ANANTA-APP/adminpanel/backend

# Stop existing backend
sudo systemctl stop ananta-backend
sudo pkill -9 java

# Update the Java file
cd src/main/java/com/ananta/admin
sed -i 's/javax.annotation.PostConstruct/jakarta.annotation.PostConstruct/g' AnantaAdminApplication.java

# Go back to backend root
cd /var/www/ANANTA-APP/adminpanel/backend

# Build
./apache-maven-3.9.6/bin/mvn clean package -DskipTests

# Start backend
sudo systemctl start ananta-backend

# Check logs
sudo journalctl -u ananta-backend -f
```

---

## 🎯 Expected Result

After running these commands, you should see:

```
Application timezone set to: Asia/Kolkata
Started AnantaAdminApplication in X.XXX seconds (JVM running for X.XXX)
```

---

## ⚠️ Troubleshooting

### If build still fails:
```bash
# Check Java version (should be 17)
java -version

# Check Maven version
./apache-maven-3.9.6/bin/mvn -version

# Clean Maven cache
rm -rf ~/.m2/repository
./apache-maven-3.9.6/bin/mvn clean install -DskipTests
```

### If backend won't start:
```bash
# Check if port 8082 is in use
sudo lsof -i :8082

# Kill any process using port 8082
sudo kill -9 $(sudo lsof -t -i:8082)

# Try starting again
sudo systemctl start ananta-backend
```

---

## 📞 Support

If you encounter any issues:

1. Check the build output for errors
2. Check backend logs: `sudo journalctl -u ananta-backend -n 100`
3. Verify Java version: `java -version` (should be 17)
4. Verify Spring Boot version in pom.xml (should be 3.x)

---

**✅ Fix Applied - Ready to Deploy!**

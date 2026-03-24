# 🚀 Quick Fix - One Command

## Copy and paste this on your server:

```bash
cd /var/www/ANANTA-APP/adminpanel/backend && sudo systemctl stop ananta-backend && sudo pkill -9 java && sed -i 's/javax.annotation.PostConstruct/jakarta.annotation.PostConstruct/g' src/main/java/com/ananta/admin/AnantaAdminApplication.java && ./apache-maven-3.9.6/bin/mvn clean package -DskipTests && sudo systemctl start ananta-backend && echo "✅ Backend restarted with IST timezone!" && sudo journalctl -u ananta-backend -f
```

---

## What this does:

1. ✅ Navigates to backend directory
2. ✅ Stops existing backend
3. ✅ Kills any Java processes
4. ✅ Fixes the import statement (javax → jakarta)
5. ✅ Builds the project
6. ✅ Starts the backend
7. ✅ Shows logs

---

## Expected Output:

```
[INFO] BUILD SUCCESS
✅ Backend restarted with IST timezone!
Application timezone set to: Asia/Kolkata
```

---

## If you prefer step-by-step:

```bash
# Step 1: Navigate and stop
cd /var/www/ANANTA-APP/adminpanel/backend
sudo systemctl stop ananta-backend
sudo pkill -9 java

# Step 2: Fix the import
sed -i 's/javax.annotation.PostConstruct/jakarta.annotation.PostConstruct/g' src/main/java/com/ananta/admin/AnantaAdminApplication.java

# Step 3: Build
./apache-maven-3.9.6/bin/mvn clean package -DskipTests

# Step 4: Start
sudo systemctl start ananta-backend

# Step 5: Check logs
sudo journalctl -u ananta-backend -f
```

---

**Press Ctrl+C to exit logs when you see "Application timezone set to: Asia/Kolkata"**

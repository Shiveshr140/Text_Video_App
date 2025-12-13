# Setup HTTPS for Your Backend API

## Option 1: Use Nginx as Reverse Proxy with Let's Encrypt (Recommended)

### Step 1: Install Nginx and Certbot
```bash
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx -y
```

### Step 2: Configure Nginx
Create a config file:
```bash
sudo nano /etc/nginx/sites-available/manim-api
```

Add this configuration (replace `your-domain.com` with your actual domain):
```nginx
server {
    listen 80;
    server_name your-domain.com;  # or your EC2 public IP

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Step 3: Enable the site
```bash
sudo ln -s /etc/nginx/sites-available/manim-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 4: Get SSL Certificate (if you have a domain)
```bash
sudo certbot --nginx -d your-domain.com
```

---

## Option 2: Quick Fix - Use Cloudflare Tunnel (No Domain Needed)

This creates a secure HTTPS tunnel to your backend instantly:

### Step 1: Install Cloudflare Tunnel
```bash
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb
```

### Step 2: Authenticate
```bash
cloudflared tunnel login
```

### Step 3: Create and Run Tunnel
```bash
cloudflared tunnel --url http://localhost:8000
```

This will give you an HTTPS URL like: `https://random-name.trycloudflare.com`

---

## Option 3: Temporary Fix - Allow Mixed Content (NOT RECOMMENDED)

Update your frontend to use a CORS proxy temporarily:

Change API_BASE in App.jsx to:
```javascript
const API_BASE = "https://cors-anywhere.herokuapp.com/http://3.110.209.88:8000";
```

But this is NOT reliable for production.

---

## Recommended Approach:

1. **If you have a domain**: Use Option 1 (Nginx + Let's Encrypt)
2. **No domain**: Use Option 2 (Cloudflare Tunnel) - fastest and free
3. **For testing only**: Use Option 3 (CORS proxy)

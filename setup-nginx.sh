#!/bin/bash
# Setup nginx + SSL for anna.funfiesta.games
# Run on the server as root: sudo bash setup-nginx.sh

DOMAIN="anna.funfiesta.games"
WEB_ROOT="/var/www/anna"
NGINX_CONF="/etc/nginx/sites-available/$DOMAIN"

# 1. Install nginx and certbot if needed
apt update && apt install -y nginx certbot python3-certbot-nginx

# 2. Copy site files
mkdir -p $WEB_ROOT
cp -r /root/anna/* $WEB_ROOT/ 2>/dev/null || echo ">> Copy your site files to $WEB_ROOT manually"
chown -R www-data:www-data $WEB_ROOT

# 3. Create nginx config
cat > $NGINX_CONF << 'EOF'
server {
    listen 80;
    server_name anna.funfiesta.games;

    root /var/www/anna;
    index landing.html index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff2?)$ {
        expires 7d;
        add_header Cache-Control "public, no-transform";
    }
}
EOF

# 4. Enable site
ln -sf $NGINX_CONF /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 5. Test and reload nginx
nginx -t && systemctl reload nginx

# 6. Issue SSL certificate
certbot --nginx -d $DOMAIN --non-interactive --agree-tos --register-unsafely-without-email

# 7. Verify
echo ""
echo "Done! Site live at https://$DOMAIN"

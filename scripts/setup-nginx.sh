#!/usr/bin/env bash
set -euo pipefail

# Setup nginx + SSL for the built Astro site.
# Run on the server as root: sudo bash scripts/setup-nginx.sh

DOMAIN="${DOMAIN:-anna.funfiesta.games}"
APP_ROOT="${APP_ROOT:-/root/anna}"
WEB_ROOT="${WEB_ROOT:-/var/www/anna}"
NGINX_CONF="/etc/nginx/sites-available/$DOMAIN"

apt update
apt install -y nginx certbot python3-certbot-nginx

if [ ! -d "$APP_ROOT/dist" ]; then
  echo "Missing $APP_ROOT/dist"
  echo "Build first: cd $APP_ROOT && npm ci && ASTRO_TELEMETRY_DISABLED=1 npm run build"
  exit 1
fi

mkdir -p "$WEB_ROOT"
find "$WEB_ROOT" -mindepth 1 -maxdepth 1 -exec rm -rf {} +
cp -a "$APP_ROOT/dist/." "$WEB_ROOT/"
chown -R www-data:www-data "$WEB_ROOT"

cat > "$NGINX_CONF" << EOF
server {
    listen 80;
    server_name $DOMAIN;

    root $WEB_ROOT;
    index index.html;

    location / {
        try_files \$uri \$uri/ =404;
    }

    location ~* \.(html)\$ {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    location ~* \.(css|js)\$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location ~* \.(jpg|jpeg|png|gif|ico|svg|webp|woff2?|mp3)\$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
EOF

ln -sf "$NGINX_CONF" /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

nginx -t
systemctl reload nginx

certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --register-unsafely-without-email

echo "Done: https://$DOMAIN"

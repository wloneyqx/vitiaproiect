# Deployment Guide

## DNS

Create these records at your DNS provider:

```text
A     example.md      VPS_PUBLIC_IP
A     www.example.md  VPS_PUBLIC_IP
```

Replace `example.md` in all config files with the real domain.

## First deployment

```bash
git clone YOUR_REPOSITORY_URL /tmp/svidanie_art
cd /tmp/svidanie_art
cp .env.example .env.production
nano .env.production
sudo mkdir -p /var/www/svidanie_art/shared
sudo cp .env.production /var/www/svidanie_art/shared/.env.production
sudo chown svidanie:www-data /var/www/svidanie_art/shared/.env.production
sudo chmod 640 /var/www/svidanie_art/shared/.env.production
```

Copy the Nginx and systemd templates:

```bash
sudo cp deploy/nginx/svidanie-art.conf /etc/nginx/sites-available/svidanie-art
sudo ln -s /etc/nginx/sites-available/svidanie-art /etc/nginx/sites-enabled/svidanie-art
sudo nginx -t
sudo systemctl reload nginx

sudo cp deploy/systemd/svidanie-art.service /etc/systemd/system/svidanie-art.service
sudo systemctl daemon-reload
```

Build and release:

```bash
bash deploy/scripts/deploy.sh
sudo systemctl enable svidanie-art
```

## SSL

```bash
sudo certbot --nginx -d example.md -d www.example.md
sudo certbot renew --dry-run
```


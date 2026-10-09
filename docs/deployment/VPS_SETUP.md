# VPS Setup

Target: Ubuntu LTS on Hostinger, Hetzner, or similar.

## Server packages

```bash
sudo apt update
sudo apt upgrade -y
sudo apt install -y curl git nginx mysql-server ufw certbot python3-certbot-nginx rsync gzip
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node --version
npm --version
```

## System user

```bash
sudo adduser --system --group --home /var/www/svidanie_art svidanie
sudo mkdir -p /var/www/svidanie_art/shared/customer-uploads /var/www/svidanie_art/shared/backups
sudo chown -R svidanie:www-data /var/www/svidanie_art
sudo chmod 750 /var/www/svidanie_art/shared/customer-uploads
```

## Firewall

```bash
sudo ufw allow OpenSSH
sudo ufw allow "Nginx Full"
sudo ufw enable
sudo ufw status
```

Do not open MySQL to the public internet.


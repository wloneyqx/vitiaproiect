# Troubleshooting

## App status

```bash
sudo systemctl status svidanie-art --no-pager
sudo journalctl -u svidanie-art -n 200 --no-pager
curl -i https://example.md/api/health
```

## Nginx

```bash
sudo nginx -t
sudo journalctl -u nginx -n 100 --no-pager
```

## MySQL

```bash
sudo systemctl status mysql --no-pager
mysql -u svidanie_app -p -h 127.0.0.1 svidanie_art -e "SELECT 1;"
```

## Uploads

Check permissions:

```bash
sudo ls -la /var/www/svidanie_art/shared/customer-uploads
sudo chown -R svidanie:www-data /var/www/svidanie_art/shared/customer-uploads
sudo chmod 750 /var/www/svidanie_art/shared/customer-uploads
```


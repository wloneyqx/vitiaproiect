# Backup And Restore

## MySQL backup

Install the backup script:

```bash
sudo cp deploy/scripts/backup-mysql.sh /usr/local/bin/svidanie-backup-mysql
sudo chmod 750 /usr/local/bin/svidanie-backup-mysql
```

Run manually:

```bash
sudo /usr/local/bin/svidanie-backup-mysql
```

Daily cron:

```bash
sudo crontab -e
```

```cron
15 2 * * * /usr/local/bin/svidanie-backup-mysql >> /var/log/svidanie-backup.log 2>&1
```

## Customer image backup

```bash
sudo rsync -a /var/www/svidanie_art/shared/customer-uploads/ /secure-offserver-backup/customer-uploads/
```

## Restore test

Always test restore on a staging database first:

```bash
bash deploy/scripts/restore-mysql.sh /var/www/svidanie_art/shared/backups/mysql/BACKUP.sql.gz
```


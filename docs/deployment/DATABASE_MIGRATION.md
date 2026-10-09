# Database Migration

Important: `database/schema.sql` is destructive because it drops tables. Do not run it against production with customer data.

## Production database

```bash
sudo mysql
```

```sql
CREATE DATABASE IF NOT EXISTS svidanie_art CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'svidanie_app'@'localhost' IDENTIFIED BY 'CHANGE_ME_LONG_PASSWORD';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, REFERENCES ON svidanie_art.* TO 'svidanie_app'@'localhost';
FLUSH PRIVILEGES;
```

For a fresh empty database only, review `database/schema.sql`, remove the `DROP TABLE` block, then run the safe version.

```bash
mysql -u svidanie_app -p svidanie_art < database/schema.sql
```

For an existing database, create versioned `ALTER TABLE` migrations and take a backup first:

```bash
bash deploy/scripts/backup-mysql.sh
mysql -u svidanie_app -p svidanie_art < database/migrations/YYYYMMDD_description.sql
```


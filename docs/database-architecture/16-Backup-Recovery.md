# Backup & Recovery Architecture - Weebster

Data loss in an e-commerce platform results in immediate financial loss and legal liability (lost order records). This document outlines the Disaster Recovery (DR) plan.

---

## 1. Backup Strategy (Hostinger VPS / MySQL)

Since we are managing our own database on a VPS, we cannot rely solely on managed cloud RDS automated backups. We implement a multi-tiered cron-based backup system.

### Tier 1: Daily Logical Backups (Hot Storage)
- **Tool:** `mysqldump`.
- **Frequency:** Nightly (e.g., 03:00 AM IST) during lowest traffic.
- **Destination:** A separate physical block storage volume attached to the VPS.
- **Retention:** 7 days.

### Tier 2: Off-site Snapshots (Cold Storage)
- **Tool:** Custom bash script leveraging `mysqldump` piped to `gzip`.
- **Frequency:** Weekly (Sunday 04:00 AM IST).
- **Destination:** Secure AWS S3 bucket (or equivalent object storage), fully isolated from the Hostinger VPS environment.
- **Retention:** 30 days rolling. 1 snapshot kept permanently for month-end financial archiving.

## 2. Disaster Recovery Plan (RTO & RPO)

- **Recovery Point Objective (RPO):** 24 hours. In the absolute worst-case scenario (total server destruction at 02:59 AM), we lose exactly 1 day of orders. *Mitigation:* We also rely on Razorpay's dashboard as a secondary, immutable ledger for financial transactions to manually reconstruct any lost orders from that 24-hour window.
- **Recovery Time Objective (RTO):** 2 hours. The time it takes to spin up a new VPS, install MySQL, and pipe the latest `.sql.gz` dump back into the database.

## 3. Restore Process (Playbook)

If production data is corrupted (e.g., an admin accidentally drops a critical table):

1. **Halt Operations:** Immediately shut down the Node.js backend to prevent further data mutation or partial order creation.
2. **Isolate:** Rename the corrupted database (e.g., `weebster_corrupted`). Do not delete it, it may be needed for forensics.
3. **Fetch Backup:** Download the most recent verified `.sql.gz` dump.
4. **Restore:** 
   ```bash
   gunzip < backup_latest.sql.gz | mysql -u root -p weebster_prod
   ```
5. **Reconcile:** Cross-reference the Razorpay dashboard for any payments processed between the backup timestamp and the crash timestamp. Manually re-enter those orders into the restored database.
6. **Resume:** Restart the Node.js backend.

## 4. Backup Testing
A backup is useless if it cannot be restored.
- **Rule:** Once a month, the DevOps engineer must pull the latest production backup and attempt to restore it onto a staging server to verify data integrity and calculate actual restore times.

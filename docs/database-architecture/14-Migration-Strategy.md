# Migration Strategy - Weebster

Database schemas evolve. A strict migration strategy ensures that deploying new database structures never results in data loss or application downtime.

---

## 1. Tooling (Prisma Migrate)
Weebster strictly uses **Prisma Migrate** as the source of truth for all schema changes. Direct manipulation of the production MySQL database via GUI tools (like phpMyAdmin or DBeaver) is completely banned.

### Workflow
1. Developer alters `schema.prisma` locally.
2. Developer runs `npx prisma migrate dev --name added_user_phone`.
3. Prisma generates a `.sql` file in the `prisma/migrations` directory representing the exact state change.
4. The SQL file is committed to Git and reviewed via PR.
5. During CI/CD deployment, the pipeline runs `npx prisma migrate deploy` to safely apply the `.sql` files to the production DB in sequence.

## 2. Forward-Only Migrations
Migrations must be written assuming they cannot easily be rolled back.
- **Rule:** Never `DROP COLUMN` if that column currently contains production data being used by a live version of the application.

### The 3-Phase Safe Deployment (Expand & Contract)
If a column needs to be renamed (e.g., `phone` to `phone_number`):
- **Phase 1 (Expand):** Add the new column `phone_number`. Update the application code to write to BOTH columns, but continue reading from `phone`. Deploy.
- **Phase 2 (Migrate Data):** Run a background script to copy old data: `UPDATE users SET phone_number = phone`.
- **Phase 3 (Contract):** Update application code to read strictly from `phone_number`. Deploy. Create a final migration to `DROP COLUMN phone`.

## 3. Rollback Strategy
If a deployment fails catastrophically:
- Do not attempt a "down" migration on production data unless absolutely certain. Down migrations often drop data.
- **Strategy:** Revert the Git commit, generate a NEW migration that restores the database to the previous desired state, and deploy forward.
- **Emergency:** If the database state is corrupted, restore from the last hourly backup (See Backup & Recovery Strategy).

## 4. Data Preservation (Seed Migrations)
Sometimes a migration requires injecting foundational data (e.g., adding a new system-wide Role).
- Write a custom raw SQL file or Prisma script to `INSERT IGNORE` this required data immediately after the schema changes are applied during the CI/CD pipeline.

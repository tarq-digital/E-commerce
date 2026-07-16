# Developer Guidelines (Database) - Weebster

This document translates the Database Architecture into strict rules for backend engineers. All database interactions and Prisma schema updates must adhere to these constraints.

---

## 1. Prisma Schema Rules
- **Formatting:** Run `npx prisma format` before committing.
- **Mapping:** Always use `@map` to map camelCase Prisma fields to `snake_case` database columns.
  ```prisma
  model User {
    id        Int      @id @default(autoincrement())
    firstName String   @map("first_name")
    
    @@map("users") // Maps model to plural snake_case table name
  }
  ```

## 2. Querying Rules
- **No Raw SQL by Default:** Always use Prisma Client (`prisma.user.findMany()`). Only use `$queryRaw` for highly specific performance optimizations or complex aggregates, and ONLY if parameterized.
- **Select Only What's Needed:** Never use `select *` (which is default in Prisma `findMany`) if you only need 2 columns. Massive JSON payloads choke the Node.js event loop.
  ```javascript
  // Bad
  const users = await prisma.user.findMany(); 
  
  // Good
  const users = await prisma.user.findMany({
    select: { id: true, firstName: true }
  });
  ```

## 3. Transaction Rules
- **Financial Operations:** Any operation involving Order Creation, Payment Updates, or Inventory Deduction MUST be wrapped in a Prisma `$transaction`.
- If an order fails to create, the inventory deduction must automatically roll back.

## 4. Soft Delete Implementation
- Never write `prisma.user.delete()`.
- Always write `prisma.user.update({ where: { id }, data: { deletedAt: new Date() } })`.
- Remember to manually add `where: { deletedAt: null }` to all `findMany` queries for soft-deleted tables. (Alternatively, implement a Prisma Client Extension to handle this automatically).

## 5. Definition of Done (Database Tasks)
Before a backend PR involving a database change is approved, the developer must verify:
- [ ] Has a proper Prisma migration been generated and committed?
- [ ] Have I used `@map` to ensure the underlying table is `snake_case`?
- [ ] Did I add appropriate indexes to any new columns I plan to filter or sort by?
- [ ] If I'm adding a new relationship, did I configure the `onDelete` cascade rules correctly?
- [ ] Have I updated the `15-Seed-Data.md` script if this new table requires baseline data?

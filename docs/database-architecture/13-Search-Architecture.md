# Search Architecture (Data Level) - Weebster

This document describes how the database is queried to fulfill user search requests efficiently.

---

## 1. V1 Implementation: MySQL FULLTEXT

For catalogs under ~10,000 products, native MySQL Full-Text search provides a highly performant and cost-effective solution without introducing new infrastructure dependencies.

### Index Creation
```sql
ALTER TABLE products ADD FULLTEXT INDEX product_search_idx (name, description);
```

### Query Execution
When a user searches for "spider man", the backend constructs:
```sql
SELECT id, name, base_price, slug 
FROM products 
WHERE MATCH(name, description) AGAINST('spider man' IN NATURAL LANGUAGE MODE)
AND is_active = TRUE
LIMIT 20;
```
- **NATURAL LANGUAGE MODE:** Automatically handles relevance scoring and ignores common stop-words ("the", "and").
- **BOOLEAN MODE:** Can be utilized if we want to allow users to force inclusion/exclusion (e.g., `+spider -man`).

## 2. Category & Brand Search
Search isn't limited to products. If a user types "Marvel", they should see the Marvel category before seeing individual Marvel toys.
- The `/search/suggest` API performs a highly cached, exact-match `LIKE '%query%'` query against the `categories.name` table. Because the category table is very small (< 100 rows), this is virtually instantaneous.

## 3. V2 Implementation: Elasticsearch / Vector Search (Future Proofing)

As the catalog scales beyond 10,000 products, or if complex typo-tolerance ("spdir man") is required, MySQL FULLTEXT will become a bottleneck.

### Architecture Shift
- **Primary Source of Truth:** MySQL remains the absolute source of truth.
- **Search Index:** A background worker (e.g., Redis Queue) listens for inserts/updates on the `products` table in MySQL and pushes JSON representations of the products to an Elasticsearch cluster or a Vector DB (like Pinecone) for AI-driven semantic search.
- **Query Shift:** The Next.js frontend sends search queries to the Node.js backend -> Backend queries Elasticsearch -> Returns list of Product IDs -> Backend fetches hydrated UI data from MySQL using `WHERE id IN (...)` (if Elasticsearch doesn't store the full UI payload).

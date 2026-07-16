/**
 * Helper to build SQL pagination, sorting, and filtering clauses.
 */
class QueryBuilder {
  constructor(query, queryParams) {
    this.query = query;
    this.queryParams = queryParams;
    this.whereClauses = [];
    this.values = [];
    this.orderBy = "";
    this.limitOffset = "";
  }

  filter(allowedFields) {
    Object.keys(this.queryParams).forEach((key) => {
      if (allowedFields.includes(key) && this.queryParams[key]) {
        this.whereClauses.push(`${key} = ?`);
        this.values.push(this.queryParams[key]);
      }
    });
    return this;
  }

  search(searchFields) {
    if (this.queryParams.search) {
      const searchTerms = searchFields
        .map((field) => `${field} LIKE ?`)
        .join(" OR ");
      this.whereClauses.push(`(${searchTerms})`);
      searchFields.forEach(() => {
        this.values.push(`%${this.queryParams.search}%`);
      });
    }
    return this;
  }

  sort(defaultSort = "created_at DESC") {
    if (this.queryParams.sort) {
      const sortBy = this.queryParams.sort.split(",").join(", ");
      // Prevent SQL Injection by ensuring only safe characters are used
      if (/^[a-zA-Z0-9_, \-]+$/.test(sortBy)) {
        this.orderBy = `ORDER BY ${sortBy}`;
      } else {
        this.orderBy = `ORDER BY ${defaultSort}`;
      }
    } else {
      this.orderBy = `ORDER BY ${defaultSort}`;
    }
    return this;
  }

  paginate() {
    const page = parseInt(this.queryParams.page, 10) || 1;
    const limit = parseInt(this.queryParams.limit, 10) || 10;
    const offset = (page - 1) * limit;

    this.limitOffset = `LIMIT ? OFFSET ?`;
    this.values.push(limit, offset);

    return { page, limit };
  }

  build(includeSoftDeleted = false) {
    if (!includeSoftDeleted) {
      this.whereClauses.push("deleted_at IS NULL");
    }

    const whereString = this.whereClauses.length
      ? `WHERE ${this.whereClauses.join(" AND ")}`
      : "";
    const sql =
      `${this.query} ${whereString} ${this.orderBy} ${this.limitOffset}`.trim();

    return { sql, values: this.values };
  }

  // To get the total count for pagination metadata
  buildCount(includeSoftDeleted = false) {
    const countQuery = this.query.replace(
      /SELECT .* FROM/i,
      "SELECT COUNT(*) as total FROM",
    );
    if (
      !includeSoftDeleted &&
      !this.whereClauses.includes("deleted_at IS NULL")
    ) {
      this.whereClauses.push("deleted_at IS NULL");
    }
    const whereString = this.whereClauses.length
      ? `WHERE ${this.whereClauses.join(" AND ")}`
      : "";

    // We must exclude the limit/offset values from the count query values
    // limit and offset are always the last 2 values if paginate() was called
    const countValues = this.limitOffset
      ? this.values.slice(0, -2)
      : this.values;

    const sql = `${countQuery} ${whereString}`.trim();
    return { sql, values: countValues };
  }
}

module.exports = QueryBuilder;

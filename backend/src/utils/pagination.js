const { DEFAULT_PAGINATION_LIMIT, MAX_PAGINATION_LIMIT } = require('../constants/application');

const getPaginationParams = (query) => {
  const page = parseInt(query.page, 10) || 1;
  let limit = parseInt(query.limit, 10) || DEFAULT_PAGINATION_LIMIT;

  if (limit > MAX_PAGINATION_LIMIT) {
    limit = MAX_PAGINATION_LIMIT;
  }

  const offset = (page - 1) * limit;

  return { page, limit, offset };
};

const formatPaginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  return {
    pagination: {
      total,
      limit,
      page,
      total_pages: totalPages,
      has_next_page: page < totalPages,
      has_prev_page: page > 1,
    }
  };
};

module.exports = {
  getPaginationParams,
  formatPaginationMeta,
};

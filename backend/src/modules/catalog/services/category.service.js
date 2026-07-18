const CategoryRepository = require("../repositories/category.repository");
const AuditRepository = require("../../../database/repositories/audit.repository");
const { generateSlug } = require("../../../utils/slug");
const ApiError = require("../../../utils/api-error");
const httpStatus = require("../../../constants/http-status");

class CategoryService {
  async getCategories(queryParams) {
    return CategoryRepository.findAll(queryParams);
  }

  async getCategoryById(id) {
    const category = await CategoryRepository.findById(id);
    if (!category) {
      throw new ApiError(httpStatus.NOT_FOUND, "Category not found");
    }
    return category;
  }

  async createCategory(data, req) {
    // Generate slug and ensure uniqueness
    const slug = data.slug ? generateSlug(data.slug) : generateSlug(data.name);

    const existing = await CategoryRepository.findBySlug(slug);
    if (existing) {
      throw new ApiError(
        httpStatus.CONFLICT,
        "Category with this slug already exists",
      );
    }

    if (data.parent_id) {
      const parent = await CategoryRepository.findById(data.parent_id);
      if (!parent) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          "Parent category does not exist",
        );
      }
    }

    const category = await CategoryRepository.create({ ...data, slug });
    AuditRepository.logAction(
      req.user.id,
      "CATEGORY_CREATED",
      { category_id: category.id },
      req.ip,
    );

    return category;
  }

  async updateCategory(id, data, req) {
    const category = await this.getCategoryById(id);

    if (data.slug || data.name) {
      data.slug = data.slug
        ? generateSlug(data.slug)
        : generateSlug(data.name || category.name);

      const existing = await CategoryRepository.findBySlug(data.slug);
      if (existing && existing.id !== parseInt(id)) {
        throw new ApiError(
          httpStatus.CONFLICT,
          "Category with this slug already exists",
        );
      }
    }

    if (data.parent_id && data.parent_id === parseInt(id)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Category cannot be its own parent",
      );
    }

    const updated = await CategoryRepository.update(id, data);
    AuditRepository.logAction(
      req.user.id,
      "CATEGORY_UPDATED",
      { category_id: id },
      req.ip,
    );
    return updated;
  }

  async deleteCategory(id, req) {
    await this.getCategoryById(id); // Ensure exists

    // Check if category has children
    const children = await CategoryRepository.findAll({
      parent_id: id,
      limit: 1,
    });
    if (children.data.length > 0) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Cannot delete category with sub-categories. Reassign them first.",
      );
    }

    await CategoryRepository.softDelete(id);
    AuditRepository.logAction(
      req.user.id,
      "CATEGORY_ARCHIVED",
      { category_id: id },
      req.ip,
    );
  }

  async restoreCategory(id, req) {
    // We could add a hard check if it's actually deleted
    const restored = await CategoryRepository.restore(id);
    AuditRepository.logAction(
      req.user.id,
      "CATEGORY_RESTORED",
      { category_id: id },
      req.ip,
    );
    return restored;
  }
}

module.exports = new CategoryService();

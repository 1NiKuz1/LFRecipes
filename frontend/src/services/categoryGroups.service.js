import api from "./api";

class CategoryGroupService {
  async getCategoryGroups() {
    try {
      const result = await api.get("/category-groups");
      return result.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async addCategoryGroup(data) {
    try {
      const result = await api.put("/category-groups", data);
      return result.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateCategoryGroup(id, data) {
    try {
      const result = await api.patch("/category-groups/" + id, data);
      return result.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteCategoryGroup(id) {
    try {
      const result = await api.delete("/category-groups/" + id);
      return result.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default new CategoryGroupService();

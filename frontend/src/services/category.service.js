import api from "./api";

class CategoryService {
  async getCategories() {
    try {
      const result = await api.get("/categories");
      return result.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async addCategory(data) {
    try {
      const result = await api.put("/categories", data);
      return result.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async updateCategory(id, data) {
    try {
      const result = await api.patch("/categories/" + id, data);
      return result.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteCategory(id) {
    try {
      const result = await api.delete("/categories/" + id);
      return result.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default new CategoryService();

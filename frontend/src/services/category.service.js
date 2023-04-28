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
}

export default new CategoryService();

import api from "./api";

class RecipeService {
  //Конвертация изображения
  async convertImage(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const dataUrl = reader.result;
      console.log(dataUrl);
      try {
        return Promise.resolve(dataUrl);
      } catch (error) {
        return Promise.reject(error);
      }
    };
  }

  async addRecipe(data) {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(data.img);
      reader.onload = async () => {
        data.img = reader.result;
        try {
          return await api.post("/recipes", data);
        } catch (error) {
          return Promise.reject(error);
        }
      };
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getRecipes() {
    try {
      const result = await api.get("/recipes");
      return result.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getRecipeCategories() {
    try {
      const result = await api.get("/recipes/categories");
      return result.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  //Проверка ответа с сервера на наличие изображения
  async getImage(id) {
    try {
      const result = await api.get(`/recipes/get-image/${id}`);
      return result.data;
    } catch (error) {
      return null;
    }
  }
}

export default new RecipeService();

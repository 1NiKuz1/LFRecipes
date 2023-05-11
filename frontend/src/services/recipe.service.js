import api from "./api";
import axios from "axios";

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

  async updateRecipe(id_recipe, id_user, data) {
    try {
      if (!data.img)
        return await api.patch(`/recipe/${id_recipe}/${id_user}`, data);
      const reader = new FileReader();
      reader.readAsDataURL(data.img);
      reader.onload = async () => {
        data.img = reader.result;
        try {
          return await api.patch(`/recipe/${id_recipe}/${id_user}`, data);
        } catch (error) {
          return Promise.reject(error);
        }
      };
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async addFavoriteRecipe(data) {
    try {
      return await api.post("/recipes/favorite-recipe/", data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteFavoriteRecipe(data) {
    try {
      return await api.delete(
        `/recipes/favorite-recipe/${data.id_user}/${data.id_recipe}`
      );
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteRecipe(id_recipe, id_user) {
    try {
      return await api.delete(`/recipe/${id_recipe}/${id_user}`);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getFavoriteRecipes(id) {
    try {
      const result = await api.get("/recipes/favorite-recipe/" + id);
      return result.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getRecipes(data) {
    try {
      const result = await api.get(`/recipes`, {
        params: {
          limit: data.limit,
          page: data.page,
          name: data.name,
          sort: data.sort,
          filters: data.filters,
          sortParam: data.sortParam,
        },
      });
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getUserRecipes(data) {
    try {
      const result = await api.get(`/recipes/user-recipes`, {
        params: {
          limit: data.limit,
          page: data.page,
          id_user: data.id_user,
        },
      });
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getUserFavoriteRecipes(data) {
    try {
      const result = await api.get(`/recipes/user-favorite-recipes`, {
        params: {
          limit: data.limit,
          page: data.page,
          id_user: data.id_user,
        },
      });
      return result;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async getRecipe(id) {
    try {
      const result = await api.get(`/recipe/${id}`);
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

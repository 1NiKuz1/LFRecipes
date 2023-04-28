import { ref, computed, reactive, readonly } from "vue";
import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import RecipeService from "@/services/recipe.service.js";

export const useRecipeStore = defineStore("recipe", () => {
  const auth = useAuthStore();
  const { userData } = auth;
  const recipes = ref([]);
  const recipeCategories = ref([]);

  function $reset() {
    recipes.value = [];
    recipeCategories.value = [];
  }

  async function addRecipe(data) {
    if (!userData.status.loggedIn) return;
    try {
      return await RecipeService.addRecipe(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async function getRecipes() {
    if (!userData.status.loggedIn) return;
    try {
      recipes.value = await RecipeService.getRecipes();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async function getRecipeCategories() {
    if (!userData.status.loggedIn) return;
    try {
      recipeCategories.value = await RecipeService.getRecipeCategories();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  return {
    recipes,
    recipeCategories,
    $reset,
    getRecipes,
    getRecipeCategories,
    addRecipe,
  };
});

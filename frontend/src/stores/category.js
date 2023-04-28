import { ref, computed, reactive, readonly } from "vue";
import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import CategoryService from "@/services/category.service.js";

export const useCategoryStore = defineStore("category", () => {
  const auth = useAuthStore();
  const { userData } = auth;
  const categories = ref([]);

  function $reset() {
    categories.value = [];
  }

  async function getCategories() {
    if (!userData.status.loggedIn) return;
    try {
      categories.value = await CategoryService.getCategories();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  return {
    categories,
    $reset,
    getCategories,
  };
});

import { ref, computed, reactive, readonly } from "vue";
import { defineStore } from "pinia";
import CategoryService from "@/services/category.service.js";

export const useCategoryStore = defineStore("category", () => {
  const categories = ref([]);

  function $reset() {
    categories.value = [];
  }

  async function getCategories() {
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

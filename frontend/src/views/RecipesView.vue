<template>
  <section class="recipes">
    <div class="container-md">
      <h1>Ищите интерисующие вас рецепты</h1>
      <p class="desc">
        Здесь вы сможете просматреть рецепты пользуясь фильтрами по разным
        категориям и сортировкой.
      </p>
      {{ filteredRecipes }}
      <form @submit.prevent class="form-filters">
        <input v-model="searchInput" type="text" placeholder="Поиск..." />
        <select v-model="sortSelect">
          <option value="name">Название</option>
          <option value="date-added">Дата добавления</option>
        </select>
        <img
          src="../assets/images/filter.svg"
          class="form-filters__filter"
          alt="Filter"
          @click="isShowCategories = !isShowCategories"
        />
      </form>

      <div class="row">
        <div class="col-md-3" v-show="isShowCategories">
          <category-filter :selectedСategories="selectedCategories" />
        </div>

        <div class="col-md-9">
          <template v-if="recipes.length">
            <recipe-cards
              class="recipes-offset"
              :recipes="recipes"
            ></recipe-cards>
          </template>
          <p v-else>Рецепты не найдены...</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import CategoryFilter from "@/components/CategoryFilter.vue";
import RecipeCards from "@/components/RecipeCards.vue";
import { storeToRefs } from "pinia";
import { useRecipeStore } from "@/stores/recipe";
import { useCategoryStore } from "@/stores/category";
export default {
  components: {
    CategoryFilter,
    RecipeCards,
  },
  setup() {
    const recipe = useRecipeStore();
    const category = useCategoryStore();
    const { getRecipes, getRecipeCategories } = recipe;
    const { recipes, recipeCategories } = storeToRefs(recipe);
    const { getCategories } = category;
    const { categories } = storeToRefs(category);
    return {
      categories,
      getCategories,
      getRecipeCategories,
      recipes,
      recipeCategories,
      getRecipes,
    };
  },
  data() {
    return {
      searchInput: "",
      sortSelect: "name",
      selectedCategories: [],
      isShowCategories: true,
    };
  },
  computed: {
    filteredRecipes() {
      if (!this.selectedCategories.length) return this.recipes;
      const filteredRecipeCategories = this.recipeCategories
        .filter((row) => {
          return this.selectedCategories.includes(row.id_category);
        })
        .map((item) => item.id_recipe);
      console.log(filteredRecipeCategories);
      //return this.recipes.filter((recipe) => {
      //  return filteredRecipeCategories.includes(recipe.id);
      //});
      return this.recipes;
    },
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      if (!this.categories.lenght) await this.getCategories();
      if (!this.recipes.lenght) await this.getRecipes();
      if (!this.recipeCategories.lenght) await this.getRecipeCategories();
    },
  },
  watch: {
    selectedCategories: {
      handler(newValue, oldValue) {
        console.log(this.selectedCategories);
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.recipes {
  margin-bottom: 150px;
}

select {
  padding: 2px 15px;
  border-radius: 30px;
}

input {
  padding: 2px 15px;
  border: 1px solid var(--color-light-black);
  border-radius: 30px;
}

.form-filters__filter {
  cursor: pointer;
}

.desc {
  margin-bottom: 90px;
}

.recipes-offset {
  margin-top: 54px;
}

.form-filters {
  display: flex;
  gap: 20px;
  margin-bottom: 50px;
  flex-wrap: wrap;
}
</style>

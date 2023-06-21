<template>
  <section class="recipes">
    <div class="container-md">
      <h1>Ищите интересующие вас рецепты</h1>
      <p class="desc">
        Здесь вы сможете просматреть рецепты пользуясь фильтрами по разным
        категориям и сортировкой.
      </p>
      <form @submit.prevent class="form-filters">
        <input v-model="searchInput" type="text" placeholder="Поиск..." />
        <select v-model="sortSelect">
          <option v-for="sort in sorts" :key="sort.name" :value="sort">
            {{ sort.name }}
          </option>
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

        <div class="offset-md-1 col-md-8">
          <template v-if="recipes.length">
            <recipe-cards
              class="recipes-offset"
              :recipes="recipes"
            ></recipe-cards>
          </template>
          <p v-else>Рецепты не найдены...</p>
          <main-pagination
            class="pagination"
            v-model:page="page"
            :countOfRecords="countOfRecords"
            :limit="limit"
          ></main-pagination>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import CategoryFilter from "@/components/CategoryFilter.vue";
import RecipeCards from "@/components/RecipeCards.vue";
import MainPagination from "@/components/MainPagination.vue";
import RecipeService from "@/services/recipe.service.js";
import { storeToRefs } from "pinia";
import { useRecipeStore } from "@/stores/recipe";
import { useCategoryStore } from "@/stores/category";
export default {
  components: {
    CategoryFilter,
    RecipeCards,
    MainPagination,
  },

  setup() {
    const recipe = useRecipeStore();
    const category = useCategoryStore();
    const { getRecipeCategories } = recipe;
    const { recipeCategories } = storeToRefs(recipe);
    const { getCategories } = category;
    const { categories } = storeToRefs(category);

    const sorts = [
      {
        name: "По названию",
        sort: "name",
        sortParam: "asc",
      },
      {
        name: "По названию (убывание)",
        sort: "name",
        sortParam: "desc",
      },
      {
        name: "По дате добавления",
        sort: "created_at",
        sortParam: "asc",
      },
      {
        name: "По дате добавления (убывание)",
        sort: "created_at",
        sortParam: "desc",
      },
    ];

    return {
      categories,
      getCategories,
      getRecipeCategories,
      recipeCategories,
      sorts,
    };
  },

  data() {
    return {
      searchInput: "",
      sortSelect: this.sorts[0],
      recipes: [],
      selectedCategories: [],
      isShowCategories: true,
      limit: 5,
      page: 1,
      countOfRecords: 0,
    };
  },

  mounted() {
    this.loadData();
  },

  methods: {
    async loadData() {
      if (!this.categories.lenght) await this.getCategories();
      if (!this.recipeCategories.lenght) await this.getRecipeCategories();
      await this.loadRecipes();
    },

    async loadRecipes() {
      try {
        const data = {
          name: this.searchInput,
          page: this.page,
          limit: this.limit,
          sort: this.sortSelect.sort,
          sortParam: this.sortSelect.sortParam,
          filters: this.selectedCategories,
        };
        const result = await RecipeService.getRecipes(data);
        this.countOfRecords = +result.headers["x-total-count"];
        this.recipes = result.data;
      } catch (error) {
        console.log(error);
      }
    },
  },

  watch: {
    sortSelect() {
      this.loadRecipes();
    },

    searchInput() {
      this.loadRecipes();
    },

    page() {
      this.loadRecipes();
    },

    selectedCategories: {
      handler() {
        this.loadRecipes();
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

.pagination {
  margin-top: 60px;
}
</style>

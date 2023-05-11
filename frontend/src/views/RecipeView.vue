<template>
  <section class="recipe">
    <div class="container">
      <h1>{{ recipe.name }}</h1>
      <div class="recipe__content-wrapper">
        <iframe
          width="560"
          height="315"
          :src="videLink"
          frameborder="0"
          allowfullscreen
        ></iframe>
        <p>{{ recipe.description }}</p>
        <p>Список категорий: {{ recipe?.categories?.join(", ") }}</p>
        <p>
          Добавлен пользователем:
          <span class="recipe__accent-content">{{ recipe.user_login }}</span>
        </p>
        <p>
          Дата добавления:
          <span class="recipe__accent-content"
            >{{
              recipe?.created_at?.slice(0, 10).split("-").reverse().join("-")
            }}
          </span>
        </p>
        <div v-if="userData.status.loggedIn" class="recipe__edit-wrapper">
          <button v-if="!isFavoriteRecipe" @click="handlerAddFavoriteRecipe">
            Добавить в избранное
          </button>
          <button v-else @click="handlerDeleteFavoriteRecipe">
            Удалить из избранного
          </button>
          <template v-if="isShowControll">
            <button @click="$router.push(`/update-recipe/${recipe.id}`)">
              Изменить
            </button>
            <button @click="handlerDeleteRecipe">Удалить</button>
          </template>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import RecipeService from "@/services/recipe.service.js";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";
export default {
  setup() {
    const auth = useAuthStore();
    const { userData, userFavoriteRecipes } = storeToRefs(auth);
    const { getUserFavoriteRecipes } = auth;
    return {
      userData,
      userFavoriteRecipes,
      getUserFavoriteRecipes,
    };
  },

  data() {
    return {
      recipe: {},
    };
  },

  mounted() {
    if (this.userData.status.loggedIn) this.getUserFavoriteRecipes();
    RecipeService.getRecipe(this.$route.params.id)
      .then((res) => {
        this.recipe = res;
      })
      .catch((error) => console.log(error));
  },

  computed: {
    videLink() {
      const videoId = this.recipe?.video_link
        ?.replace("https://www.youtube.com/", "")
        .split("=")[1];
      return "https://www.youtube.com/embed/" + videoId;
    },

    isFavoriteRecipe() {
      return this.userFavoriteRecipes.includes(this.recipe.id);
    },

    isShowControll() {
      return (
        this.userData.user.id === this.recipe.id_user ||
        this.userData.user.role !== "user"
      );
    },
  },

  methods: {
    async handlerAddFavoriteRecipe() {
      try {
        await RecipeService.addFavoriteRecipe({
          id_user: this.userData.user.id,
          id_recipe: this.recipe.id,
        });
        await this.getUserFavoriteRecipes();
      } catch (error) {
        console.log(error);
      }
    },

    async handlerDeleteFavoriteRecipe() {
      try {
        await RecipeService.deleteFavoriteRecipe({
          id_user: this.userData.user.id,
          id_recipe: this.recipe.id,
        });
        await this.getUserFavoriteRecipes();
      } catch (error) {
        console.log(error);
      }
    },

    async handlerDeleteRecipe() {
      try {
        if (confirm("Удалить рецепт?")) {
          await RecipeService.deleteRecipe(this.recipe.id, this.recipe.id_user);
          this.$router.push("/recipes");
        }
      } catch (error) {
        console.log(error);
      }
    },
  },
};
</script>

<style scoped>
.recipe {
  margin-bottom: 150px;
}
h1 {
  text-align: left;
  margin-bottom: 60px;
}

.recipe__accent-content {
  color: var(--color-accent);
}

.recipe__edit-wrapper {
  display: flex;
  gap: 20px;
}

button {
  padding: 10px 28px;
  line-height: 1;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 500;
  color: var(--color-white);
  background: var(--color-accent);
}

button:disabled {
  color: var(--color-white);
  background: var(--color-accent-disabled);
}
</style>

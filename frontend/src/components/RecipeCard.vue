<template>
  <div class="recipe-card">
    <img :src="imageSrc" alt="Recipe" class="recipe-card__img" />
    <div class="recipe-card__content-wrapper">
      <h3>{{ recipe.name }}</h3>
      <p>
        {{ recipe.description }}
      </p>
    </div>
  </div>
</template>

<script>
import RecipeService from "@/services/recipe.service.js";
export default {
  name: "recipe-card",
  props: {
    recipe: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  data() {
    return {
      imageSrc: `http://localhost:5000/api/recipes/get-image/${this.recipe.id}`,
    };
  },
};
</script>

<style scoped>
.recipe-card {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
.recipe-card__img {
  height: 160px;
  width: 230px;
  object-fit: cover;
  border-radius: 30px;
}
.recipe-card__content-wrapper {
  max-width: 400px;
}

@media (max-width: 991px) {
  .recipe-card__img {
    height: 160px;
    width: 300px;
  }
}
</style>

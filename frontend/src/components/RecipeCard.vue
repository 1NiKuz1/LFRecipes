<template>
  <div class="recipe-card" @click="$router.push(`/recipe/${recipe.id}`)">
    <img :src="imageSrc" alt="Recipe" class="recipe-card__img" />
    <div class="recipe-card__content-wrapper">
      <h3>{{ recipe.name }}</h3>
      <p>
        {{
          recipe.description.length > 150
            ? recipe.description.slice(0, 150) + "..."
            : recipe.description
        }}
      </p>
      <p>
        Дата добавления:
        <span class="recipe-card__date">{{
          recipe.created_at.slice(0, 10).split("-").reverse().join("-")
        }}</span>
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
  box-sizing: content-box;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  cursor: pointer;
  transition: padding 0.25s ease-out;
}

.recipe-card:hover h3 {
  transition: color 0.25s ease-out;
}

.recipe-card:hover,
.recipe-card:focus {
  padding-left: 20px;
  border-left: 5px solid var(--color-accent);
}

.recipe-card:hover h3 {
  color: var(--color-accent);
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

.recipe-card__date {
  color: var(--color-accent);
}

p {
  margin-bottom: 10px;
}

.recipe-card__content-wrapper p:last-child {
  margin-bottom: 0;
}

@media (max-width: 991px) {
  .recipe-card__img {
    height: 160px;
    width: 300px;
  }
}
</style>

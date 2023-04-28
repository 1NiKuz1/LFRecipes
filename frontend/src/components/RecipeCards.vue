<template>
  <div class="recipe-cards recipes-offset">
    <recipe-card
      v-for="recipe in recipes"
      :key="recipe.id"
      :recipe="recipe"
    ></recipe-card>
  </div>
</template>

<script>
import RecipeCard from "@/components/RecipeCard.vue";
export default {
  name: "recipe-cards",
  components: {
    RecipeCard,
  },
  props: {
    recipes: {
      type: Array,
      default: () => [],
      required: true,
    },
  },
};
</script>

<style scoped>
.recipe-cards {
  display: flex;
  gap: 20px;
  flex-direction: column;
}
</style>

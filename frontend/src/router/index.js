import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import PersonView from "@/views/PersonView.vue";
import FogortPasswordView from "@/views/FogortPasswordView.vue";
import ChangePasswordView from "@/views/ChangePasswordView.vue";
import AboutView from "@/views/AboutView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import AddRecipeView from "@/views/AddRecipeView.vue";
import UpdateRecipeView from "@/views/UpdateRecipeView.vue";
import RecipesView from "@/views/RecipesView.vue";
import RecipeView from "@/views/RecipeView.vue";
import AdminView from "@/views/AdminView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/person",
      name: "person",
      component: PersonView,
    },
    {
      path: "/fogort-password",
      name: "fogort-password",
      component: FogortPasswordView,
    },
    {
      path: "/change-password",
      name: "change-password",
      component: ChangePasswordView,
    },
    {
      path: "/about",
      name: "about",
      component: AboutView,
    },
    {
      path: "/add-recipe",
      name: "add-recipe",
      component: AddRecipeView,
    },
    {
      path: "/update-recipe/:id",
      name: "update-recipe",
      component: UpdateRecipeView,
    },
    {
      path: "/recipes",
      name: "recipes",
      component: RecipesView,
    },
    {
      path: "/recipe/:id",
      name: "recipe",
      component: RecipeView,
    },
    {
      path: "/admin",
      name: "admin",
      component: AdminView,
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: NotFoundView,
    },
  ],
});

export default router;

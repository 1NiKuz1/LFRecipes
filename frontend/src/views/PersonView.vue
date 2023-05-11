<template>
  <section class="profile">
    <div class="container">
      <h1>Личный кабинет</h1>
      <div class="profile__forms-wrapper">
        <form @submit.prevent class="file-upload">
          <label>
            <input
              name="file"
              type="file"
              ref="imageInput"
              @change="uploadImage"
            />
          </label>
          <img
            :src="this.userData.imageUrl"
            v-if="this.userData.imageUrl"
            alt="Avatar"
          />
        </form>
        <form @submit.prevent class="form-login">
          <label for="login">Логин</label>
          <input v-model="login" type="text" name="login" />
          <button
            v-if="login != userData.user.username"
            class="button"
            @click="handelerChangeLogin"
          >
            Сохранить
          </button>
        </form>
      </div>
      <div class="profile__recipes-wrapper">
        <div class="tab-menu">
          <button
            v-for="tab in tabs"
            :key="tab.name"
            @click="handlerTab(tab)"
            class="tab-menu__button"
            :class="tab.isSelected ? 'tab-menu__button--active' : ''"
          >
            {{ tab.name }}
          </button>
        </div>
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
  </section>
</template>

<script>
import CategoryFilter from "@/components/CategoryFilter.vue";
import RecipeCards from "@/components/RecipeCards.vue";
import MainPagination from "@/components/MainPagination.vue";
import RecipeService from "@/services/recipe.service.js";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
export default {
  components: {
    RecipeCards,
    MainPagination,
  },

  setup() {
    const user = useUserStore();
    const { uploadImage, getImage, updateUser } = user;
    const { userData } = storeToRefs(user);
    return {
      userData,
      uploadImage,
      getImage,
      updateUser,
    };
  },

  data() {
    return {
      tabs: [
        {
          name: "Добавленные",
          isSelected: true,
        },
        {
          name: "Избранные",
          isSelected: false,
        },
      ],
      login: this.userData.user.username,
      recipes: [],
      limit: 10,
      page: 1,
      countOfRecords: 0,
    };
  },

  mounted() {
    if (!this.userData.user) {
      this.$router.push("/");
    }
    this.getImage();
    this.loadRecipes();
  },

  methods: {
    async uploadImage() {
      if (!this.userData.user) return;
      const input = this.$refs.imageInput;
      const file = input.files[0];
      await this.uploadImage(file, this.userData.user.id);
      this.userData.imageUrl =
        "http://localhost:5000/api/user/get-image/" + this.userData.user.id;
      setTimeout(() => {
        location.reload();
      }, 300);
    },

    async loadRecipes() {
      try {
        const data = {
          page: this.page,
          limit: this.limit,
          id_user: this.userData.user.id,
        };
        let result = [];
        if (this.tabs[0].isSelected)
          result = await RecipeService.getUserRecipes(data);
        else if (this.tabs[1].isSelected)
          result = await RecipeService.getUserFavoriteRecipes(data);
        this.countOfRecords = +result.headers["x-total-count"];
        this.recipes = result.data;
      } catch (error) {
        console.log(error);
      }
    },

    async handlerTab(tab) {
      this.tabs.forEach((el) => {
        el.isSelected = false;
        if (el.name === tab.name) el.isSelected = true;
      });
    },

    async handelerChangeLogin() {
      await this.updateUser(this.userData.user.id, { login: this.login });
    },
  },

  watch: {
    tabs: {
      handler() {
        this.loadRecipes();
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
.tab-menu {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}
.tab-menu__button {
  font-weight: 500;
  padding-bottom: 3px;
  border-bottom: 3px solid transparent;
  transition: border-bottom 0.25s ease-out;
}
.tab-menu__button:hover,
.tab-menu__button--active {
  border-bottom: 3px solid var(--color-accent);
}

h1 {
  text-align: center;
  margin-bottom: 60px;
}

.profile {
  margin-bottom: 150px;
}

.profile__forms-wrapper {
  display: flex;
  justify-content: start;
  flex-wrap: wrap;
  gap: 20px;
}

.form-login {
  flex: 4 1 auto;
}

.file-upload {
  flex: 1 1 auto;
}

.profile__recipes-wrapper {
  margin-top: 100px;
}

.form-login {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.file-upload input[type="file"] {
  display: none;
}

.file-upload {
  position: relative;
  height: 100px;
  min-width: 100px;
}

.file-upload img {
  display: block;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  width: 100px;
  height: 100px;
  overflow: hidden;
  border-radius: 30px;
  z-index: 1;
}

.file-upload label::before {
  content: "";
  position: absolute;
  display: block;
  top: 0;
  left: 0;
  width: 100px;
  height: 100px;
  overflow: hidden;
  border-radius: 30px;
  background: #000;
  opacity: 0;
  z-index: 10;
  transition: opacity 0.25s ease-out;
}

.file-upload label:hover::before {
  opacity: 0.3;
}

.file-upload label {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  background: transparent;
  z-index: 2;
}

input {
  margin-top: 10px;
  padding: 2px 15px;
  border: 1px solid var(--color-light-black);
  border-radius: 30px;
}

.button {
  margin-top: 30px;
  padding: 10px 28px;
  line-height: 1;
  border-radius: 30px;
  font-size: 16px;
  font-weight: 500;
  color: var(--color-white);
  background: var(--color-accent);
}

.button:disabled {
  color: var(--color-white);
  background: var(--color-accent-disabled);
}

@media (max-width: 991px) {
  .form-login {
    flex: 1 1 auto;
  }
}
</style>

<template>
  <section class="not-found">
    <div class="container">
      <h1>Добавить рецепт</h1>
      <div class="add-recipe">
        <Form
          @submit="handleAddRecipe"
          :validation-schema="schema"
          class="add-recipe-form"
        >
          <div class="add-recipe-form__content-wrapper">
            <label for="name">Название рецепта</label>
            <Field
              class="add-recipe-form__form-input"
              type="text"
              name="name"
            ></Field>
            <ErrorMessage name="name" class="add-recipe-form__error" />

            <label for="video_link">Ссылка на видео с рецептом</label>
            <Field
              class="add-recipe-form__form-input"
              type="text"
              name="video_link"
            ></Field>
            <ErrorMessage name="video_link" class="add-recipe-form__error" />

            <label for="description">Описание</label>
            <Field
              as="textarea"
              class="add-recipe-form__form-input"
              name="description"
              rows="3"
            />
            <ErrorMessage name="description" class="add-recipe-form__error" />

            <label for="categories">Категории</label>
            <Field
              as="select"
              name="categories"
              class="add-recipe-form__form-select"
              multiple
            >
              <optgroup
                v-for="[groupKey, groupValue] of Object.entries(groups)"
                :key="groupKey"
                :label="groupKey"
              >
                <option
                  v-for="category of groupValue.categories"
                  :key="category.id"
                  :value="category.id"
                >
                  {{ category.category_name }}
                </option>
              </optgroup>
            </Field>
            <p v-if="errorCategories" class="add-recipe-form__error">
              {{ errorCategories }}
            </p>

            <label for="image">Изображение</label>
            <input
              type="file"
              name="image"
              ref="image"
              accept="image/png, image/jpeg, image/jpg"
            />
            <p v-if="errorImage" class="add-recipe-form__error">
              {{ errorImage }}
            </p>
          </div>
          <div class="add-recipe-form__butn-wrapper">
            <form-button :disabled="isLoading">Добавить</form-button>
          </div>
        </Form>
      </div>
    </div>
  </section>
</template>

<script>
import FormInput from "@/components/UI/FormInput.vue";
import FormButton from "@/components/UI/FormButton.vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";
import { useRecipeStore } from "@/stores/recipe";
import { useCategoryStore } from "@/stores/category";
export default {
  name: "add-recipeorization-form",
  components: {
    FormInput,
    FormButton,
    Form,
    Field,
    ErrorMessage,
  },
  setup() {
    const auth = useAuthStore();
    const recipe = useRecipeStore();
    const category = useCategoryStore();
    const { userData } = storeToRefs(auth);
    const { addRecipe } = recipe;
    const { getCategories } = category;
    const { categories } = storeToRefs(category);
    return {
      userData,
      addRecipe,
      categories,
      getCategories,
    };
  },
  data() {
    return {
      groups: {},
      isLoading: false,
      errorCategories: "",
      errorImage: "",
    };
  },
  computed: {
    schema() {
      return yup.object({
        name: yup.string().trim().required("Обязательное поле"),
        video_link: yup.string().trim().max(500).required("Обязательное поле"),
        description: yup.string().trim().required("Обязательное поле"),
      });
    },
  },
  mounted() {
    if (!this.userData.status.loggedIn) this.$router.push("/");
    this.loadData();
  },
  methods: {
    async loadData() {
      if (!this.categories.lenght) await this.getCategories();
      this.loadGroups();
    },

    loadGroups() {
      try {
        // Преобразуем категории в другую структуру для удобной отрисовки
        this.groups = this.categories.reduce((acc, category) => {
          if (category.group_name) {
            if (!acc[category.group_name]) {
              acc[category.group_name] = {
                categories: [],
              };
            }
            acc[category.group_name].categories.push(category);
          } else {
            if (!acc["другие"]) {
              acc["другие"] = {
                categories: [],
              };
            }
            acc["другие"].categories.push(category);
          }
          return acc;
        }, {});
      } catch (error) {
        console.log(error);
      }
    },

    async handleAddRecipe(values) {
      this.errorCategories = "";
      this.errorImage = "";
      if (!values.categories) {
        this.errorCategories = "Нужно выбрать хотя бы одну категорию";
        return;
      }
      values.img = this.$refs.image.files[0];
      if (!values.img) {
        this.errorImage = "Необходимо добавить изображение";
        return;
      }
      const fileFormats = ["png", "jpg", "jpeg", "svg"];
      const fromatOfFile = values.img.name.split(".").at(-1);
      if (!fileFormats.includes(fromatOfFile)) {
        this.errorImage = "Формат не поддерживается";
        return;
      }
      values.id_user = this.userData.user.id;
      this.isLoading = true;
      try {
        await this.addRecipe(values);
        this.errorCategories = "";
        this.errorImage = "";
        this.$router.push("/recipes");
      } catch (error) {
        console.log(error);
      }
      this.isLoading = false;
    },
  },
};
</script>

<style scoped>
h1 {
  margin-bottom: 60px;
}
.add-recipe {
  display: flex;
  justify-content: center;
  margin-bottom: 150px;
}
.add-recipe-form {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
}

.add-recipe-form__fogort-wrapper {
  display: flex;
  justify-content: space-between;
}
.add-recipe-form__fogort-wrapper button {
  color: var(--color-accent);
}

.add-recipe-form__error {
  color: red;
}
.add-recipe-form__content-wrapper {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}
.add-recipe-form__form-input {
  padding: 2px 10px;
  border: 1px solid var(--color-light-black);
  border-radius: 8px;
  margin: 5px 0;
}
.add-recipe-form__butn-wrapper {
  display: flex;
  gap: 20px;
  margin-top: 30px;
}

.add-recipe-form__form-select {
  padding: 10px 15px;
  border: 1px solid var(--color-light-black);
  border-radius: 8px;
  margin: 5px 0;
}

label {
  font-weight: 500;
  margin-top: 5px;
}

option {
  padding: 5px 0;
  padding-left: 20px;
}

optgroup {
  padding: 5px 0;
}

button:disabled {
  background-color: red;
}
</style>

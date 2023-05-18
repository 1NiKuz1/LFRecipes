<template>
  <Form
    @submit="handlerAddCategory"
    :validation-schema="schema"
    class="add-form"
  >
    <h3>Добавление</h3>
    <div class="add-form__content-wrapper">
      <label for="category_name">Название</label>
      <Field
        class="add-form__form-input"
        type="text"
        name="category_name"
        maxlength="100"
      ></Field>
      <ErrorMessage name="category_name" class="add-form__error" />

      <label for="id_category_group">Группы категорий</label>
      <Field as="select" name="id_category_group" class="add-form__form-select">
        <option
          v-for="categoryGroup of categoryGroups"
          :key="categoryGroup.id"
          :value="categoryGroup.id"
        >
          {{ categoryGroup.group_name }}
        </option>
      </Field>
    </div>
    <div v-if="errorMessage" class="alert alert-danger" role="alert">
      {{ errorMessage }}
    </div>
    <div class="add-form__butn-wrapper">
      <form-button :disabled="isLoading">Добавить</form-button>
    </div>
  </Form>
</template>

<script>
import FormInput from "@/components/UI/FormInput.vue";
import FormButton from "@/components/UI/FormButton.vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import CategoryService from "@/services/category.service.js";
import CategoryGroupService from "@/services/categoryGroups.service.js";
export default {
  name: "form-add-category",

  components: {
    FormInput,
    FormButton,
    Form,
    Field,
    ErrorMessage,
  },

  emits: ["hideDialog"],

  data() {
    return {
      categoryGroups: null,
      errorMessage: "",
      isLoading: false,
    };
  },

  computed: {
    schema() {
      return yup.object({
        category_name: yup.string().trim().required("Обязательное поле"),
      });
    },
  },

  mounted() {
    this.LoadCategoryGroups();
  },

  methods: {
    async LoadCategoryGroups() {
      this.categoryGroups = await CategoryGroupService.getCategoryGroups();
      this.categoryGroups.unshift({ id: null, group_name: "Без группы" });
    },

    async handlerAddCategory(values) {
      if (!values.id_category_group) values.id_category_group = null;
      this.isLoading = true;
      this.errorMessage = "";
      try {
        await CategoryService.addCategory(values);
        this.$emit("hideDialog");
      } catch (error) {
        this.errorMessage = error;
      }
      this.isLoading = false;
    },
  },
};
</script>

<style scoped>
.add-form {
  display: flex;
  flex-direction: column;
  margin-top: 30px;
}

.add-form__error {
  color: red;
}
.add-form__content-wrapper {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}
.add-form__form-input {
  padding: 2px 10px;
  border: 1px solid var(--color-light-black);
  border-radius: 8px;
  margin: 5px 0;
}
.add-form__butn-wrapper {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}

.add-form__form-select {
  padding: 10px 15px;
  border: 1px solid var(--color-light-black);
  border-radius: 8px;
  margin: 5px 0;
}
</style>

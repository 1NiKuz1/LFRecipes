<template>
  <Form @submit="handlerAddUser" :validation-schema="schema" class="add-form">
    <h3>Добавление</h3>
    <div class="add-form__content-wrapper">
      <label for="login">Логин</label>
      <Field
        class="add-form__form-input"
        type="text"
        name="login"
        maxlength="250"
      ></Field>
      <ErrorMessage name="login" class="add-form__error" />

      <label for="email">E-mail</label>
      <Field
        class="add-form__form-input"
        type="email"
        name="email"
        maxlength="250"
      ></Field>
      <ErrorMessage name="email" class="add-form__error" />

      <label for="password">Пароль</label>
      <Field
        class="add-form__form-input"
        type="password"
        name="password"
        maxlength="250"
      ></Field>
      <ErrorMessage name="password" class="add-form__error" />

      <label for="id_role">Категории</label>
      <Field as="select" name="id_role" class="add-form__form-select">
        <optgroup label="Роли">
          <option v-for="role of roles" :key="role" :value="role">
            {{ role }}
          </option>
        </optgroup>
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
import UserService from "@/services/user.service.js";
export default {
  name: "form-add-user",

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
      roles: [1, 2],
      errorMessage: "",
      isLoading: false,
    };
  },

  computed: {
    schema() {
      return yup.object({
        login: yup.string().trim().required("Обязательное поле"),
        email: yup
          .string()
          .trim()
          .required("Обязательное поле")
          .email("Не верный формат"),
        password: yup.string().trim().min(8).required("Обязательное поле"),
      });
    },
  },

  methods: {
    async handlerAddUser(values) {
      if (!values.id_role) values.id_role = 1;
      this.isLoading = true;
      this.errorMessage = "";
      try {
        await UserService.addUser(values);
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

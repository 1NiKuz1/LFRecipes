<template>
  <Form @submit="handleLogin" :validation-schema="schema" class="auth-form">
    <h3>Авторизация</h3>
    <div class="auth-form__content-wrapper">
      <label for="email">E-mail</label>
      <Field class="auth-form__form-input" type="text" name="email"></Field>
      <ErrorMessage name="email" class="auth-form__error" />
      <div class="auth-form__fogort-wrapper">
        <label for="password">Пароль</label>
        <button @click="handleFogortPassword">Забыли пароль?</button>
      </div>
      <Field
        class="auth-form__form-input"
        type="password"
        name="password"
      ></Field>
      <ErrorMessage name="password" class="auth-form__error" />
    </div>
    <p v-if="errorMessage" class="auth-form__error">{{ errorMessage }}</p>
    <div class="auth-form__butn-wrapper">
      <form-button :disabled="isLoading">Войти</form-button>
    </div>
  </Form>
</template>

<script>
import FormInput from "@/components/UI/FormInput.vue";
import FormButton from "@/components/UI/FormButton.vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";
export default {
  name: "authorization-form",
  components: {
    FormInput,
    FormButton,
    Form,
    Field,
    ErrorMessage,
  },
  emits: ["hideDialog"],
  setup() {
    const auth = useAuthStore();
    const { userData } = storeToRefs(auth);
    const { login } = auth;
    return {
      userData,
      login,
    };
  },
  data() {
    return {
      errorMessage: "",
      isLoading: false,
    };
  },
  computed: {
    schema() {
      return yup.object({
        email: yup
          .string()
          .trim()
          .required("Обязательное поле")
          .email("Не верный формат"),
        password: yup
          .string()
          .trim()
          .min(8, "Миниму 8 символов")
          .required("Обязательное поле"),
      });
    },
  },
  methods: {
    handleFogortPassword() {
      this.$emit("hideDialog");
      this.$router.push("/fogort-password");
    },

    async handleLogin(values) {
      this.errorMessage = "";
      this.isLoading = true;
      try {
        await this.login({ email: values.email, password: values.password });
        this.$emit("hideDialog");
      } catch (error) {
        this.errorMessage = error.response.data.message;
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
.auth-form {
  display: flex;
  flex-direction: column;
  margin-top: 30px;
}

.auth-form__fogort-wrapper {
  display: flex;
  justify-content: space-between;
}
.auth-form__fogort-wrapper button {
  color: var(--color-accent);
}

.auth-form__error {
  color: red;
}
.auth-form__content-wrapper {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}
.auth-form__form-input {
  padding: 2px 10px;
  border: 1px solid var(--color-light-black);
  border-radius: 8px;
  margin: 5px 0;
}
.auth-form__butn-wrapper {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}
</style>

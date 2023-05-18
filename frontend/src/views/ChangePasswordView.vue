<template>
  <section class="change-password">
    <div class="container">
      <h1>Изменение пароля</h1>
      <div class="change-password_form-wrapper">
        <Form
          @submit="handleLogin"
          :validation-schema="schema"
          class="change-form"
        >
          <div class="change-form__content-wrapper">
            <label for="email">E-mail</label>
            <Field
              class="change-form__form-input"
              type="text"
              name="email"
            ></Field>
            <ErrorMessage name="email" class="change-form__error" />
            <label for="password">Придумайте новый пароль</label>
            <Field
              class="change-form__form-input"
              type="password"
              name="password"
            ></Field>
            <ErrorMessage name="password" class="change-form__error" />
            <label for="repeatPassword">Повторите пароль</label>
            <Field
              class="change-form__form-input"
              type="password"
              name="repeatPassword"
            ></Field>
            <ErrorMessage name="repeatPassword" class="change-form__error" />
          </div>
          <p v-if="errorMessage" class="change-form__error">
            {{ errorMessage }}
          </p>
          <div class="change-form__butn-wrapper">
            <form-button :disabled="isLoading">Отправить</form-button>
          </div>
        </Form>
      </div>
    </div>
  </section>
</template>

<script>
import FormButton from "@/components/UI/FormButton.vue";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";
export default {
  components: {
    FormButton,
    Form,
    Field,
    ErrorMessage,
  },
  setup() {
    const auth = useAuthStore();
    const { changeUserPassword } = auth;
    return {
      changeUserPassword,
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
        repeatPassword: yup
          .string()
          .trim()
          .min(8, "Миниму 8 символов")
          .required("Обязательное поле"),
      });
    },
  },
  methods: {
    async handleLogin(values) {
      this.errorMessage = "";
      if (values.password !== values.repeatPassword) {
        this.errorMessage = "Пароли не совпадают";
        return;
      }
      this.isLoading = true;
      try {
        await this.changeUserPassword(values.email, values.password);
        this.$router.push("/");
      } catch (error) {
        this.errorMessage = error.response.data.message;
      }
      this.isLoading = false;
    },
  },
  mounted() {},
};
</script>

<style scoped>
h1 {
  text-align: center;
}

.change-password_form-wrapper {
  display: flex;
  justify-content: center;
}
.change-form {
  display: flex;
  flex-direction: column;
  margin-top: 30px;
  width: 100%;
  max-width: 400px;
}

.change-form__error {
  color: red;
}
.change-form__content-wrapper {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}
.change-form__form-input {
  padding: 2px 10px;
  border: 1px solid var(--color-light-black);
  border-radius: 8px;
  margin: 5px 0;
}
.change-form__butn-wrapper {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}
</style>

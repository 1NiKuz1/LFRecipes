<template>
  <Form @submit="handlerRegister" :validation-schema="schema" class="reg-form">
    <h3>Регистрация</h3>
    <div class="reg-form__content-wrapper">
      <label for="login">Логин</label>
      <Field class="reg-form__form-input" type="text" name="login"></Field>
      <ErrorMessage name="login" class="reg-form__error" />
      <label for="email">E-mail</label>
      <Field class="reg-form__form-input" type="email" name="email"></Field>
      <ErrorMessage name="email" class="reg-form__error" />
      <label for="password">Пароль</label>
      <Field
        class="reg-form__form-input"
        type="password"
        name="password"
      ></Field>
      <ErrorMessage name="password" class="reg-form__error" />
      <label for="repeatPassword">Повторите пароль</label>
      <Field
        class="reg-form__form-input"
        type="password"
        name="repeatPassword"
      ></Field>
      <ErrorMessage name="repeatPassword" class="reg-form__error" />
    </div>
    <div v-if="errorMessage" class="alert alert-danger" role="alert">
      {{ errorMessage }}
    </div>
    <div class="reg-form__butn-wrapper">
      <form-button :disabled="isLoading">Отправить</form-button>
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
  name: "registration-form",
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
    const { register } = auth;
    return {
      userData,
      register,
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
        login: yup.string().trim().required("Обязательное поле"),
        email: yup
          .string()
          .trim()
          .required("Обязательное поле")
          .email("Не верный формат"),
        password: yup.string().trim().min(8).required("Обязательное поле"),
        repeatPassword: yup
          .string()
          .trim()
          .min(8)
          .required("Обязательное поле"),
      });
    },
  },
  methods: {
    async handlerRegister(values) {
      console.log(values);
      if (values.password !== values.repeatPassword) {
        this.errorMessage = "Passwords don't match";
        return;
      }
      this.isLoading = true;
      try {
        await this.register({
          login: values.login,
          email: values.email,
          password: values.password,
          role: "user",
        });
        this.$emit("hideDialog");
      } catch (error) {
        this.errorMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
        console.log(this.message);
      }
      this.isLoading = false;
    },
  },
};
</script>

<style scoped>
.reg-form {
  display: flex;
  flex-direction: column;
  margin-top: 30px;
}

.reg-form__error {
  color: red;
}
.reg-form__content-wrapper {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}
.reg-form__form-input {
  padding: 2px 10px;
  border: 1px solid var(--color-light-black);
  border-radius: 8px;
  margin: 5px 0;
}
.reg-form__butn-wrapper {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}
</style>

<template>
  <section class="fogort-password">
    <div class="container">
      <h1>Сбросить пароль</h1>
      <div class="fogort-password_form-wrapper">
        <Form
          @submit="handleLogin"
          :validation-schema="schema"
          class="fogort-form"
        >
          <div class="fogort-form__content-wrapper">
            <label for="email">E-mail</label>
            <Field
              class="fogort-form__form-input"
              type="text"
              name="email"
            ></Field>
            <ErrorMessage name="email" class="fogort-form__error" />
          </div>
          <div v-if="errorMessage" class="alert alert-danger" role="alert">
            {{ errorMessage }}
          </div>
          <div class="fogort-form__butn-wrapper">
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
    const { fogortPassword } = auth;
    return {
      fogortPassword,
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
      });
    },
  },
  methods: {
    async handleLogin(values) {
      this.isLoading = true;
      try {
        await this.fogortPassword(values.email);
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
  mounted() {},
};
</script>

<style scoped>
h1 {
  text-align: center;
}

.fogort-password_form-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 150px;
}
.fogort-form {
  display: flex;
  flex-direction: column;
  margin-top: 30px;
  width: 100%;
  max-width: 400px;
}

.fogort-form__error {
  color: red;
}
.fogort-form__content-wrapper {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}
.fogort-form__form-input {
  padding: 2px 10px;
  border: 1px solid var(--color-light-black);
  border-radius: 8px;
  margin: 5px 0;
}
.fogort-form__butn-wrapper {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}
</style>

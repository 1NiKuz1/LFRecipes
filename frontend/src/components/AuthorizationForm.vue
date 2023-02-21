<template>
  <form @submit.prevent="handleLogin" class="auth-form">
    <h3>Авторизация</h3>
    <div class="auth-form__content-wrapper">
      <label for="email">E-mail</label>
      <form-input
        class="auth-form__form-input"
        v-model="email"
        type="text"
        name="email"
        required
      ></form-input>
      <label for="password">Пароль</label>
      <form-input
        class="auth-form__form-input"
        v-model="password"
        type="password"
        name="password"
        required
      ></form-input>
    </div>

    <div class="auth-form__butn-wrapper">
      <form-button>Войти</form-button>
    </div>
  </form>
</template>

<script>
import FormInput from "@/components/UI/FormInput.vue";
import FormButton from "@/components/UI/FormButton.vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";
export default {
  name: "authorization-form",
  components: {
    FormInput,
    FormButton,
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
      email: "",
      password: "",
    };
  },
  methods: {
    handleLogin() {
      this.login({ email: this.email, password: this.password }).then(
        (res) => {
          console.log(res);
        },
        (error) => {
          console.log(error);
        }
      );
      this.$emit("hideDialog");
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
.auth-form__content-wrapper {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}
.auth-form__form-input {
  margin: 5px 0;
}
.auth-form__butn-wrapper {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}
</style>

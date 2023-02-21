<template>
  <form @submit.prevent="handlerRegister" class="reg-form">
    <h3>Регистрация</h3>
    <div class="reg-form__content-wrapper">
      <label for="email">Логин</label>
      <form-input
        class="reg-form__form-input"
        v-model="login"
        type="text"
        name="login"
        required
      ></form-input>
      <label for="email">E-mail</label>
      <form-input
        class="reg-form__form-input"
        v-model="email"
        type="text"
        name="email"
        required
      ></form-input>
      <label for="password">Пароль</label>
      <form-input
        class="reg-form__form-input"
        v-model="password"
        type="password"
        name="password"
        required
      ></form-input>
      <label for="password">Повторите пароль</label>
      <form-input
        class="reg-form__form-input"
        v-model="repeatPassword"
        type="password"
        name="repeatPassword"
        required
      ></form-input>
    </div>
    <div class="reg-form__butn-wrapper">
      <form-button>Отправить</form-button>
    </div>
  </form>
</template>

<script>
import FormInput from "@/components/UI/FormInput.vue";
import FormButton from "@/components/UI/FormButton.vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";
export default {
  name: "registration-form",
  components: {
    FormInput,
    FormButton,
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
      login: "",
      email: "",
      password: "",
      repeatPassword: "",
    };
  },
  methods: {
    handlerRegister() {
      if (this.password !== this.repeatPassword) {
        alert("Пароль не соот");
        return;
      }
      this.register({
        login: this.login,
        email: this.email,
        password: this.password,
        role: "user",
      }).then(
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
.reg-form {
  display: flex;
  flex-direction: column;
  margin-top: 30px;
}
.reg-form__content-wrapper {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
}
.reg-form__form-input {
  margin: 5px 0;
}
.reg-form__butn-wrapper {
  display: flex;
  gap: 20px;
  margin-top: 20px;
}
</style>

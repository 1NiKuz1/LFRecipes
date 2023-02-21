import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "bootstrap/dist/css/bootstrap.css";
import "./assets/main.css";

import setupInterceptors from "./services/setupInterceptors";
import { useAuthStore } from "@/stores/auth";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");

const auth = useAuthStore();
setupInterceptors(auth);

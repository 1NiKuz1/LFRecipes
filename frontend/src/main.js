import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";

import "bootstrap/dist/css/bootstrap.css";
import "./assets/main.css";

//primevue
import "primevue/resources/themes/lara-light-indigo/theme.css"; //theme
import "primevue/resources/primevue.min.css"; //core
import "primeicons/primeicons.css"; //icons
import PrimeVue from "primevue/config";

import setupInterceptors from "./services/setupInterceptors";
import { useAuthStore } from "@/stores/auth";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(PrimeVue);

app.mount("#app");

const auth = useAuthStore();
setupInterceptors(auth);

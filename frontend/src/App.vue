<template>
  <main class="fl-container">
    <main-navbar
      style="margin: 40px 0 60px 0"
      @show-dialog="handlerShowDialog"
      @show-menu="showMenu = true"
    ></main-navbar>
    <side-menu v-model:show="showMenu"></side-menu>
    <main-dialog v-model:show="showDialog">
      <div v-if="typeConn == 'signin'">
        <authorization-form
          @hide-dialog="showDialog = false"
        ></authorization-form>
      </div>
      <div v-else-if="typeConn == 'signup'">
        <registration-form
          @hide-dialog="showDialog = false"
        ></registration-form>
      </div>
    </main-dialog>
    <router-view></router-view>
  </main>
</template>

<script>
import { RouterView } from "vue-router";
import MainNavbar from "@/components/MainNavbar.vue";
import MainDialog from "@/components/MainDialog.vue";
import SideMenu from "@/components/SideMenu.vue";
import AuthorizationForm from "@/components/AuthorizationForm.vue";
import RegistrationForm from "@/components/RegistrationForm.vue";
import EventBus from "./common/EventBus";
import { useAuthStore } from "@/stores/auth";
export default {
  components: {
    MainNavbar,
    MainDialog,
    SideMenu,
    RouterView,
    AuthorizationForm,
    RegistrationForm,
  },
  setup() {
    const auth = useAuthStore();
    const { logout } = auth;
    return {
      logout,
    };
  },
  data() {
    return {
      showDialog: false,
      showMenu: false,
      typeConn: "",
    };
  },
  methods: {
    handlerShowDialog(typeConn) {
      this.typeConn = typeConn;
      this.showDialog = true;
    },
  },
  mounted() {
    EventBus.on("logout", () => {
      this.$router.push("/");
      this.logout();
    });
  },
  beforeDestroy() {
    EventBus.remove("logout");
  },
};
</script>

<style scoped>
.fl-container {
  position: relative;
}
</style>

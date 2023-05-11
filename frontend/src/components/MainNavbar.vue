<template>
  <header class="navbar-header">
    <nav class="container main-navbar">
      <button class="menu-burger" @click="$emit('showMenu', true)"></button>
      <div v-if="!loggedIn" class="main-navbar__nav-wrapepr">
        <button
          class="main-navbar__button-signin"
          @click="$emit('showDialog', 'signin')"
        >
          Sign in
        </button>
        <button
          class="main-navbar__button-signup"
          @click="$emit('showDialog', 'signup')"
        >
          Sign up
        </button>
      </div>
      <div class="main-navbar__nav-wrapepr" v-else>
        <button
          class="main-navbar__button-user"
          :style="styleImg"
          @click="showUserMenu = !showUserMenu"
        ></button>
        <user-menu v-model:show="showUserMenu"></user-menu>
      </div>
    </nav>
  </header>
</template>

<script>
import UserMenu from "@/components/UserMenu.vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
export default {
  name: "main-navbar",
  components: {
    UserMenu,
  },
  emits: ["showDialog", "showMenu"],
  setup() {
    const user = useUserStore();
    const { getImage } = user;
    const { userData } = storeToRefs(user);
    return {
      userData,
      getImage,
    };
  },
  data() {
    return {
      showUserMenu: false,
      styleImg: {
        backgroundImage: "url('../src/assets/avatar.png')",
      },
    };
  },
  computed: {
    loggedIn() {
      return this.userData.status.loggedIn;
    },
  },
  methods: {
    getUserAvatar() {
      if (this.userData.user) {
        this.getImage()
          .then((img) => {
            this.styleImg.backgroundImage = `url(${img})`;
          })
          .catch((err) => console.log(err));
      }
    },
  },
  watch: {
    userData: {
      handler() {
        this.getUserAvatar();
      },
      deep: true,
    },
  },
  mounted() {
    this.getUserAvatar();
  },
};
</script>

<style scoped>
.navbar-header {
  position: relative;
}

.main-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.main-navbar__nav-wrapepr {
  position: relative;
}

.main-navbar__button-signin {
  margin-right: 30px;
  font-weight: 500;
  transition: color 0.25s ease-out;
}
.main-navbar__button-signin:hover {
  color: var(--color-accent);
}
.main-navbar__button-signin:focus {
  color: var(--color-dark-green);
}

.main-navbar__button-signup {
  color: var(--color-accent);
  font-weight: 600;
  line-height: 1;
  padding: 10px 20px;
  border: 2px var(--color-accent) solid;
  border-radius: 30px;
  transition: color, border 0.15s ease-out;
}
.main-navbar__button-signup:hover {
  color: var(--color-light-green);
  border-color: var(--color-light-green);
}
.main-navbar__button-signup:focus {
  color: var(--color-dark-green);
  border-color: var(--color-dark-green);
}

.menu-burger {
  background-image: url("../assets/menu.svg");
  background-position: 0 0;
  background-size: contain;
  background-repeat: no-repeat;
  height: 24px;
  width: 32px;
}

.main-navbar__button-user {
  width: 36px;
  height: 36px;
  border-radius: 10em;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}
</style>

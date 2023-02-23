<template>
  <div class="user-menu" v-if="show" @click.stop="hideMenu">
    <div class="user-menu__content">
      <nav @click.stop class="user-menu__nav">
        <ul class="user-menu__elements">
          <li class="user-menu__el">
            <button class="user-menu__button" @click="goByRoute('/person')">
              Личный кабинет
            </button>
          </li>
          <li class="user-menu__el">
            <button class="user-menu__button" @click="logOut">Выход</button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import EventBus from "@/common/EventBus";
export default {
  name: "user-menu",
  emits: ["update:show"],
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    hideMenu() {
      this.$emit("update:show", false);
    },
    goByRoute(route) {
      this.hideMenu();
      this.$router.push(route);
    },
    logOut() {
      this.hideMenu();
      EventBus.dispatch("logout");
    },
  },
};
</script>

<style scoped>
.user-menu {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
}

.user-menu::before {
  content: "";
  display: block;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  z-index: 99;
}

.user-menu__content {
  position: relative;
  right: 114px;
  top: 45px;
  background: var(--color-white);
  border: 1px solid rgba(0, 0, 0, 0.6);
  border-radius: 5px;
  min-width: 150px;
  height: auto;
  padding: 10px;
  z-index: 100;
}
.user-menu__elements {
  display: flex;
  flex-direction: column;
}

.user-menu__button {
  line-height: 1;
  font-size: 14px;
  padding: 10px 0;
  color: var(--color-text);
  transition: color 0.15s ease-out;
}

.user-menu__button:hover {
  color: var(--color-accent);
}

.user-menu__button:focus {
  color: var(--color-dark-green);
}
</style>

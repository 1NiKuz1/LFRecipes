<template>
  <div class="side-menu" v-if="show" @click.stop="hideMenu">
    <div @click.stop class="side-menu__content">
      <p class="logo"><span>LF</span>Resipes</p>
      <nav class="side-menu__nav">
        <ul class="side-menu__elements">
          <li class="side-menu__el">
            <button class="side-menu__button" @click="goByRoute('/')">
              Приветствие
            </button>
          </li>
          <li class="side-menu__el">
            <button class="side-menu__button">Рецепты</button>
          </li>
          <li class="side-menu__el">
            <button class="side-menu__button">О нас</button>
          </li>
          <li class="side-menu__el">
            <button class="side-menu__button">Добавить рецепт</button>
          </li>
          <li class="side-menu__el">
            <button class="side-menu__button">Панель администратора</button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
export default {
  name: "side-menu",
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
  },
};
</script>

<style scoped>
.side-menu {
  display: flex;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.side-menu__content {
  position: relative;
  left: 0;
  top: 0;
  bottom: 0;
  background: var(--color-white);
  min-width: 280px;
  padding: 0 30px;
}

.logo {
  margin-top: 60px;
  font-size: 20px;
  color: var(--color-light-black);
}

.logo > span {
  color: var(--color-accent);
}

.side-menu__elements {
  display: flex;
  flex-direction: column;
  margin-top: 40px;
}

.side-menu__el {
  border-bottom: 1px solid #000;
  transition: border-color 0.15s ease-out;
}

.side-menu__el:hover {
  border-color: var(--color-accent);
}

.side-menu__el:focus {
  border-color: var(--color-dark-green);
}

.side-menu__button {
  line-height: 1;
  font-size: 18px;
  padding: 20px 0;
  color: var(--color-text);
  transition: color 0.15s ease-out;
}

.side-menu__button:hover {
  color: var(--color-accent);
}

.side-menu__button:focus {
  color: var(--color-dark-green);
}
</style>

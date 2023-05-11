<template>
  <section class="admin">
    <div class="container">
      <h1>Панель администратора</h1>
      <div class="tab-menu">
        <button
          v-for="tab in tabs"
          :key="tab.name"
          @click="handlerTab(tab)"
          class="tab-menu__button"
          :class="tab.isSelected ? 'tab-menu__button--active' : ''"
        >
          {{ tab.name }}
        </button>
      </div>
      <component :is="selectedTab.component"></component>
    </div>
  </section>
</template>

<script>
import AdminUsers from "@/components/admin/AdminUsers.vue";
import AdminCategories from "@/components/admin/AdminCategories.vue";
import AdminGroupsCategories from "@/components/admin/AdminGroupsCategories.vue";
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
export default {
  components: {
    AdminUsers,
    AdminCategories,
    AdminGroupsCategories,
  },

  setup() {
    const user = useUserStore();
    const { userData } = storeToRefs(user);
    return {
      userData,
    };
  },

  data() {
    return {
      tabs: [
        {
          name: "Группы категорий",
          isSelected: true,
          component: "AdminGroupsCategories",
        },
        {
          name: "Категории",
          isSelected: false,
          component: "AdminCategories",
        },
        {
          name: "Пользователи",
          isSelected: false,
          component: "AdminUsers",
        },
      ],
    };
  },

  mounted() {
    if (this.userData?.user?.role !== "admin") {
      this.$router.push("/");
    }
  },

  computed: {
    selectedTab() {
      let selectedTab = this.tabs[0];
      this.tabs.forEach((tab) => {
        if (tab.isSelected) selectedTab = tab;
      });
      return selectedTab;
    },
  },

  methods: {
    async handlerTab(tab) {
      this.tabs.forEach((el) => {
        el.isSelected = false;
        if (el.name === tab.name) el.isSelected = true;
      });
    },
  },
};
</script>

<style scoped>
.tab-menu {
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
}
.tab-menu__button {
  font-weight: 500;
  padding-bottom: 3px;
  border-bottom: 3px solid transparent;
  transition: border-bottom 0.25s ease-out;
}
.tab-menu__button:hover,
.tab-menu__button--active {
  border-bottom: 3px solid var(--color-accent);
}

.admin {
  margin-bottom: 150px;
}

h1 {
  margin-bottom: 60px;
}
</style>

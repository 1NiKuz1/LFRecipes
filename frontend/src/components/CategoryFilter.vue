<template>
  <div>
    <h4>Категории</h4>
    <div class="categories_filter">
      <!--Список категорий-->
      <ul class="categories_filter__list">
        <!--Категории-->
        <li
          v-for="[groupKey, groupValue] of Object.entries(groups)"
          :key="groupKey"
          class="categories_filter__item"
        >
          <template
            v-if="Object.keys(groupValue).some((key) => key == 'categories')"
          >
            <div class="categories_filter__category-wrapper">
              <input
                type="checkbox"
                :id="groupKey"
                :checked="groupValue.isChecked"
                @change="
                  handlerChangeInputGroup($event.target.checked, groupValue)
                "
              />
              <label
                class="categories_filter__label-group"
                @click.prevent="groupValue.isVisible = !groupValue.isVisible"
                :for="groupKey"
              >
                {{ groupKey }}
              </label>
            </div>
            <!--Подкатегории-->
            <ul
              class="categories_filter__list categories_filter__list--subcategories"
              v-show="groupValue.isVisible"
            >
              <li
                v-for="category of groupValue.categories"
                :key="category.id"
                class="categories_filter__item"
              >
                <div class="categories_filter__category-wrapper">
                  <input
                    type="checkbox"
                    :id="category.id"
                    :value="category.id"
                    @change="
                      handlerChangeInputSubcategory(category, groupValue)
                    "
                    :checked="category.isChecked"
                  />
                  <label :for="category.category_name">
                    {{ category.category_name }}
                  </label>
                </div>
              </li>
            </ul>
          </template>
          <!--Категории без подкатегорий-->
          <template v-else>
            <div class="categories_filter__category-wrapper">
              <input
                type="checkbox"
                :id="groupValue.id"
                :value="groupValue.id"
                @change="toggleCategory($event.target.value)"
              />
              <label :for="groupValue.category_name">{{ groupKey }}</label>
            </div>
          </template>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { storeToRefs } from "pinia";
import { useCategoryStore } from "@/stores/category";
export default {
  props: {
    selectedСategories: {
      type: Array,
      default: () => [],
      required: true,
    },
  },
  setup() {
    const category = useCategoryStore();
    const { getCategories } = category;
    const { categories } = storeToRefs(category);
    return {
      categories,
      getCategories,
    };
  },
  data() {
    return {
      groups: {},
      isChecked: false,
    };
  },
  mounted() {
    this.loadData();
  },
  methods: {
    async loadData() {
      if (!this.categories.lenght) await this.getCategories();
      this.loadGroups();
    },

    loadGroups() {
      try {
        // Преобразуем категории в другую структуру для удобной отрисовки
        this.groups = this.categories.reduce((acc, category) => {
          if (category.group_name) {
            if (!acc[category.group_name]) {
              acc[category.group_name] = {
                categories: [],
                isVisible: false,
                isChecked: false,
              };
            }
            category["isChecked"] = false;
            acc[category.group_name].categories.push(category);
          } else {
            acc[category.category_name] = category;
          }
          return acc;
        }, {});
      } catch (error) {
        console.log(error);
      }
    },

    handlerChangeInputGroup(isChecked, group) {
      group.isChecked = !group.isChecked;
      group.isVisible = true;
      group.categories.forEach((category) => {
        const index = this.selectedСategories.indexOf(category.id);
        if (isChecked) {
          category.isChecked = true;
          if (index === -1) {
            this.selectedСategories.push(category.id);
          }
        } else {
          category.isChecked = false;
          if (index !== -1) {
            this.selectedСategories.splice(index, 1);
          }
        }
      });
    },

    handlerChangeInputSubcategory(category, group) {
      category.isChecked = !category.isChecked;
      let isAllChecked = true;
      group.categories.forEach((category) => {
        if (!category.isChecked) isAllChecked = false;
      });
      group.isChecked = isAllChecked;
      this.toggleCategory(category.id);
    },

    toggleCategory(category_id) {
      category_id = +category_id;
      const index = this.selectedСategories.indexOf(category_id);
      if (index === -1) {
        this.selectedСategories.push(category_id);
      } else {
        this.selectedСategories.splice(index, 1);
      }
    },
  },
};
</script>

<style scoped>
.categories_filter {
  height: 400px;
  max-width: 300px;
  overflow-y: scroll;
}

.categories_filter__label-group {
  font-weight: 700;
  cursor: pointer;
  width: 100%;
}

.categories_filter__list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.categories_filter__list--subcategories {
  margin-left: 20px;
}

.categories_filter__item {
  display: flex;
  flex-direction: column;
}

.categories_filter__category-wrapper {
  display: flex;
  align-items: flex-start;
}

input {
  margin-top: 7px;
  margin-right: 10px;
}

@media (max-width: 767px) {
  .categories_filter__list {
    gap: 10px;
  }
}
</style>

<template>
  <div class="categories-table">
    <template v-if="categories && categoryGroups">
      <DataTable
        v-model:editingRows="editingRows"
        :value="categories"
        resizableColumns
        columnResizeMode="fit"
        showGridlines
        editMode="row"
        dataKey="id"
        @row-edit-save="onRowEditSave"
        scrollable
        scrollHeight="80vh"
        tableClass="editable-cells-table"
        tableStyle="min-width: 50rem"
      >
        <template #header>
          <Button
            type="button"
            icon="pi pi-plus"
            label="Добавить"
            outlined
            @click="isShowDialog = !isShowDialog"
          />
        </template>

        <Column field="category_name" header="Category name">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" maxlength="100" />
          </template>
        </Column>

        <Column field="id_category_group" header="Group name">
          <template #editor="{ data, field }">
            <Dropdown
              v-model="data[field]"
              :options="categoryGroups"
              optionLabel="group_name"
              optionValue="id"
              placeholder="Выберите группу категории"
            >
            </Dropdown>
          </template>
          <template #body="slotProps">
            <p>{{ slotProps.data.group_name }}</p>
          </template>
        </Column>

        <Column
          :rowEditor="true"
          style="min-width: 5rem"
          headerStyle="width: 5rem; text-align: center"
          bodyStyle="text-align:center"
        ></Column>
        <Column
          style="min-width: 5rem"
          headerStyle="width: 5rem; text-align: center"
          bodyStyle="text-align: center"
        >
          <template #body="slotProps">
            <i
              class="pi pi-trash"
              style="font-size: 1rem"
              @click="deleteCategory(slotProps.data)"
            ></i>
          </template>
        </Column>
      </DataTable>
    </template>
    <p v-else>Пользователи не найдены</p>
    <main-dialog v-model:show="isShowDialog">
      <form-add-category @hide-dialog="handleHideDialog"></form-add-category>
    </main-dialog>
  </div>
</template>

<script>
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import InputNumber from "primevue/inputnumber";
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import FormAddCategory from "@/components/admin/FormAddCategory.vue";
import MainDialog from "@/components/MainDialog.vue";
import CategoryService from "@/services/category.service.js";
import CategoryGroupService from "@/services/categoryGroups.service.js";
export default {
  name: "admin-categories",
  components: {
    DataTable,
    Column,
    InputText,
    InputNumber,
    Button,
    Dropdown,
    FormAddCategory,
    MainDialog,
  },

  data() {
    return {
      categories: null,
      categoryGroups: null,
      editingRows: [],
      isShowDialog: false,
    };
  },

  mounted() {
    this.LoadCategories();
    this.LoadCategoryGroups();
  },

  methods: {
    async LoadCategories() {
      this.categories = await CategoryService.getCategories();
    },

    async LoadCategoryGroups() {
      this.categoryGroups = await CategoryGroupService.getCategoryGroups();
      this.categoryGroups.unshift({ id: null, group_name: "Без группы" });
    },

    async onRowEditSave(event) {
      let { newData, index } = event;
      this.categories[index] = newData;
      try {
        await CategoryService.updateCategory(newData.id, {
          category_name: newData.category_name,
          id_category_group: newData.id_category_group,
        });
        await this.LoadCategories();
      } catch (error) {
        console.log(error);
      }
    },

    async deleteCategory(category) {
      if (confirm("Удалить категорию?")) {
        this.categories = this.categories.filter((el) => el.id !== category.id);
        try {
          await CategoryService.deleteCategory(category.id);
        } catch (error) {
          console.log(error);
        }
      }
    },

    async handleHideDialog() {
      this.isShowDialog = false;
      await this.LoadCategories();
    },
  },
};
</script>

<style scoped>
.pi {
  cursor: pointer;
}
</style>

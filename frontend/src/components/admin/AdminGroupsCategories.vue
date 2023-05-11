<template>
  <div class="categories-table">
    <template v-if="categoryGroups">
      <DataTable
        v-model:editingRows="editingRows"
        :value="categoryGroups"
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
        <Column field="group_name" header="Group name">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" maxlength="100" />
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
              @click="deleteCategoryGroup(slotProps.data)"
            ></i>
          </template>
        </Column>
      </DataTable>
    </template>
    <p v-else>Пользователи не найдены</p>
    <main-dialog v-model:show="isShowDialog">
      <form-add-category-group
        @hide-dialog="handleHideDialog"
      ></form-add-category-group>
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
import FormAddCategoryGroup from "@/components/admin/FormAddCategoryGroup.vue";
import MainDialog from "@/components/MainDialog.vue";
import CategoryService from "@/services/category.service.js";
import CategoryGroupService from "@/services/categoryGroups.service.js";
export default {
  name: "admin-categories",
  components: {
    DataTable,
    Column,
    InputText,
    Button,
    FormAddCategoryGroup,
    MainDialog,
  },

  data() {
    return {
      categoryGroups: null,
      editingRows: [],
      isShowDialog: false,
    };
  },

  mounted() {
    this.LoadCategoryGroups();
  },

  methods: {
    async LoadCategoryGroups() {
      this.categoryGroups = await CategoryGroupService.getCategoryGroups();
    },

    async onRowEditSave(event) {
      let { newData, index } = event;
      this.categoryGroups[index] = newData;
      try {
        console.log(newData);
        await CategoryGroupService.updateCategoryGroup(newData.id, newData);
      } catch (error) {
        console.log(error);
      }
    },

    async deleteCategoryGroup(group) {
      if (confirm("Удалить категорию?")) {
        this.categoryGroups = this.categoryGroups.filter(
          (el) => el.id !== group.id
        );
        try {
          await CategoryGroupService.deleteCategoryGroup(group.id);
        } catch (error) {
          console.log(error);
        }
      }
    },

    async handleHideDialog() {
      this.isShowDialog = false;
      await this.LoadCategoryGroups();
    },
  },
};
</script>

<style scoped>
.pi {
  cursor: pointer;
}
</style>

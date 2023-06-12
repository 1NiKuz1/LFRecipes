<template>
  <div class="users-table">
    <template v-if="users && roles">
      <DataTable
        v-model:editingRows="editingRows"
        :value="users"
        resizableColumns
        columnResizeMode="fit"
        showGridlines
        editMode="row"
        dataKey="id_user"
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

        <Column field="login" header="Login">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" maxlength="250" />
          </template>
        </Column>

        <Column field="email" header="Email">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" maxlength="250" />
          </template>
        </Column>

        <Column field="id_role" header="Role name">
          <template #editor="{ data, field }">
            <Dropdown
              v-model="data[field]"
              :options="roles"
              optionLabel="name"
              optionValue="id_role"
              placeholder="Выберите роль"
            >
            </Dropdown>
          </template>
          <template #body="slotProps">
            <p>{{ getRole(slotProps.data.id_role) }}</p>
          </template>
        </Column>

        <Column field="is_activated" header="Is activated">
          <template #editor="{ data, field }">
            <InputNumber v-model="data[field]" :min="0" :max="1" />
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
              @click="deleteUser(slotProps.data)"
            ></i>
          </template>
        </Column>
      </DataTable>
    </template>
    <p v-else>Пользователи не найдены</p>
    <main-dialog v-model:show="isShowDialog">
      <form-add-user @hide-dialog="handleHideDialog"></form-add-user>
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
import FormAddUser from "@/components/admin/FormAddUser.vue";
import MainDialog from "@/components/MainDialog.vue";
import UserService from "@/services/user.service.js";
import RoleService from "@/services/role.service.js";
export default {
  name: "admin-users",
  components: {
    DataTable,
    Column,
    InputText,
    InputNumber,
    Button,
    Dropdown,
    FormAddUser,
    MainDialog,
  },

  data() {
    return {
      roles: null,
      users: null,
      editingRows: [],
      isShowDialog: false,
    };
  },

  mounted() {
    this.loadUsers();
    this.loadRoles();
  },

  methods: {
    getRole(id) {
      return this.roles.find((role) => role.id_role === id).name;
    },

    async loadUsers() {
      this.users = await UserService.getUsersWithoutAdmins();
    },

    async loadRoles() {
      this.roles = await RoleService.getRoles();
      this.roles = this.roles.filter((role) => role.name !== "admin");
    },

    async onRowEditSave(event) {
      let { newData, index } = event;
      this.users[index] = newData;
      try {
        await UserService.updateUser(newData.id_user, newData);
      } catch (error) {
        console.log(error);
      }
    },

    async deleteUser(user) {
      if (confirm("Удалить пользователя?")) {
        this.users = this.users.filter((el) => el.id_user !== user.id_user);
        try {
          await UserService.deleteUser(user.id_user);
        } catch (error) {
          console.log(error);
        }
      }
    },

    async handleHideDialog() {
      this.isShowDialog = false;
      await this.loadUsers();
    },
  },
};
</script>

<style scoped>
.pi {
  cursor: pointer;
}
</style>

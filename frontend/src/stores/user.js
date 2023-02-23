import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import UserService from "../services/user.service";

export const useUserStore = defineStore("user", {
  state: () => ({
    auth: useAuthStore(),
  }),
  getters: {
    userData(state) {
      return state.auth.userData;
    },
  },
  actions: {
    async uploadImage(file, id) {
      return await UserService.uploadImage(file, id);
    },
  },
});

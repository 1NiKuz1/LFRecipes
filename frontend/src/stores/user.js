import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import UserService from "../services/user.service";

const DEFAULT_AVATAR = "src/assets/avatar.png"; //Путь к дефолтному аватару
const USER_AVATAR = "http://localhost:5000/api/user/get-image/"; //Путь к аватару с сервера

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
    //Загрузка изображения на сервер
    async uploadImage(file, id) {
      return await UserService.uploadImage(file, id);
    },
    //Получение изображения с сервера и изменение url в случае его отсутствия
    async getImage() {
      const id_user = this.auth.userData.user.id;
      const res = await UserService.getImage(id_user);
      //Если изображение не найдено, ставим дефолтный аватар
      if (!res.data) {
        return (this.auth.userData.imageUrl = DEFAULT_AVATAR);
      } else {
        return (this.auth.userData.imageUrl =
          USER_AVATAR + this.auth.userData.user.id);
      }
    },
  },
});

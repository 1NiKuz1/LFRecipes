import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import UserService from "../services/user.service";
import TokenService from "../services/token.service.js";

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
    //Обновление пользователя
    async updateUser(id, data) {
      try {
        const result = await UserService.updateUser(id, data);
        const user = TokenService.getUser();
        user.username = result.login;
        TokenService.setUser(user);
        this.auth.userData.user.username = result.login;
      } catch (error) {
        return Promise.reject(error);
      }
    },

    //Загрузка изображения на сервер
    async uploadImage(file, id) {
      try {
        return await UserService.uploadImage(file, id);
      } catch (error) {
        return Promise.reject(error);
      }
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

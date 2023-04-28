import { defineStore } from "pinia";
import AuthService from "../services/auth.service";

const user = JSON.parse(localStorage.getItem("user"));
const DEFAULT_AVATAR = "src/assets/avatar.png"; //Путь к дефолтному аватару
const USER_AVATAR = "http://localhost:5000/api/get-image/"; //Путь к аватару с сервера

export const useAuthStore = defineStore("auth", {
  state: () => ({
    userData: user
      ? {
          status: { loggedIn: true },
          user,
          imageUrl: USER_AVATAR + user.id,
        }
      : {
          status: { loggedIn: false },
          user: null,
          imageUrl: DEFAULT_AVATAR,
        },
  }),
  actions: {
    login(user) {
      return AuthService.login(user).then(
        (user) => {
          this.userData.status.loggedIn = true;
          this.userData.user = user;
          this.userData.imageUrl = USER_AVATAR + user.id;
          return Promise.resolve(user);
        },
        (error) => {
          this.userData.status.loggedIn = false;
          this.userData.user = null;
          this.userData.imageUrl = DEFAULT_AVATAR;
          return Promise.reject(error);
        }
      );
    },
    logout() {
      AuthService.logout();
      this.userData.status.loggedIn = false;
      this.userData.user = null;
      this.userData.imageUrl = DEFAULT_AVATAR;
    },
    register(user) {
      return AuthService.register(user).then(
        (response) => {
          this.userData.status.loggedIn = false;
          this.userData.imageUrl = DEFAULT_AVATAR;
          return Promise.resolve(response.data);
        },
        (error) => {
          this.userData.status.loggedIn = false;
          this.userData.imageUrl = DEFAULT_AVATAR;
          return Promise.reject(error);
        }
      );
    },
    refreshToken(accessToken) {
      this.userData.status.loggedIn = true;
      this.userData.user = { ...this.userData.user, accessToken: accessToken };
    },
    fogortPassword(email) {
      return AuthService.fogortPassword(email).catch((error) =>
        Promise.reject(error)
      );
    },
    changeUserPassword(email, password) {
      return AuthService.changeUserPassword(email, password).catch((error) =>
        Promise.reject(error)
      );
    },
  },
});

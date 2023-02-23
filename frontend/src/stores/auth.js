import { defineStore } from "pinia";
import AuthService from "../services/auth.service";

const user = JSON.parse(localStorage.getItem("user"));
export const useAuthStore = defineStore("auth", {
  state: () => ({
    userData: user
      ? {
          status: { loggedIn: true },
          user,
          imageUrl: "http://localhost:5000/api/get-image/" + user.id,
        }
      : {
          status: { loggedIn: false },
          user: null,
          imageUrl: "src/assets/avatar.png",
        },
  }),
  actions: {
    login(user) {
      return AuthService.login(user).then(
        (user) => {
          this.userData.status.loggedIn = true;
          this.userData.user = user;
          return Promise.resolve(user);
        },
        (error) => {
          this.userData.status.loggedIn = false;
          this.userData.user = null;
          return Promise.reject(error);
        }
      );
    },
    logout() {
      AuthService.logout();
      this.userData.status.loggedIn = false;
      this.userData.user = null;
    },
    register(user) {
      return AuthService.register(user).then(
        (response) => {
          this.userData.status.loggedIn = false;
          return Promise.resolve(response.data);
        },
        (error) => {
          this.userData.status.loggedIn = false;
          return Promise.reject(error);
        }
      );
    },
    refreshToken(accessToken) {
      this.userData.status.loggedIn = true;
      this.userData.user = { ...this.userData.user, accessToken: accessToken };
    },
  },
});

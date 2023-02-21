//import axios from "axios";

//const API_URL = "http://localhost:5000/api/auth/";
import api from "./api";
import TokenService from "./token.service";

class AuthService {
  login({ email, password }) {
    return api
      .post("/auth/signin", {
        email,
        password,
      })
      .then((response) => {
        if (response.data.accessToken) {
          TokenService.setUser(response.data);
        }
        return response.data;
      });
  }
  //login(user) {
  //  return axios
  //    .post(API_URL + "signin", {
  //      email: user.email,
  //      password: user.password,
  //    })
  //    .then((response) => {
  //      if (response.data.accessToken) {
  //        localStorage.setItem("user", JSON.stringify(response.data));
  //      }

  //      return response.data;
  //    });
  //}

  logout() {
    TokenService.removeUser();
  }

  register({ login, email, password, role }) {
    return api.post("/auth/signup", {
      login,
      email,
      password,
      role,
    });
  }

  //register(user) {
  //  return axios.post(API_URL + "signup", {
  //    login: user.login,
  //    email: user.email,
  //    password: user.password,
  //    role: user.role,
  //  });
  //}
}

export default new AuthService();

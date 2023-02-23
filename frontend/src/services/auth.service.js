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
}

export default new AuthService();

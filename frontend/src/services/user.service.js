//import axios from "axios";
//import authHeader from "./auth-header";
import api from "./api";

//const API_URL = "http://localhost:5000/api/test/";

class UserService {
  getPublicContent() {
    return api.get("/test/all");
  }

  getUserBoard() {
    return api.get("/test/user");
  }

  getModeratorBoard() {
    return api.get("/test/moderator");
  }

  getAdminBoard() {
    return api.get("/test/admin");
  }
}

export default new UserService();

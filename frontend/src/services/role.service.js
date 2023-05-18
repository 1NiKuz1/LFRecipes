import api from "./api";

class RoleService {
  async getRoles() {
    try {
      const result = await api.get("/roles");
      return result.data;
    } catch (error) {
      console.log(error);
    }
  }
}

export default new RoleService();

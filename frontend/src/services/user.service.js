import api from "./api";

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

  async uploadImage(file, id) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const dataUrl = reader.result;
      try {
        await api.post("/upload-image", {
          image: dataUrl,
          id_user: id,
        });
      } catch (error) {
        console.log(error);
      }
    };
  }
}

export default new UserService();

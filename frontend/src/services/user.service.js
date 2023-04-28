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

  //Загрузка изображения на сервер
  async uploadImage(file, id) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const dataUrl = reader.result;
      try {
        await api.post("/user/upload-image", {
          image: dataUrl,
          id_user: id,
        });
      } catch (error) {
        console.log(error);
      }
    };
  }
  //Проверка ответа с сервера на наличие изображения
  async getImage(id) {
    try {
      const result = await api.get(`/user/get-image/${id}`);
      return result;
    } catch (error) {
      return null;
    }
  }
}

export default new UserService();

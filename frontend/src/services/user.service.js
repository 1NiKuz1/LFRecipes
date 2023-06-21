import api from "./api";

class UserService {
  async getUsersWithoutAdmins() {
    try {
      const result = await api.get("/users/without-admins");
      return result.data;
    } catch (error) {
      console.log(error);
    }
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

  async addUser(data) {
    try {
      const result = await api.put(`/user/`, data);
      return result.data;
    } catch (error) {
      return Promise.reject(error?.response?.data?.message);
    }
  }

  async updateUser(id, data) {
    try {
      const result = await api.patch(`/user/${id}`, { data });
      return result.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async deleteUser(id) {
    try {
      const result = await api.delete(`/user/${id}`);
      return result.data;
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

export default new UserService();

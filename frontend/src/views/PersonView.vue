<template>
  <section class="profile">
    <div class="container">
      <h1>Личный кабинет</h1>
      <div class="file-upload">
        <label>
          <input
            name="file"
            type="file"
            ref="imageInput"
            @change="uploadImage"
          />
        </label>
        <img
          :src="this.userData.imageUrl"
          v-if="this.userData.imageUrl"
          alt="Avatar"
        />
      </div>
    </div>
  </section>
</template>

<script>
import { storeToRefs } from "pinia";
import { useUserStore } from "@/stores/user";
import axios from "axios";
import api from "@/services/api";
export default {
  setup() {
    const user = useUserStore();
    const { uploadImage, getImage } = user;
    const { userData } = storeToRefs(user);
    return {
      userData,
      uploadImage,
      getImage,
    };
  },
  methods: {
    async uploadImage() {
      if (!this.userData.user) return;
      const input = this.$refs.imageInput;
      const file = input.files[0];
      await this.uploadImage(file, this.userData.user.id);
      this.userData.imageUrl =
        "http://localhost:5000/api/get-image/" + this.userData.user.id;
      setTimeout(() => {
        location.reload();
      }, 300);
    },
  },
  mounted() {
    if (!this.userData.user) {
      this.$router.push("/");
    }
    this.getImage();
  },
};
</script>

<style scoped>
h1 {
  text-align: center;
  margin-bottom: 60px;
}
.file-upload input[type="file"] {
  display: none;
}

.file-upload {
  position: relative;
  width: 100px;
  height: 100px;
  overflow: hidden;
  border-radius: 30px;
}

.file-upload img {
  display: block;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.file-upload label {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  background: transparent;
  z-index: 2;
}
</style>

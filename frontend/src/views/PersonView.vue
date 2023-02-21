<template>
  <div class="container">
    <header>
      <h3>
        <strong>{{ userData?.user?.login }}</strong> Profile
      </h3>
    </header>
    <p>
      <strong>Token:</strong>
      {{ userData?.user?.accessToken }}
    </p>
    <p>
      <strong>Id:</strong>
      {{ userData?.user?.id }}
    </p>
    <p>
      <strong>Email:</strong>
      {{ userData?.user?.email }}
    </p>
    <p>
      <strong>Authorities:</strong>
      {{ userData?.user?.role }}
    </p>
    <button @click="logOut">log out</button>
  </div>
</template>

<script>
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/stores/auth";
import EventBus from "@/common/EventBus";
export default {
  setup() {
    const auth = useAuthStore();
    const { userData } = storeToRefs(auth);
    return {
      userData,
    };
  },
  data() {
    return {};
  },
  methods: {
    logOut() {
      EventBus.dispatch("logout");
    },
  },
  mounted() {
    console.log(this.userData.user);
    if (!this.userData.user) {
      this.$router.push("/");
    }
  },
};
</script>

<style scoped></style>

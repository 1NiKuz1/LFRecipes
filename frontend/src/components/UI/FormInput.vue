<template>
  <input :value="modelValue" @input="updateInput" />
</template>

<script>
export default {
  name: "form-input",
  props: ["modelValue"],
  emits: ["update:modelValue"],
  methods: {
    updateInput(e) {
      this.$emit("update:modelValue", e.target.value);
    },
  },
};
</script>

<style scoped>
input {
  padding: 2px 15px;
  border: 1px solid var(--color-light-black);
  border-radius: 30px;
}
</style>

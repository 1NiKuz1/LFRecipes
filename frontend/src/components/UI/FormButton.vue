<template>
  <button><slot></slot></button>
</template>

<script>
export default {
  name: "form-button",
	//props: ["modelValue"],
	//emits: ["update:modelValue"],
  //methods: {
	//	updateButton(e) {
	//		this.$emit("update:modelValue", e.target.value)
	//	}
	//}
};
</script>

<style scoped>
	button {
		padding: 10px 28px;
		line-height: 1;
		border-radius: 30px;
		font-size: 16px;
		font-weight: 500;
		color:  var(--color-white);
		background: var(--color-accent);
	}
</style>

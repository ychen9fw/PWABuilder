<template>
  <div>
    <HubHeader :showSubHeader="true"></HubHeader>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
export default class extends Vue {
  async created() {}
}
</script>

<style lang="scss" scoped>
input,
textarea {
  text-align: left;
  width: 100%;
  font-size: 14px;
  border-color: #f4f4f4;
  &:focus {
    border-color: #9337d8;
    outline: none;
  }
  &.error {
    border-color: #a80000;
  }
}
input {
  height: 35px;
  padding: 8px 8px 8px 0;
  border-width: 0 0 1px;
}
textarea {
  height: 120px;
  resize: none;
  &.short {
    height: 40px;
  }
}
</style>
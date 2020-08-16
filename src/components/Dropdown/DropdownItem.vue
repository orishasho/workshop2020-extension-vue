<template>
  <a href='javascript:void();' class="block my-1 px-4 py-1 font-medium text-gray-800" @click="onClickChild">
    <slot/>
  </a>
</template>

<script>
export default {
  name: "DropdownItem",
  methods: {
    onClickChild(event) {
      this.$emit('click', event.target.innerText);
    }
  }
};
</script>

<style scoped lang="scss">
  .block {
    display: block !important;
  }

  .text-gray-800 {
    --text-opacity: 1 !important;
    color: #2d3748 !important;
    color: rgba(45,55,72,var(--text-opacity)) !important;
  }

  .my-1 {
    margin-top: .25rem !important;
    margin-bottom: .25rem !important;
  }

  .font-medium {
    font-weight: 500 !important;
  }

  .px-4 {
    padding-left: 1rem !important;
    padding-right: 1rem !important;
  }

  .py-1 {
    padding-top: .25rem !important;
    padding-bottom: .25rem !important;
  }

  .bg-gray-200 {
    --bg-opacity: 1 !important;
    background-color: #edf2f7 !important;
    background-color: rgba(237,242,247,var(--bg-opacity)) !important;
  }

  a {
    &:hover {
      --bg-opacity: 1 !important;
      background-color: #edf2f7 !important;
      background-color: rgba(237,242,247,var(--bg-opacity)) !important;
      text-decoration: none !important;
    }
  }
</style>

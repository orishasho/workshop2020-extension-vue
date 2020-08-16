<template>
  <transition name="dropdown-content">
    <div
      v-if="active"
      class="origin-top-right absolute right-0 mt-2 w-48 bg-white rounded-lg border py-2"
    >
      <slot/>
    </div>
  </transition>
</template>

<script>
export default {
  name: "DropdownContent",
  inject: ["sharedState"],
  computed: {
    active() {
      return this.sharedState.active;
    }
  }
};
</script>

<style scoped lang="scss">

  .dropdown-content-enter-active,
  .dropdown-content-leave-active {
    transition: all 0.2s !important;
  }

  .dropdown-content-enter,
  .dropdown-content-leave-to {
    opacity: 0 !important;
    transform: translateY(-5px) !important;
  }

  .origin-top-right {
    transform-origin: top right !important;
  }

  .right-0 {
    right: 0 !important;
  }

  .mt-2 {
    margin-top: .5rem !important;
  }

  .w-48 {
    width: 25rem !important;
  }

  .bg-white {
    --bg-opacity: 1 !important;
    background-color: #fff !important;
    background-color: rgba(255,255,255,var(--bg-opacity)) !important;
  }

  .rounded-lg {
    border-radius: .5rem !important;
  }

  .border {
    border-width: 1px !important;
  }

  .py-2 {
    padding-top: .5rem !important;
    padding-bottom: .5rem !important;
  }

</style>

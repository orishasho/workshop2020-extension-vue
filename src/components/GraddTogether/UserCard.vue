<template>
<div class="gradd-user-card">

  <div class="gradd-user-card-image-container">
    <img :src="img" alt="Avatar" class="gradd-user-card-image-container-profile-img">
  </div>

  <div class="gradd-user-card-name">
    {{ name }}
  </div>

  <div class="gradd-user-card-email">
    {{ user_email }}
  </div>

</div>
</template>

<script>
    export default {
        name: "UserCard",
        props: ['name', 'user_email', 'img', 'final_draft']
    }
</script>

<style scoped lang="scss">

  .gradd-user-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-bottom: 30px !important;
    margin-left: 20px !important;
    flex-basis: 15% !important;

    &-name {
      margin-top: 5px !important;
      font-weight: bold !important;
    }

    &-image-container {
      &-profile-img {
        border-radius: 50% !important;
        opacity: 1 !important;
        box-shadow: 3px 3px 20px rgba(0, 0, 0, 0.5) !important;
        border: 2px solid rgba(255, 255, 255, 0.5) !important;
        width: 100px !important;
        height: 100px !important;

        &:hover {
          box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2) !important;
          transform: scale(1.03) !important;
          transition: 0.3s !important;
          cursor: pointer !important;
        }
      }
    }
  }

</style>
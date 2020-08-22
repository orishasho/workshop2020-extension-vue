<template>
<div class="user-card" @click="userCardClick">
  <img :src="img" alt="Avatar" class="profile-img">
  <div class="cards-container">
    <h4><b>{{name}}</b></h4> 
    <p>{{user_email}}</p> 
  </div>
</div>
</template>

<script>
    export default {
        name: "UserCard",
        props: ['name', 'user_email', 'img', 'final_draft'],
        methods: {
          userCardClick() {
            this.$emit('user-card-click', this.final_draft);
          }
        }
    }
</script>

<style scoped>
.user-card {
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2) !important;
  transition: 0.3s !important;
  flex-basis: 25% !important;
  border-radius: 5px !important;
}

.user-card:hover {
  box-shadow: 0 8px 16px 0 rgba(0,0,0,0.2) !important;
  transform: scale(1.03) !important;
  transition: 0.3s !important;
  cursor: pointer !important;
}

.cards-container {
  padding: 2px 16px !important;
}

.profile-img {
  width: 100px !important;
  height: 100px !important;
}
</style>
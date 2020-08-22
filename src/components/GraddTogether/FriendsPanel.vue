<template>
<div>
    <div class="user-cards-container">
        <UserCard @user-card-click="showModal" v-for="friend in friendsArray" :key="friend.user_email"
        :name="friend.name"
        :user_email="friend.user_email"
        :img="friend.img"
        :final_draft="friend.draft"/>
    </div>
</div>
</template>

<script>
    import UserCard from "./UserCard";
    import ScheduleReadOnly from "../ScheduleReadOnly";
    export default {
        name: "FriendsPanel",
        components: {
            UserCard,
            ScheduleReadOnly
        },
        props: ['friendsArray'],
        methods: {
          showModal(finalDraft) {
            this.$emit('show-schedule-modal', finalDraft);
          }
        },
        created() {
            console.log('FriendsPanel Created: ');
            console.dir(this.friendsArray);
        }
    }
</script>

<style scoped>
    .user-cards-container {
        display: flex !important;
    }
</style>
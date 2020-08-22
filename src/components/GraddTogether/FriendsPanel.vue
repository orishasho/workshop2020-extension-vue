<template>
<div>
    <div class="user-cards-container">
        <UserCard @user-card-click="showModal" v-for="friend in friendsArray" :key="friend.user_email"
        :name="friend.name"
        :user_email="friend.user_email"
        :img="friend.img"
        :final_draft="friend.final_draft"/>
    </div>
    <modal name="friendSchedule" :adaptive="true" :resizable="true" :scrollable="true" :width="'1000px'" :height="auto" :shiftX="1.0">
        <ScheduleReadOnly/>
    </modal>
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
            this.$modal.show('friendSchedule')
          }
        }
    }
</script>

<style scoped>
    .user-cards-container {
        display: flex !important;
    }
</style>
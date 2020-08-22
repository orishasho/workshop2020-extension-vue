<template>
    <div class="friends-panel-container">
        <h3>החברים שלי:</h3>
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
        }
    }
</script>

<style scoped lang="scss">
    .friends-panel-container {
        display: flex;
        flex-direction: column;
        margin-right: 10% !important;
        margin-top: 5%;

        h3 {
            font-size: 25px;
            font-weight: bold;
        }
        .user-cards-container {
            display: flex !important;
            flex-wrap: wrap !important;
            margin-top: 3% !important;
        }
    }

</style>
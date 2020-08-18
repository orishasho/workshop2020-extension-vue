<template>
    <div class="user-cards-container">
        <UserCard v-for="friend in friendsArray" :key="friend.user_email"
        :name="friend.name"
        :user_email="friend.user_name"
        :img="friend.img"
        :final_draft="friend.final_draft">
    </div>
</template>

<script>
    import UserCard from "./UserCard"
    export default {
        name: "FriendsPanel",
        components: {
            UserCard
        },
        props: ['friendsArray']
    }
</script>

<style scoped>
    .user-cards-container {
        display: flex;
        justify-content: space-between;
    }
</style>
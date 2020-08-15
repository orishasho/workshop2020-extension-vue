<template>
    <div class="top-panel-container">
        <UserDetails/>
        <Logo :logoWidth="100" :logoHeight="100"/>
    </div>
</template>

<script>
    import Logo from "../Logo";
    import UserDetails from "./UserDetails"
    export default {
        name: "TopPanel",
        components: {
            UserDetails,
            Logo
        }
    }
</script>

<style scoped>
    .top-panel-container {
        display: flex;
        justify-content: space-between;
    }
</style>
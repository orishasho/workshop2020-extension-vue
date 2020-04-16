<template>
    <p>{{ completedCredits }}/{{ requiredCredits }}</p>
</template>

<script>
    export default {
        name: "CreditsStats",
        props: {
            completedCredits: Number,
            requiredCredits: Number
        }
    }
</script>

<style lang="scss" scoped>
    p {
        font-size: 20px;
    }
</style>
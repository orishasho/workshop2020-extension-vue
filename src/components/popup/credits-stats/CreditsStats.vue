<template>
    <p>{{ firstCreditsStat }}/{{ totalRequiredCredits }}</p>
</template>

<script>
    export default {
        name: "CreditsStats",
        data: function() {
            return {
                totalRequiredCredits: 124
            }
        },
        props: {
            firstCreditsStat: Number
        }
    }
</script>

<style lang="scss" scoped>
    p {
        font-size: 20px;
    }
</style>
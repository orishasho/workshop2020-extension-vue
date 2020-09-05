<template>
    <img src="https://i.imgur.com/dGRXLm8.png" :height="logoHeight" :width="logoWidth">
</template>

<script>
    export default {
        name: "Logo",
        props: ['logoWidth', 'logoHeight']
    }
</script>

<style scoped>

</style>
<template>
    <h3>
        {{ text }}
        <font-awesome-icon v-if="isCompleted" icon="check-square" size="1x" color="#007090"/>
        <font-awesome-icon v-else icon="times" size="1x" color="#007090"/>
    </h3>
</template>

<script>
    import { BIconCheckCircle, BIconXCircle } from "bootstrap-vue";
    export default {
        name: "MathOrWorkshopCheckbox",
        props: [
            'text',
            'isCompleted'
        ],
        components: {
            BIconCheckCircle,
            BIconXCircle
        }
    }
</script>

<style scoped>

</style>
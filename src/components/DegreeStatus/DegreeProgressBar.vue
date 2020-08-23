<template>
    <vue-ellipse-progress
            :progress="(creditsCompleted/requiredCredits) * 100"
            :legend-value="creditsCompleted"
            color="#007090">

        <span slot="legend-value">/{{ requiredCredits }}</span>
        <p slot="legend-caption">{{ description }}</p>
    </vue-ellipse-progress>
</template>

<script>
    export default {
        name: "DegreeProgressBar",
        props: [
            'creditsCompleted',
            'requiredCredits',
            'description'
        ]
    }
</script>

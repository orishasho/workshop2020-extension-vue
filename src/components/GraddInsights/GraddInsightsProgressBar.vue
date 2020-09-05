<template>
    <vue-ellipse-progress
            :progress="(creditsCompleted/requiredCredits) * 100"
            :legend-value="creditsCompleted"
            lineMode="in 5"
            :thickness="5"
            :empty-thickness="3"
            color="#007090">

        <span slot="legend-value">/{{ requiredCredits }}</span>
        <p slot="legend-caption">{{ description }}</p>
    </vue-ellipse-progress>
</template>

<script>
    export default {
        name: "GraddInsightsProgressBar",
        props: [
            'creditsCompleted',
            'requiredCredits',
            'description'
        ]
    }
</script>

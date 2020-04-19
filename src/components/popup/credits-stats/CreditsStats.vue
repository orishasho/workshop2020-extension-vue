<template>
    <div>
        <b-progress :max="requiredCredits" height="2rem" striped>
            <b-progress-bar :value="completedCredits">
                {{ creditsType }} <strong>{{ completedCredits }} / {{ requiredCredits }}</strong>
            </b-progress-bar>
        </b-progress>
    </div>
</template>

<script>
    import { BProgress, BProgressBar } from 'bootstrap-vue'

    export default {
        name: "CreditsStats",
        components: {
            BProgress,
            BProgressBar
        },
        props: {
            completedCredits: Number,
            requiredCredits: Number,
            creditsType: String
        }
    }
</script>

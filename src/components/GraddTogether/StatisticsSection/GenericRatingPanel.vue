<template>
    <div class="rating-container">
        <h3>{{ heading }}</h3>
        <div class="progress-bars-container">
            <RatingProgressBar
                    v-for="(place, index) in places"
                    :key="place.course_name"
                    :current-rating="place.cnt"
                    :course-name="place.course_name"
                    :max-rating="5"
            />
        </div>
    </div>
</template>

<script>
    import RatingProgressBar from "./RatingProgressBar";
    export default {
        name: "GenericRatingPanel",
        props: [
            'heading',
            'places'
        ],
        components: {
            RatingProgressBar
        }
    }
</script>

<style scoped lang="scss">
    .rating-container {
        display: flex;
        flex-direction: column;
        margin-top: 5%;
        margin-right: 5%;

        h3 {
            font-size: 25px;
            font-weight: bold;
        }

        .progress-bars-container {
            display: flex;
            justify-content: space-evenly;
            margin-top: 1%;
        }
    }
</style>
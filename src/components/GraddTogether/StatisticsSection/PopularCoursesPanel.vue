<template>
    <div class="rating-container">
        <h3>{{ heading }}</h3>
        <div class="progress-bars-container">
                <EnrollmentProgressBar
                        v-for="place in places"
                        :key="place.course_name"
                        :course-name="place.course_name"
                        :max-progress="getMaxProgressForEnrollment()"
                        :num-enrolled="place.cnt"
                />
        </div>
    </div>
</template>

<script>
    import EnrollmentProgressBar from "./EnrollmentProgressBar";

    export default {
        name: "PopularCoursesPanel",
        props: [
            'heading',
            'places'
        ],
        components: {
            EnrollmentProgressBar
        },
        methods: {
            getMaxProgressForEnrollment() {
                return Math.max(...this.places.map(place => place.cnt));
            }
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
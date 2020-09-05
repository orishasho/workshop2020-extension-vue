<template>
    <vue-ellipse-progress
            :progress="(numEnrolled/maxProgress) * 100"
            :legend-value="numEnrolled"
            color="#007090"
            lineMode="in 5"
            :thickness="5"
            :empty-thickness="3">
        <div slot="legend-caption">
            <p>נרשמים לקורס:</p>
            <p v-if="isBrokenToWords()">
                <strong>{{ firstCourseWord }}</strong>
                <br>
                <strong>{{ secondCourseWord }}</strong>
            </p>
            <p v-else>
                <strong>{{ courseName }}</strong>
            </p>
        </div>
    </vue-ellipse-progress>
</template>

<script>
    export default {
        name: "EnrollmentProgressBar",
        data() {
            return {
                firstCourseWord: '',
                secondCourseWord: ''
            }
        },
        props: [
            'courseName',
            'numEnrolled',
            'maxProgress'
        ],
        methods: {
            isBrokenToWords() {
                return this.firstCourseWord !== '';
            }
        },
        created() {
            const courseNameWords = this.courseName.split(' ');
            if (courseNameWords.length > 2) {
                this.firstCourseWord = `${courseNameWords[0]} ${courseNameWords[1]}`;
                for (let i = 2; i < courseNameWords.length; i++) {
                    this.secondCourseWord += ` ${courseNameWords[i]}`;
                }
            }
        }
    }
</script>

<style scoped>

</style>
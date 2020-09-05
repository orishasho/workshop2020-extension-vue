<template>
    <vue-ellipse-progress
            :progress="(currentRating/maxRating) * 100"
            :legend-value="currentRating"
            lineMode="in 5"
            :thickness="5"
            :empty-thickness="3"
            color="#007090">

        <span slot="legend-value">/{{ maxRating }}</span>
        <div slot="legend-caption">
            <star-rating
                    :rating="getStarRatingValue()"
                    :increment="0.01"
                    :star-size="20"
                    :read-only="true"
                    :rtl="true"
                    :show-rating="false">
            </star-rating>
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
    import StarRating from 'vue-star-rating';
    export default {
        name: "RatingProgressBar",
        data() {
            return {
                firstCourseWord: '',
                secondCourseWord: ''
            }
        },
        props: [
            'currentRating',
            'maxRating',
            'courseName'
        ],
        components: {
            StarRating
        },
        methods: {
            getStarRatingValue() {
                return parseFloat(this.currentRating);
            },
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
    .vue-star-rating {
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
    }
</style>
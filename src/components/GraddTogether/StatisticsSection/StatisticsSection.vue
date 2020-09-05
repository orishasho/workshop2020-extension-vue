<template>
    <div>
        <PopularCoursesPanel
                :heading="'קורסי הבחירה הפופולריים ביותר:'"
                :places="popularCourses"/>
        <GenericRatingPanel
                :heading="'הקורסים המעניינים ביותר:'"
                :places="interestingCourses"/>
        <GenericRatingPanel
                :heading="'הקורסים הקשים ביותר:'"
                :places="hardCourses"/>
    </div>
</template>

<script>
    import PopularCoursesPanel from './PopularCoursesPanel';
    import GenericRatingPanel from './GenericRatingPanel';
    export default {
        name: "StatisticsSection",
        props: [
            'popularCourses',
            'interestingCourses',
            'hardCourses'
        ],
        components: {
            PopularCoursesPanel,
            GenericRatingPanel
        }
    }
</script>

<style scoped>

</style>
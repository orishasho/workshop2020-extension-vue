<template>
    <MountingPortal mountTo="#main-content-container-id" name="source" append>
        <div class="main-container">
            <TopPanel/>
            <GenericRatingPanel
                :heading="'הקורסים הפופולריים ביותר:'"
                :places="popularCourses"/>
            <GenericRatingPanel
                :heading="'הקורסים המעניינים ביותר:'"
                :places="['קורס מעניין ראשון', 'קורס מעניין שנית', 'קורס מעניין שלישי']"/>
            <GenericRatingPanel
                :heading="'הקורסים הקשים ביותר:'"
                :places="['קורס קשה ראשון', 'קורס קשה שנית', 'קורס קשה שלישי']"/>
            <RateCoursesPanel/>
        </div>
    </MountingPortal>
</template>

<script>
    import { MountingPortal} from "portal-vue";
    import TopPanel from "./TopPanel";
    import GenericRatingPanel from "./GenericRatingPanel";
    import RateCoursesPanel from "./RateCoursesPanel";
    const axios = require('axios');

    export default {
        name: "GraddTogetherContainer",
        components: {
            TopPanel,
            GenericRatingPanel,
            RateCoursesPanel
        },
        data: function() {
            return {
                popularCourses: []
            }
        },
        created: async function() {
            const response = await axios.get(`http://localhost:8080/user_course/topPopular`);
            this.popularCourses = response.data.map(elem => elem.course_name);
        }
    }
</script>

<style scoped>
    .main-container {
        display: flex;
        flex-direction: column;
        margin-left: 10%;
        margin-right: 10%;
        background-color: #f7fffd;
        box-shadow: 1px 3px 14px -2px rgba(0,0,0,0.51);
    }
</style>
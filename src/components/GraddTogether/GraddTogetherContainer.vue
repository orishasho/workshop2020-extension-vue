<template>
    <MountingPortal mountTo="#main-content-container-id" name="source" append>
        <div class="main-container">
            <TopPanel/>
            <GenericRatingPanel
                :heading="'הקורסים הפופולריים ביותר:'"
                :places="popularCourses"/>
            <GenericRatingPanel
                :heading="'הקורסים המעניינים ביותר:'"
                :places="interestingCourses"/>
            <GenericRatingPanel
                :heading="'הקורסים הקשים ביותר:'"
                :places="hardCourses"/>
            <RateCoursesPanel/>
            <FriendsPanel/>
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
                popularCourses: [],
                interestingCourses: [],
                hardCourses: []
            }
        },
        created: async function() {
            const popularResponse = await axios.get(`http://localhost:8080/user_course/topPopular`);
            this.popularCourses = popularResponse.data.map(elem => elem.course_name);

            const interestingResponse = await axios.get(`http://localhost:8080/user_rating/topInteresting`);
            this.interestingCourses = interestingResponse.data.map(elem => elem.course_name);
            
            const hardResponse = await axios.get(`http://localhost:8080/user_rating/topHard`);
            this.hardCourses = hardResponse.data.map(elem => elem.course_name);
        }
    }
</script>

<style scoped>
    .main-container {
        display: flex;
        flex-direction: column;
        margin-right: 6.5%;
        background-color: #f7fffd;
        box-shadow: 1px 3px 14px -2px rgba(0,0,0,0.51);
    }
</style>
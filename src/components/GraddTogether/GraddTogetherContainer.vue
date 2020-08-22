<template>
    <MountingPortal mountTo="#main-content-container-id" name="source" append>

        <div class="spinner-container" v-if="isLoading">
            <pulse-loader :loading="isLoading"></pulse-loader>
        </div>

        <div class="main-container" v-if="!isLoading">
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
            <RateCoursesPanel
                    :userCoursesToRate="userCoursesToRate"/>
            <FriendsPanel
                    v-if="userFriends && userFriends.length > 0"
                    :friendsArray="userFriends"
                    @show-schedule-modal="showScheduleModal"/>
            <ScheduleModal
                    v-if="modalSchedule && showModal"
                    :draft="modalSchedule"
                    @close-modal="closeScheduleModal"/>
        </div>

    </MountingPortal>
</template>

<script>
    import { MountingPortal} from "portal-vue";
    import TopPanel from "./TopPanel";
    import GenericRatingPanel from "./GenericRatingPanel";
    import RateCoursesPanel from "./RateCoursesPanel";
    import FriendsPanel from "./FriendsPanel";
    import ScheduleModal from "./ScheduleModal";
    import PulseLoader from 'vue-spinner/src/PulseLoader.vue';

    const axios = require('axios');

    export default {
        name: "GraddTogetherContainer",
        components: {
            TopPanel,
            GenericRatingPanel,
            RateCoursesPanel,
            FriendsPanel,
            MountingPortal,
            ScheduleModal,
            PulseLoader
        },
        data: function() {
            return {
                popularCourses: [],
                interestingCourses: [],
                hardCourses: [],
                userFriends: [],
                showModal: false,
                modalSchedule: null,
                userCoursesToRate: [],
                userId: '',
                isLoading: true
            }
        },
        created: async function() {
            this.userId = await this.getLoggedInUserIdFromChromeStorage();

            const userCoursesToRateFromDb = await axios.get(`http://localhost:8080/user_course/detailed?user_id=${this.userId}`);

            this.userCoursesToRate = userCoursesToRateFromDb.data.map(elem => ({
                course_name: elem.course_name,
                course_number: elem.course_number
            }));

            const popularResponse = await axios.get(`http://localhost:8080/user_course/topPopular`);
            this.popularCourses = popularResponse.data;

            const interestingResponse = await axios.get(`http://localhost:8080/user_rating/topInteresting`);
            this.interestingCourses = interestingResponse.data;
            
            const hardResponse = await axios.get(`http://localhost:8080/user_rating/topHard`);
            this.hardCourses = hardResponse.data;

            const friendsResponse = await axios.get(`http://localhost:8080/user_friend//friendsByUser?user_id=${this.userId}`);
            this.userFriends = friendsResponse.data;

            this.isLoading = false;
        },
        mounted() {
            this.$nextTick(() => document.querySelector("h1.pull-right").innerText = "Gradd Together");
        },
        methods: {
            async getLoggedInUserIdFromChromeStorage() {
                return new Promise((resolve, reject) => {
                    try {
                        chrome.storage.sync.get('loggedUserId', function(value) {
                            resolve(value.loggedUserId);
                        })
                    } catch (ex) {
                        reject(ex);
                    }
                });
            },
            showScheduleModal(finalDraft) {
                this.showModal = true;
                this.modalSchedule = finalDraft;
            },
            closeScheduleModal() {
                this.showModal = false;
                this.modalSchedule = null;
            }
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
    .spinner-container {
        margin-top: 20% !important;
        display: flex !important;
        justify-content: center !important;
    }
</style>
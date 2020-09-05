<template>
    <MountingPortal mountTo="#main-content-container-id" name="source" append>
        <div v-if="isInManagementCollege()" class="not-available">
            <h1>אפשרות זו אינה זמינה עדיין באתר המכללה למנהל</h1>
        </div>
        <div v-else>
            <div class="spinner-container" v-if="isLoading">
                <pulse-loader :loading="isLoading" color="#007090"></pulse-loader>
            </div>

            <div class="main-container" v-if="!isLoading">
                <TopPanel/>
                <StatisticsSection
                        :popularCourses="popularCourses"
                        :interestingCourses="interestingCourses"
                        :hardCourses="hardCourses"/>
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
        </div>
    </MountingPortal>
</template>

<script>
    import { MountingPortal} from "portal-vue";
    import TopPanel from "./TopPanel/TopPanel";
    import StatisticsSection from "./StatisticsSection/StatisticsSection";
    import RateCoursesPanel from "./RateCoursesPanel";
    import FriendsPanel from "./FriendsPanel/FriendsPanel";
    import ScheduleModal from "./ScheduleModal";
    import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
    import { getLoggedInUserIdFromChromeStorage } from '../../utils/userAuth';
    import { baseUserCourseEndpoint, baseUserFriendEndpoint, baseUserRatingEndpoint } from '../../utils/api';

    const axios = require('axios');

    export default {
        name: "GraddTogetherContainer",
        components: {
            TopPanel,
            StatisticsSection,
            RateCoursesPanel,
            FriendsPanel,
            MountingPortal,
            ScheduleModal,
            PulseLoader,
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
            this.userId = await getLoggedInUserIdFromChromeStorage();

            const userCoursesToRateFromDb = await axios.get(`${baseUserCourseEndpoint}/detailed?user_id=${this.userId}`);

            this.userCoursesToRate = userCoursesToRateFromDb.data.map(elem => ({
                course_name: elem.course_name,
                course_number: elem.course_number
            }));

            const popularResponse = await axios.get(`${baseUserCourseEndpoint}/topPopular`);
            this.popularCourses = popularResponse.data;

            const interestingResponse = await axios.get(`${baseUserRatingEndpoint}/topInteresting`);
            this.interestingCourses = interestingResponse.data;
            
            const hardResponse = await axios.get(`${baseUserRatingEndpoint}/topHard`);
            this.hardCourses = hardResponse.data;

            const friendsResponse = await axios.get(`${baseUserFriendEndpoint}/friendsByUser?user_id=${this.userId}`);
            this.userFriends = friendsResponse.data;

            this.isLoading = false;
        },
        methods: {
            showScheduleModal(finalDraft) {
                this.showModal = true;
                this.modalSchedule = finalDraft;
            },
            closeScheduleModal() {
                this.showModal = false;
                this.modalSchedule = null;
            },
            isInManagementCollege() {
                return window.location.href.includes('colman');
            }
        }
    }
</script>

<style scoped>
    .main-container {
        display: flex;
        flex-direction: column;
        background-color: #f7fffd;
        box-shadow: 1px 3px 14px -2px rgba(0,0,0,0.51);
    }
    .spinner-container {
        margin-top: 20% !important;
        display: flex !important;
        justify-content: center !important;
    }

    .not-available {
        display: flex !important;
        justify-content: center !important;
    }
</style>
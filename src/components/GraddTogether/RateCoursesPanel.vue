<template>
    <div class="rate-courses-container">
        <div class="dropdown-container">
            <h4>עזור לקהילה ודרג את הקורסים שלקחת:</h4>
            <DropdownWrapper
                    :userCoursesToRate="userCoursesToRate"
                    :buttonText="dropdownButtonText"
                    v-on:show-stars="showStars"/>
        </div>
        <div class="stars-container" v-show="toggleShowStars">
            <div class="single-star-container">
                <star-rating v-model="currentCourseToRateInterestingRating"
                    :increment="0.5"
                    :star-size="35"
                    :rtl="true"></star-rating>
                <h4>רמת עניין</h4>
            </div>
            <div class="single-star-container">
                <star-rating v-model="currentCourseToRateHardRating"
                    :increment="0.5"
                    :star-size="35"
                    :rtl="true"></star-rating>
                <h4>רמת קושי</h4>
            </div>
            <button class="turquoise" @click="postRating">שלח חוות דעת</button>
        </div>
    </div>
</template>

<script>
    import DropdownWrapper from "../Dropdown/DropdownWrapper";
    import StarRating from 'vue-star-rating';
    import { getLoggedInUserIdFromChromeStorage } from '../../utils/userAuth';
    import { baseUserRatingEndpoint } from '../../utils/api';

    const axios = require('axios');
    axios.defaults.headers.post['Content-Type'] = 'application/json';

    export default {
        name: "RateCoursesPanel",
        components: {
            DropdownWrapper,
            StarRating
        },
        props: [
            'userCoursesToRate'
        ],
        data: function() {
            return {
                dropdownButtonText: 'בחר קורס...',
                toggleShowStars: false,
                currentCourseToRate: '',
                currentCourseToRateInterestingRating: 0,
                currentCourseToRateHardRating: 0
            }
        },
        methods: {
            showStars(course_number) {
                this.toggleShowStars = true;
                this.currentCourseToRate = course_number;
                this.currentCourseToRateInterestingRating = 0;
                this.currentCourseToRateHardRating = 0;
            },
            async postRating() {
                const user_id = await getLoggedInUserIdFromChromeStorage();
                try {
                    await axios.post(`${baseUserRatingEndpoint}/byCourseNumber`,
                                    {
                                        user_id: user_id,
                                        course_number: this.currentCourseToRate,
                                        interesting_rating: this.currentCourseToRateInterestingRating,
                                        hard_rating: this.currentCourseToRateHardRating
                                    });
                    alert("הדירוג נשלח בהצלחה");
                }
                catch (e) {
                    console.log(e);
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .rate-courses-container {
        display: flex;
        flex-direction: column;
    }
    .dropdown-container {
        display: flex;
        margin-top: 5%;
        margin-right: 5%;

        h4 {
            margin-left: 20px !important;
        }
    }
    .stars-container {
        display: flex;
        margin-top: 1%;
        margin-right: 10%;
        justify-content: space-evenly;
    }

    .turquoise {
        margin-left: 10%;
        border-top: 0 !important;
        cursor: pointer !important;
        margin-right: 10px !important;
        background: #1abc9c !important;
        border-bottom: #16a085 3px solid !important;
        border-left: #16a085 1px solid !important;
        border-right: #16a085 1px solid !important;
        border-radius: 6px !important;
        text-align: center !important;
        color: white !important;
        padding: 10px !important;
        float: left !important;
        font-size: 1em !important;
        font-weight: bold !important;
        height: 10% !important;
        &:hover {
            opacity: 0.8 !important;
        }
    }
    .single-star-container{
        display: flex;
        flex-direction: column;
        align-items: center;
        flex-basis: 20%;
    }
    
</style>
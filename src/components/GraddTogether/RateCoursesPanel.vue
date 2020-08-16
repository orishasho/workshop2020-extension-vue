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
            <button class="turquoise">שלח חוות דעת</button>
        </div>
    </div>
</template>

<script>
    const axios = require('axios');
    import DropdownWrapper from "../Dropdown/DropdownWrapper";
    import StarRating from 'vue-star-rating';
    export default {
        name: "RateCoursesPanel",
        components: {
            DropdownWrapper,
            StarRating
        },
        data: function() {
            return {
                userCoursesToRate: [],
                dropdownButtonText: 'בחר קורס...',
                toggleShowStars: false,
                currentCourseToRate: '',
                currentCourseToRateInterestingRating: 0,
                currentCourseToRateHardRating: 0
            }
        },
        created: async function() {
            try {
                console.log('getting data')
                const loggedUserId = await this.getLoggedInUserIdFromChromeStorage();
                const response = await axios.get(`http://localhost:8080/user_course/detailed?user_id=${loggedUserId}`);
                this.userCoursesToRate = response.data.map(elem => ({
                    course_name: elem.course_name,
                    course_number: elem.course_number
                }));
            } catch(e) {
                console.log(e)
            }
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
            showStars(course_number) {
                this.toggleShowStars = true;
                this.currentCourseToRate = course_number;
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
        margin-right: 10%;

        h4 {
            flex-basis: 28% !important;
        }
    }
    .stars-container {
        display: flex;
        margin-top: 1%;
        margin-right: 10%;

        button {
            border-top: 0 !important;
            cursor: pointer !important;
            .turquoise {
                margin-right: 10px !important;
                width: 100px !important;
                background: #1abc9c !important;
                border-bottom: #16a085 3px solid !important;
                border-left: #16a085 1px solid !important;
                border-right: #16a085 1px solid !important;
                border-radius: 6px !important;
                text-align: center !important;
                color: white !important;
                padding: 10px !important;
                float: left !important;
                font-size: 12px !important;
                font-weight: 800 !important;
                &:hover {
                    opacity: 0.8 !important;
                }
            }
        }
    }
    .single-star-container{
        display: flex;
        flex-direction: column;
    }
    
</style>
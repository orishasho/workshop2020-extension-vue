<template>
    <div class="rate-courses-container">
        <h4>דרג את הקורסים שביצעת:</h4>
        <DropdownWrapper
                :userCoursesToRate="userCoursesToRate"
                :buttonText="dropdownButtonText"/>
    </div>
</template>

<script>
    const axios = require('axios');
    import DropdownWrapper from "../Dropdown/DropdownWrapper";
    export default {
        name: "RateCoursesPanel",
        components: {
            DropdownWrapper
        },
        data: function() {
            return {
                userCoursesToRate: [],
                dropdownButtonText: 'בחר קורס...'
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
            }
        }
    }
</script>

<style scoped lang="scss">
    .rate-courses-container {
        display: flex;
        margin-top: 5%;
        margin-right: 10%;

        h4 {
            flex-basis: 28% !important;
        }
    }
</style>
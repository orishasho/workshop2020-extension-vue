<template>
    <div class="user-details-container" v-if="!isLoadingUserDetails">
        <img :src="userDetails.img" class="profile-img">
        <div class="mail-name-container">
            <h3 class="user-details-h3">
                {{userDetails.name}}
                <span>
                    {{userDetails.user_email}}
                </span>
            </h3>
        </div>
    </div>
</template>

<script>
    const axios = require('axios');
    export default {
        name: "UserDetails",
        data: function() {
            return {
                userDetails: {},
                isLoadingUserDetails: true
            }
        },
        created: async function() {
            try {
                const loggedEmail = await this.getLoggedInEmailFromChromeStorage();
                const response = await axios.get(`http://localhost:8080/user?user_email=${loggedEmail}`);
                this.userDetails = response.data[0];
                this.isLoadingUserDetails = false;
            } catch(e) {
                console.log(e)
            }
        },
        methods: {
            async getLoggedInEmailFromChromeStorage() {
                return new Promise((resolve, reject) => {
                    try {
                        chrome.storage.sync.get('loggedEmail', function(value) {
                            resolve(value.loggedEmail);
                        })
                    } catch (ex) {
                        reject(ex);
                    }
                });
            }
        }
    }
</script>

<style scoped>
    .user-details-container {
        display: flex;
        flex-basis: 33%;    
        margin-right: 2%;
        margin-top: 2%;
    }
    .profile-img {
        border-radius: 50% !important; 
        max-width: 100px;
        opacity: 1;
        box-shadow: 3px 3px 20px rgba(0, 0, 0, 0.5);
        border: 2px solid rgba(255, 255, 255, 0.5);
    }
    .user-details-h3 {
        margin: 0 0 5px;
        font-weight: 400;
    }
    .user-details-h3 span {
        display: block;
        font-size: 0.6em;
        opacity: 0.75;
    }
    .mail-name-container {
        margin-right: 5%;
        margin-top: 7%;
    }
</style>
<template>
    <MountingPortal mountTo="#main-content-container-id" name="source" append>

        <div v-if="vm.isLoading" class="spinner-container">
            <pulse-loader :loading="vm.isLoading"></pulse-loader>
        </div>

        <div v-if="vm.hasUserCoursesData">

            <h5 class="rtl">מצב נוכחי:</h5>
            <DegreeProgressBar
                    :completedCredits="vm.creditsCompleted"
                    :requiredCredits="vm.totalRequiredCredits"
                    :creditsType="'נקז כללי'"/>
            <br>
            <DegreeProgressBar
                    :completedCredits="vm.mandatoryCreditsCompleted"
                    :requiredCredits="vm.mandatoryRequiredCredits"
                    :creditsType="'נקז קורסי חובה'"/>
            <br>
            <DegreeProgressBar
                    :completedCredits="vm.electiveCreditsCompleted"
                    :requiredCredits="vm.electiveRequiredCredits"
                    :creditsType="'נקז קורסי בחירה'"/>
            <br>
            <p class="rtl">
                קורס מתמטי:
                <b-icon-check-circle v-if="vm.isMathClassCompleted" variant="primary"/>
                <b-icon-x-circle v-else variant="primary" />
            </p>
            <p class="rtl">
                סדנה:
                <b-icon-check-circle v-if="vm.isWorkshopCompleted" variant="primary"/>
                <b-icon-x-circle v-else variant="primary" />
            </p>
            <br>

            <h5 class="rtl">צפי לסוף השנה:</h5>
            <DegreeProgressBar
                    :completedCredits="vm.creditsToBeCompletedByYearEnd"
                    :requiredCredits="vm.totalRequiredCredits"
                    :creditsType="'נקז כללי'"/>
            <br>
            <DegreeProgressBar
                    :completedCredits="vm.mandatoryCreditsToBeCompletedByYearEnd"
                    :requiredCredits="vm.mandatoryRequiredCredits"
                    :creditsType="'נקז קורסי חובה'"/>
            <br>
            <DegreeProgressBar
                    :completedCredits="vm.electiveCreditsToBeCompletedByYearEnd"
                    :requiredCredits="vm.electiveRequiredCredits"
                    :creditsType="'נקז קורסי בחירה'"/>
            <br>
            <p class="rtl">
                קורס מתמטי:
                <b-icon-check-circle v-if="vm.isMathClassCompletedByYearEnd" variant="primary"/>
                <b-icon-x-circle v-else variant="primary" />
            </p>
            <p class="rtl">
                סדנה:
                <b-icon-check-circle v-if="vm.isWorkshopCompletedByYearEnd" variant="primary"/>
                <b-icon-x-circle v-else variant="primary" />
            </p>

        </div>

        <div v-if="vm.showNoCoursesFound" class="no-courses-found">
            <h2>לא נמצאו נתונים עבור המשתמש בשרת</h2>
            <h3>כדי לשלוח נתוני קורסים לשרת, גש ל ״בחינות וציונים״ > ״רשימת ציונים״ > כל השנים וכל הסמסטרים</h3>
        </div>

        <div class="file-upload">
            <input
                    type="file"
                    id="imgur-upload"
                    accept="image/*"
                    @change="uploadImgToImgur">
        </div>

    </MountingPortal>

</template>

<script>
    import DegreeStatusVm from "../../view-model/degree-status-vm";
    import { instantiate } from "mmlpx"
    import { observer } from "mobx-vue";
    import DegreeProgressBar from "./DegreeProgressBar";
    import { BIconCheckCircle, BIconXCircle } from "bootstrap-vue";
    import { MountingPortal} from "portal-vue";
    import PulseLoader from 'vue-spinner/src/PulseLoader.vue';

    const axios = require('axios');

    export default observer({
        data: function () {
            return {
                vm: instantiate(DegreeStatusVm),
                imgurApiUrl: 'https://api.imgur.com/3/image'
            }
        },
        components: {
            DegreeProgressBar,
            BIconCheckCircle,
            BIconXCircle,
            MountingPortal,
            PulseLoader
        },
        mounted() {
            this.$nextTick(() => document.querySelector("h1.pull-right").innerText = "ניהול תואר");
        },
        methods: {
            async uploadImgToImgur(event) {
                const authHeader = {
                    'Authorization': 'Client-ID b0fd2fb1b5098c9'
                };

                const imgFile = event.target.files[0];

                const requestFormData = new FormData();
                requestFormData.append('image', imgFile);
                try {
                    const imgurResponse = await axios.post(
                        this.imgurApiUrl,
                        requestFormData,
                        {headers: authHeader});
                    // THIS IS THE IMAGE URL:
                    console.log(imgurResponse.data.data.link);
                } catch (e) {
                    console.log(e);
                }
            }
        }
    })
</script>

<style scoped lang="scss">
    .spinner-container {
        margin-top: 20% !important;
        display: flex !important;
        justify-content: center !important;
    }

    .no-courses-found {
        margin-top: 20% !important;
        display: flex !important;
        flex-direction: column;
        align-items: center !important;
    }

    .file-upload {
        margin-top: 20% !important;
        display: flex !important;
        justify-content: center !important;
    }
</style>


<template>
    <MountingPortal mountTo="#main-content-container-id" name="source" append>
        <div v-if="vm.isLoading" class="spinner-container">
            <pulse-loader :loading="vm.isLoading" color="#007090"></pulse-loader>
        </div>
        <div v-if="vm.hasUserCoursesData">
            <div class="degree-status-page-container">
                <div class="heading-container">
                    <h1>מצב נוכחי:</h1>
                </div>
                <div class="progress-container">
                    <DegreeProgressBar
                        :creditsCompleted="vm.creditsCompleted"
                        :requiredCredits="vm.totalRequiredCredits"
                        :description="'נק״ז כללי'"/>
                    <DegreeProgressBar
                            :creditsCompleted="vm.mandatoryCreditsCompleted"
                            :requiredCredits="vm.mandatoryRequiredCredits"
                            :description="'נק״ז קורסי חובה'"/>
                    <DegreeProgressBar
                            :creditsCompleted="vm.electiveCreditsCompleted"
                            :requiredCredits="vm.electiveRequiredCredits"
                            :description="'נק״ז קורסי בחירה'"/>
                </div>
                <div class="math-workshop-container">
                    <MathOrWorkshopCheckbox
                            v-if="!vm.isManagementCollege"
                            :text="'קורס מתמטי:'"
                            :isCompleted="vm.isMathClassCompleted"/>
                    <MathOrWorkshopCheckbox
                            :text="'סדנה:'"
                            :isCompleted="vm.isWorkshopCompleted"/>
                    <MathOrWorkshopCheckbox
                            v-if="vm.isManagementCollege"
                            :text="'סמינריון:'"
                            :isCompleted="vm.isSeminarionCompleted"/>
                </div>
                <div class="heading-container">
                    <h1>צפי לסוף השנה:</h1>
                </div>
                <div class="progress-container">
                    <DegreeProgressBar
                            :creditsCompleted="vm.creditsToBeCompletedByYearEnd"
                            :requiredCredits="vm.totalRequiredCredits"
                            :description="'נק״ז כללי'"/>
                    <DegreeProgressBar
                            :creditsCompleted="vm.mandatoryCreditsToBeCompletedByYearEnd"
                            :requiredCredits="vm.mandatoryRequiredCredits"
                            :description="'נק״ז קורסי חובה'"/>
                    <DegreeProgressBar
                            :creditsCompleted="vm.electiveCreditsToBeCompletedByYearEnd"
                            :requiredCredits="vm.electiveRequiredCredits"
                            :description="'נק״ז קורסי בחירה'"/>
                </div>
                <div class="math-workshop-container">
                    <MathOrWorkshopCheckbox
                            v-if="!vm.isManagementCollege"
                            :text="'קורס מתמטי:'"
                            :isCompleted="vm.isMathClassCompletedByYearEnd"/>
                    <MathOrWorkshopCheckbox
                            :text="'סדנה:'"
                            :isCompleted="vm.isWorkshopCompletedByYearEnd"/>
                    <MathOrWorkshopCheckbox
                            v-if="vm.isManagementCollege"
                            :text="'סמינריון:'"
                            :isCompleted="vm.isSeminarionCompletedByYearEnd"/>
                </div>
            </div>
        </div>
        <div v-if="vm.showNoCoursesFound" class="no-courses-found">
            <h2>לא נמצאו נתונים עבור המשתמש בשרת</h2>
            <h3>כדי לשלוח נתוני קורסים לשרת, גש ל ״בחינות וציונים״ > ״רשימת ציונים״ > כל השנים וכל הסמסטרים</h3>
        </div>

    </MountingPortal>

</template>

<script>
    import DegreeStatusVm from "../../view-model/degree-status-vm";
    import { instantiate } from "mmlpx"
    import { observer } from "mobx-vue";
    import DegreeProgressBar from "./DegreeProgressBar";
    import MathOrWorkshopCheckbox from "./MathOrWorkshopCheckbox";
    import { MountingPortal} from "portal-vue";
    import PulseLoader from 'vue-spinner/src/PulseLoader.vue';

    export default observer({
        data: function () {
            return {
                vm: instantiate(DegreeStatusVm)
            }
        },
        components: {
            DegreeProgressBar,
            MathOrWorkshopCheckbox,
            MountingPortal,
            PulseLoader
        }
    })
</script>

<style scoped lang="scss">

    .degree-status-page-container {
        display: flex !important;
        flex-direction: column !important;

        .heading-container {
            display: flex !important;
            justify-content: center !important;
            margin-bottom: 20px !important;
        }

        .progress-container {
            display: flex !important;
            justify-content: space-evenly !important;
        }

        .math-workshop-container {
            display: flex !important;
            flex-direction: column !important;
            margin-top: 20px !important;
            margin-bottom: 20px !important;
        }
    }

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


</style>


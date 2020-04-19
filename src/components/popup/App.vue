<template>
    <div>
        <div v-if="vm.hasUserCoursesData">

            <h5 class="rtl">מצב נוכחי:</h5>
            <CreditsStats
                    :completedCredits="vm.creditsCompleted"
                    :requiredCredits="vm.totalRequiredCredits"
                    :creditsType="'נקז כללי'"/>
            <br>
            <CreditsStats
                    :completedCredits="vm.mandatoryCreditsCompleted"
                    :requiredCredits="vm.mandatoryRequiredCredits"
                    :creditsType="'נקז קורסי חובה'"/>
            <br>
            <CreditsStats
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
            <CreditsStats
                    :completedCredits="vm.creditsToBeCompletedByYearEnd"
                    :requiredCredits="vm.totalRequiredCredits"
                    :creditsType="'נקז כללי'"/>
            <br>
            <CreditsStats
                    :completedCredits="vm.mandatoryCreditsToBeCompletedByYearEnd"
                    :requiredCredits="vm.mandatoryRequiredCredits"
                    :creditsType="'נקז קורסי חובה'"/>
            <br>
            <CreditsStats
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
        <p v-else> Couldn't find courses data </p>
    </div>
</template>

<script>
    import AppVm from "../../view-model/app-vm";
    import { instantiate } from "mmlpx"
    import { observer } from "mobx-vue";
    import CreditsStats from "./credits-stats/CreditsStats";
    import { BIconCheckCircle, BIconXCircle } from "bootstrap-vue"

    export default observer({
        data: function () {
            return {
                vm: instantiate(AppVm)
            }
        },
        components: {
            CreditsStats,
            BIconCheckCircle,
            BIconXCircle
        }
    })
</script>

<style lang="scss">
    /*p {*/
    /*    font-size: 20px;*/
    /*}*/
    body{
        width: 450px !important;
        height:450px !important;
    }
    .rtl {
        direction: rtl;
        text-align: right;
    }
</style>

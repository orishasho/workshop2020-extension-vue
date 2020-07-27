<template>
    <MountingPortal mountTo="#main-content-container-id" name="source" append>
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
        <p v-else> Couldn't find courses data </p>
    </MountingPortal>

</template>

<script>
    import DegreeStatusVm from "../../view-model/degree-status-vm";
    import { instantiate } from "mmlpx"
    import { observer } from "mobx-vue";
    import DegreeProgressBar from "./DegreeProgressBar";
    import { BIconCheckCircle, BIconXCircle } from "bootstrap-vue";
    import { MountingPortal} from "portal-vue";

    export default observer({
        data: function () {
            return {
                vm: instantiate(DegreeStatusVm)
            }
        },
        components: {
            DegreeProgressBar,
            BIconCheckCircle,
            BIconXCircle,
            MountingPortal
        }
    })
</script>


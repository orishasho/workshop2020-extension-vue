<template>
  <div>
    <div v-if="vm.hasUserCoursesData">
      <p>נק״ז שהושלמו:</p>
      <CreditsStats
              :firstCreditsStat="vm.creditsCompleted"/>
      <p>צפי לנק״ז שיושלמו עד סוף השנה:</p>
      <CreditsStats
              :firstCreditsStat="vm.creditsToBeCompletedByYearEnd"/>
      <p>נק״ז בחירה שהושלמו:</p>
      <CreditsStats
              :firstCreditsStat="vm.electiveCreditsCompleted"/>
      <p>נק״ז חובה שהושלמו:</p>
      <CreditsStats
              :firstCreditsStat="vm.mandatoryCreditsCompleted"/>
    </div>
    <p v-else> Couldn't find courses data </p>

  </div>
</template>

<script>
  import AppVm from "../../view-model/app-vm";
  import { instantiate } from "mmlpx"
  import { observer } from "mobx-vue";
  import CreditsStats from "./credits-stats/CreditsStats";

  export default observer({
    data: function () {
      return {
        vm: instantiate(AppVm)
      }
    },
    components: {
      CreditsStats
    }
  })
</script>

<style lang="scss" scoped>
  p {
    font-size: 20px;
  }
</style>

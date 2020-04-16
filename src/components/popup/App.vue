<template>
  <div>
    <div v-if="vm.hasUserCoursesData">
      <p>Credits completed:</p>
      <CreditsStats
              :firstCreditsStat="vm.creditsCompleted"/>
      <p>Credits to be completed by year end:</p>
      <CreditsStats
              :firstCreditsStat="vm.creditsToBeCompletedByYearEnd"/>
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

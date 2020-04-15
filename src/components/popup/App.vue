<template>
  <div>
    <p>{{message}}</p>
    <p v-if="vm.userCourses.length > 0"> Credits completed: {{vm.creditPointsCompleted}} </p>
    <p v-else>Couldn't find courses data</p>
  </div>
</template>

<script>
  import AppVm from "../../view-model/app-vm";
  import { instantiate } from "mmlpx"
  import { observer } from "mobx-vue";

  export default observer({
  data: function () {
    return {
      message: 'Hello world from Vue!',
      vm: instantiate(AppVm)
    }
  }
})
</script>

<style lang="scss" scoped>
p {
  font-size: 20px;
}
</style>

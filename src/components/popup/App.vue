<template>
  <div>
    <p>{{message}}</p>
<!--    <ul>-->
<!--      <li v-for="beer in beers"><p>{{beer}}</p></li>-->
<!--    </ul>-->
    <p v-if="vm.userCourses.length > 0"> Credits completed: {{vm.creditPointsCompleted}} </p>
    <p v-else>Couldn't find courses data</p>
  </div>
</template>

<script>
  import AppVm from "../../view-model/app-vm";
  import { instantiate } from "mmlpx"
export default {
  data: function () {
    return {
      // beers: [],
      message: 'Hello world from Vue!',
      vm: instantiate(AppVm)
    }
  // },
  // created() {
  //   this.fetchBeers()
  //   console.dir(this.vm.userCourses);
  // },
  //
  // methods: {
  //   async fetchBeers() {
  //     this.beers = await fetch('https://api.punkapi.com/v2/beers')
  //             .then(res => res.json())
  //             .then(beersArray => beersArray.map(beer => beer.name));
  //   }
  // }
}



</script>

<style lang="scss" scoped>
p {
  font-size: 20px;
}
</style>

<template>
  <div>
    <p>{{message}}</p>
    <ul>
      <li v-for="beer in beers"><p>{{beer}}</p></li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      beers: [],
      message: 'Hello world from Vue!'
    }
  },

  created() {
    this.fetchBeers();
  },

  methods: {
    // fetchBeers() {
    //   const context = this;
    //   fetch('https://api.punkapi.com/v2/beers')
    //   .then(res => res.json())
    //   .then(beersArray => {
    //     context.beers = beersArray.map(beer => beer.name);
    //   });
    // }
    async fetchBeers() {
      this.beers = await fetch('https://api.punkapi.com/v2/beers')
                          .then(res => res.json())
                          .then(beersArray => beersArray.map(beer => beer.name));
    }
  }

}
</script>

<style lang="scss" scoped>
p {
  font-size: 20px;
}
</style>

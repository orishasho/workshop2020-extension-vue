<template>
  <div>
    <p>{{message}}</p>
    <ul>
      <li v-for="fruit in fruitList">{{fruit}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data () {
    return {
      fruitList: [],
      message: 'Hello world from Vue!'
    }
  },

  created() {
    this.initFruitList();
  },

  methods: {
    initFruitList() {
      this.fruitList = ['Apple', 'Banana', 'Strawberry', 'Peach', 'Pear'];
      console.log('init')
    }
  }

}
</script>

<style lang="scss" scoped>
p {
  font-size: 20px;
}
</style>

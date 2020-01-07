<template>
  <div class="container">
    <!--<h2>{{subGraph}}</h2>-->
    <a-input-group compact>
      <a-input style="width: 40%" defaultValue="查询的内容" v-model="subGraph" />
      <a-button type="primary" @click="go">GO</a-button>
    </a-input-group>
    <div class="container">
      <chart :noRoot="true"></chart>
    </div>
  </div>
</template>

<script>
  import {mapActions, mapState} from 'vuex'
  import chart from '../common/chart2'

  export default {
    components: {chart},
    data() {
      return {
        id: this.$route.params.id,
        subGraph:''
      }
    },
    methods: {
      ...mapActions(["computeZT_read", "getAllGraph"]),
      go(){
        this.getAllGraph(this.subGraph)
      }
    },
    mounted() {
      const self = this
      this.computeZT_read().then((list) => {
        if (list)
          for (var i = 0; i < list.length; i++) {
            if (list[i].id == this.id) {
              this.subGraph = `${list[i].query};g=sub.traversal();g.V()`
              self.getAllGraph(this.subGraph)
              return
            }
          }
      })
    },
  }
</script>

<style scoped>

</style>

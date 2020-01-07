<template>
  <div class="container">
    <div class="container">
      <zoom-chart :noRoot="true"></zoom-chart>
    </div>
  </div>
</template>

<script>
  import zoomChart from '@/components/common/chart'

  export default {
    components: {zoomChart},
    data() {
      return {
      }
    },
    beforeDestroy() {
      this.$store.dispatch('clear', ['component_root', 'component_graph', 'component_chart'])
    },
    mounted() {
      this.$store.dispatch('getOWLGraph')
    },
    methods: {
    }
  }
</script>

<style></style>

<!-- <script>
 import { Bar } from 'vue-chartjs'

 export default {
   name: 'barchart',
   extends: Bar,
   props: ['data', 'options'],
   mounted () {
     this.renderChart(this.data, this.options)
   }
 }
</script> -->



<!-- updated vue 3 code -->

<script>
import { Bar } from 'vue-chartjs'

export default {
  name: 'barchart',
  components: {
    Bar
  },
  props: {
    data: Object,
    options: Object
  },
  mounted() {
    this.$refs.barChart.renderChart(this.data, this.options)
  }
}
</script>

<template>
  <Bar ref="barChart" :chart-data="data" :chart-options="options" />
</template>


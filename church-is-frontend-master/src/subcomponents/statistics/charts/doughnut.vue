<!-- <script>
    import { Doughnut } from 'vue-chartjs'

    export default {
    extends: Doughnut,
    props: ['data', 'options'],
    mounted () {
        this.renderChart(this.data, this.options)
    }
}
</script> -->



<!-- updated vue 3 code -->

<script>
import { defineComponent } from 'vue'
import { Doughnut } from 'vue-chartjs'

export default defineComponent({
  name: 'DoughnutChart',
  components: {
    Doughnut
  },
  props: {
    data: Object,
    options: Object
  },
  mounted() {
    this.$refs.doughnutChart.renderChart(this.data, this.options)
  }
})
</script>

<template>
  <Doughnut ref="doughnutChart" :chart-data="data" :chart-options="options" />
</template>


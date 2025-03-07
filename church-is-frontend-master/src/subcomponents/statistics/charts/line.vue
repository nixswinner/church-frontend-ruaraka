<!-- <!-- <script>
import { Line } from 'vue-chartjs'

export default {
extends: Line,
props: ['data', 'options'],
mounted () {
    this.renderChart(this.data, this.options)
}
}
</script> -->

<!-- updated vue 3 code -->


<script>
import { defineComponent, ref, onMounted } from 'vue'
import { Line } from 'vue-chartjs'

export default defineComponent({
  name: 'LineChart',
  components: {
    Line
  },
  props: {
    data: Object,
    options: Object
  },
  setup(props) {
    const chartRef = ref(null)

    onMounted(() => {
      if (chartRef.value) {
        chartRef.value.renderChart(props.data, props.options)
      }
    })

    return { chartRef }
  }
})
</script>

<template>
  <Line ref="chartRef" :chart-data="data" :chart-options="options" />
</template>

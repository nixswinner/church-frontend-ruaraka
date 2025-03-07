
<!-- updated vue 3 code -->


<template>
    <div class="offering-stats">
        <!-- income stats -->
        <div v-if="data.datasets.length">
            <h3>other incomes grouped by type</h3>
            <barchart :data="data" :options="options" />
        </div>
        <div v-else>
            loading data ...
        </div>
    </div>
</template>


<script>
import barchart from '@/subcomponents/statistics/charts/bar.vue'
import { watch, ref, onMounted } from 'vue'
import axios from 'axios'

export default {
    name: 'incomestats',
    components: { barchart },
    props: {
        msg: String
    },
    setup() {
        const income_general_stats = ref(null)
        const data = ref({
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: []
        })

        const options = ref({
            scales: {
                xAxes: [{ stacked: true }],
                yAxes: [{ stacked: true }]
            }
        })

        const fetchData = () => {
            axios.get(`${window.BASE_URL}/api/finance/income-general-stats/`)
                .then(response => {
                    income_general_stats.value = response.data
                })
                .catch(() => {
                    console.log('error while fetching statistics for your offerings')
                })
        }

        watch(income_general_stats, (newStats) => {
            if (newStats) {
                for (const type in newStats[0].stats) {
                    const this_type = newStats[0].stats[type].type
                    const dataPoints = []

                    for (const month in newStats) {
                        for (const income_type in newStats[month].stats) {
                            const type_this_month = newStats[month].stats[income_type].type
                            const total_this_month = newStats[month].stats[income_type].total_for_type

                            if (type_this_month === this_type) {
                                dataPoints.push(total_this_month)
                            }
                        }
                    }

                    const dataset = {
                        label: this_type,
                        backgroundColor: "#" + ((1 << 24) * Math.random() | 0).toString(16),
                        data: dataPoints
                    }

                    data.value.datasets.push(dataset)
                }
            }
        })

        onMounted(fetchData)

        return {
            income_general_stats,
            data,
            options
        }
    }
}
</script>




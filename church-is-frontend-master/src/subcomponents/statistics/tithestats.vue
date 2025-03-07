<!-- updated vue 3 code -->


<template>
    <div class="tithe-stats">
        <div v-if="data.datasets.length" style="max-height: 40%">
            <barchart :data="data" />
        </div>
        <div v-else>
            loading data ...
        </div>
    </div>
</template>

<script>
import barchart from '@/subcomponents/statistics/charts/bar.vue'

export default {
    name: 'tithestats',
    components: { barchart },
    props: {
        msg: String
    },
    watch: {
        tithe_general_stats() {
            var totals = []
            // totals
            if (this.tithe_general_stats) {
                for (var i in this.tithe_general_stats) {
                    var stat = this.tithe_general_stats[i]
                    totals.push(stat.total_this_month)
                }
                var totalsDataset = {
                    label: "total for month",
                    backgroundColor: "#" + ((1 << 24) * Math.random() | 0).toString(16),
                    data: totals
                }
                this.data.datasets.push(totalsDataset)
            }

            // average
            var averages = []
            if (this.tithe_general_stats) {
                for (var i in this.tithe_general_stats) {
                    var stat = this.tithe_general_stats[i]
                    averages.push(stat.avg_per_member)
                }
                var averagesDataset = {
                    label: "average per member",
                    backgroundColor: "#" + ((1 << 24) * Math.random() | 0).toString(16),
                    data: averages
                }
                this.data.datasets.push(averagesDataset)
            }
        }
    },

    created() {
        this.fetchData()
    },

    data() {
        return {
            tithe_general_stats: null,
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: []
            }
        }
    },

    methods: {
        fetchData() {
            this.$http.get(this.$BASE_URL + '/api/finance/tithe-general-stats/')
                .then(response => {
                    this.tithe_general_stats = response.data
                })
                .catch(() => {
                    console.log('error while fetching statistics for tithes')
                })
        }
    }
}
</script>


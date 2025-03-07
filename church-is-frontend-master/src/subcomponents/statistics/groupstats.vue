


<!-- updated vue 3 code -->

<template>
    <div class="member-stats">
        <!-- age distribution -->
        <div v-if="group_data.datasets.length">
            <h3>Member distribution</h3>
            <doughnutchart :data="group_data" />
        </div>
    </div>
</template>


<script>
import barchart from '@/subcomponents/statistics/charts/bar.vue'
import doughnutchart from '@/subcomponents/statistics/charts/doughnut.vue'
import { watch, ref, onMounted } from 'vue'
import axios from 'axios'

export default {
    name: 'tithestats',
    components: { barchart, doughnutchart },
    props: {
        msg: String
    },
    setup() {
        const members_in_groups = ref(0)
        const new_members_stats = ref(null)
        const group_general_stats = ref(null)
        const data = ref({
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: []
        })
        const group_data = ref({
            labels: [],
            datasets: [
                {
                    data: [],
                    backgroundColor: []
                }
            ]
        })

        const fetchData = () => {
            axios.get(`${process.env.BASE_URL}/api/groups/group-general-stats/`)
                .then(response => {
                    group_general_stats.value = response.data
                })
                .catch(() => {
                    console.log('error while fetching statistics for groups')
                })
        }

        watch(group_general_stats, (newVal) => {
            if (newVal && newVal.length > 0) {
                const stats = newVal[0].stats
                members_in_groups.value = newVal[0].total_members_in_groups
                stats.forEach(group => {
                    group_data.value.labels.push(group.group)
                    group_data.value.datasets[0].backgroundColor.push("#" + ((1 << 24) * Math.random() | 0).toString(16))
                    group_data.value.datasets[0].data.push(group.members_count)
                })
            }
        })

        onMounted(fetchData)

        return {
            members_in_groups,
            new_members_stats,
            group_general_stats,
            data,
            group_data,
            fetchData
        }
    }
}
</script>

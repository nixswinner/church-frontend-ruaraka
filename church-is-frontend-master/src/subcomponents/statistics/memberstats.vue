<!-- updated vue 3 code -->

<template>
    <div class="member-stats col-sm-12 col-lg-8">
        <div v-if="data.datasets.length">
            <h3>New members</h3>
            <barchart :data="data"/>
        </div>
        <div v-else>
            loading data ...
        </div>

        <!-- age distribution -->
        <div class="mt-4" v-if="age_distribution_data.datasets.length">
            <h3>Age distribution</h3>
            <div class="col-4" style="background-color: ghostwhite; border-radius: 5px">
                <h1><span class="label label-secondary text-secondary">{{ recorded_ages }}</span></h1>
                recorded ages
            </div>
            <doughnutchart :data="age_distribution_data"/>
        </div>
    </div>
</template>


<script>
import barchart from '@/subcomponents/statistics/charts/bar.vue';
import doughnutchart from '@/subcomponents/statistics/charts/doughnut.vue';
import { ref, watch, onMounted } from 'vue';

export default {
    name: 'tithestats',
    components: { barchart, doughnutchart },
    props: {
        msg: String
    },
    setup() {
        const recorded_ages = ref(0);
        const new_members_stats = ref(null);
        const age_distribution_stats = ref(null);
        const data = ref({
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            datasets: []
        });
        const age_distribution_data = ref({
            labels: [],
            datasets: [
                {
                    data: [],
                    backgroundColor: []
                }
            ]
        });

        const fetchData = () => {
            // new_members_stats
            fetch(`${window.BASE_URL}/api/members/new-member-count/`)
                .then(response => response.json())
                .then(data => {
                    new_members_stats.value = data;
                })
                .catch(() => {
                    console.log('error while fetching statistics for new members');
                });

            // age distribution stats
            fetch(`${window.BASE_URL}/api/members/age-distribution/`)
                .then(response => response.json())
                .then(data => {
                    age_distribution_stats.value = data;
                })
                .catch(() => {
                    console.log('error while fetching statistics for age distribution');
                });
        };

        watch(age_distribution_stats, (newVal) => {
            if (newVal) {
                const stats = newVal[0].stats;
                recorded_ages.value = newVal[0].members_with_recorded_ages;
                for (const range in stats) {
                    age_distribution_data.value.labels.push(stats[range].range);
                    age_distribution_data.value.datasets[0].backgroundColor.push(
                        '#' + ((1 << 24) * Math.random() | 0).toString(16)
                    );
                    age_distribution_data.value.datasets[0].data.push(stats[range].total);
                }
            }
        });

        watch(new_members_stats, (newVal) => {
            if (newVal) {
                const totals = [];
                for (const stat of newVal) {
                    totals.push(stat.total);
                }
                const dataset = {
                    label: "new members",
                    backgroundColor: '#' + ((1 << 24) * Math.random() | 0).toString(16),
                    data: totals
                };
                data.value.datasets.push(dataset);
            }
        });

        onMounted(fetchData);

        return {
            recorded_ages,
            new_members_stats,
            age_distribution_stats,
            data,
            age_distribution_data
        };
    }
};
</script>



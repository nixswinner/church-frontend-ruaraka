<!-- updated vue 3 code -->

<template>
    <div class="project-stats">
        <div v-if="data2.datasets.length">
            <h3>project sizes</h3>
            <doughnutchart :data="data2" />
        </div>
        <div v-else>
            loading data
        </div>
        <div v-if="data.datasets.length">
            <h3>project financing stats</h3>
            <barchart :data="data" :options="options" />
        </div>
        <div v-else>
            loading data ...
        </div>
    </div>
</template>


<script>
import { defineComponent, ref, watch, onMounted } from "vue";
import barchart from "@/subcomponents/statistics/charts/bar.vue";
import doughnutchart from "@/subcomponents/statistics/charts/doughnut.vue";

export default defineComponent({
    name: "projectstats",
    components: { barchart, doughnutchart },
    props: {
        msg: String,
    },
    setup() {
        const project_general_stats = ref(null);
        const project_size_stats = ref(null);

        const options = ref({
            scales: {
                xAxes: [{ stacked: true }],
                yAxes: [{ stacked: true }],
            },
        });

        const data = ref({
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
            datasets: [],
        });

        const data2 = ref({
            labels: [],
            datasets: [
                {
                    backgroundColor: [],
                    data: [],
                },
            ],
        });

        watch(project_size_stats, (newVal) => {
            if (newVal) {
                newVal.forEach((project_stat) => {
                    data2.value.labels.push(project_stat.project);
                    data2.value.datasets[0].backgroundColor.push("#" + ((1 << 24) * Math.random() | 0).toString(16));
                    data2.value.datasets[0].data.push(project_stat.size);
                });
            }
        });

        watch(project_general_stats, (newVal) => {
            if (newVal) {
                const contributions = [];
                const settlements = [];

                newVal[0].months.forEach((month_stats) => {
                    contributions.push(month_stats.contribution_this_month);
                    settlements.push(month_stats.settled_pledges_this_month);
                });

                data.value.datasets.push({
                    label: "contributions",
                    backgroundColor: "#" + ((1 << 24) * Math.random() | 0).toString(16),
                    data: contributions,
                });

                data.value.datasets.push({
                    label: "pledge settlements",
                    backgroundColor: "#" + ((1 << 24) * Math.random() | 0).toString(16),
                    data: settlements,
                });
            }
        });

        const fetchData = () => {
            // Project financing stats
            fetch("/api/projects/project-general-stats/")
                .then((response) => response.json())
                .then((json) => (project_general_stats.value = json))
                .catch(() => console.log("error while fetching statistics for projects"));

            // Project size stats
            fetch("/api/projects/project-size-stats/")
                .then((response) => response.json())
                .then((json) => (project_size_stats.value = json))
                .catch(() => console.log("error while fetching statistics for project sizes"));
        };

        onMounted(fetchData);

        return {
            options,
            data,
            data2,
            project_general_stats,
            project_size_stats,
        };
    },
});
</script>


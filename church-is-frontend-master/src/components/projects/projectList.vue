<!-- updated vue 3 code -->




<template>
    <div>
        <nav aria-label="breadcrumb" class="continer">
            <ol class="breadcrumb">
                <li class="breadcrumb-item">
                    <span class="backButton">
                        <router-link style="text-decoration: none" :to="{ name: 'Home' }">Home</router-link>
                    </span>
                </li>
                <li class="breadcrumb-item">
                    <span class="backButton">
                        <router-link style="text-decoration: none" :to="{ name: 'generalFinance' }">finances</router-link>
                    </span>
                </li>
                <li class="breadcrumb-item active" aria-current="page">projects</li>
            </ol>
        </nav>

        <div class="continer">
            <div class="row">
                <!-- NAVIGATION ON THE LEFT -->
                <div class="col-12 col-sm-10 col-md-8 col-lg-2">
                    <div class="d-none nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                        <a class="action-list list-group-item list-group-item-action border-0" data-bs-toggle="pill" href="#inProgress" role="tab" aria-controls="members" aria-selected="true">
                            <img style="width: 20px; height: auto" src="@/assets/icons/icons8-present-48.png">
                            in-progress
                        </a>
                        <a class="action-list list-group-item list-group-item-action border-0" data-bs-toggle="pill" href="#completed" role="tab" aria-controls="activity" aria-selected="false" @click="getGroupActivity">
                            <img style="width: 20px; height: auto" src="@/assets/icons/icons8-future-64.png">
                            completed
                        </a>
                    </div>
                </div>

                <!-- CONTENT AT CENTER -->
                <div class="tab-content col">
                    <div class="tab-pane fade show active" id="inProgress" role="tabpanel" aria-labelledby="profile-tab"></div>
                    <h3 class="font-weight-bold"> Projects</h3>
                    <hr>
                    <p class="text-center">
                        <a class="btn btn-sm btn-outline-secondary dropdown-toggle" data-bs-toggle="collapse" href="#statsTab" role="button" aria-expanded="false" aria-controls="statsTab">
                            more stats
                        </a>
                    </p>
                    <div class="collapse" id="statsTab">
                        <div class="card card-body outline-0">
                            <projectstats msg="expenditure stats" />
                        </div>
                        <!-- show this button on smaller devices -->
                        <div class="d-sm-block d-md-none">
                            <a href="#" data-bs-toggle="modal" data-bs-target="#addProject" style="text-decoration: none">
                                <div class="btn btn-success add-button">
                                    <b>+</b> add project
                                </div>
                            </a>
                        </div>
                    </div>

                    <div class="col-8 center-div" v-if="fetch_data_error.length > 0">
                        <div class="center-div">
                            <img style="height: 64px" src="@/assets/icons/icons8-wi-fi-off-64.png">
                            <p class="text-info">check your connection</p>
                        </div>
                    </div>

                    <div v-if="fetch_data_error.length == 0">
                        <span>
                            found <span class="mt-4 badge badge-pill badge-secondary">{{ foundItems }}</span>
                        </span>
                        <table class="mt-4 table table-responsive-sm table-borderless">
                            <thead>
                                <th>project name</th>
                                <th>required</th>
                                <th>percentage funded</th>
                            </thead>
                            <tbody>
                                <tr v-for="data in projects.response" :key="data.id">
                                    <td>
                                        <router-link class="text-secondary" style="text-decoration: none;" :to="'/projectDetail/' + data.id + '/'">
                                            {{ data.name }}
                                        </router-link>
                                    </td>
                                    <td>
                                        KSh {{ humanize(data.required_amount) }}
                                    </td>
                                    <td class="text-secondary">
                                        {{ data.percentage_funded }} %
                                    </td>
                                    <td>
                                        <router-link class="text-muted" style="text-decoration: none;" :to="'/projectDetail/' + data.id + '/'">
                                            <img style="width: 20px; height: auto" src="@/assets/icons/icons8-right-arrow-50.png">
                                        </router-link>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- ACTIONS ON THE RIGHT -->
                <div class="col-12 col-sm-10 col-md-5 col-lg-3">
                    <div style="padding: 0px 0px 25px 10px">
                        <a href="#" data-bs-toggle="modal" data-bs-target="#addProject" style="text-decoration: none">
                            <div class="btn btn-success add-button">
                                <b>+</b> add project
                            </div>
                        </a>
                    </div>

                    <div class="list-group font-weight-bold">
                        <button type="button" class="d-flex justify-content-about font-weight-bold text-muted action-list list-group-item list-group-item-action border-0" data-bs-toggle="modal" data-bs-target="#exportToCSV">
                            <img src="@/assets/icons/icons8-export-csv-30.png" style="width: 45px; height:auto"> Export To CSV
                        </button>
                    </div>
                </div>

                <!-- MODALS -->
                <div class="modal fade" id="addProject" tabindex="-1" role="dialog" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">add a project</h5>
                                <button type="button" class="close" data-bs-dismiss="modal" @click="fetchdata" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="fetchdata">Close</button>
                                <button type="button" class="btn btn-success" @click="addProject">
                                    <b>+</b>{{ add_project_button_text }}
                                    <span v-if="adding_project" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="modal fade" id="exportToCSV" tabindex="-1" role="dialog" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">export projects data to CSV</h5>
                                <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" class="btn btn-success" @click="exportData">
                                    download CSV
                                    <span v-if="exporting_data" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>


<script>
import router from "../../router";
import projectstats from '@/subcomponents/statistics/projectstats.vue'
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useStore } from "vuex";
import axios from "axios";
import FileDownload from "js-file-download";

export default {
    name: 'projectList',
    components: { projectstats },
    setup() {
        const store = useStore();

        const state = reactive({
            projects: null,
            foundItems: null,
            fetch_data_error: [],
            enable_add_project_button: false,
            add_project_button_text: 'add project',
            project_name: '',
            project_description: '',
            amount: null,
            start_date: '',
            ending_date: '',
            added_project: [],
            adding_project: false,
            csv_date: '',
            exporting_data: false
        });

        const checkLoggedIn = () => {
            if (!sessionStorage.getItem("token")) {
                router.push("/login");
            }
        };

        const fetchdata = () => {
            state.fetch_data_error = [];

            // Try local storage
            state.projects = JSON.parse(localStorage.getItem('project_list'));
            if (state.projects) {
                const array = state.projects.response;
                state.foundItems = array.length;
            }

            const currentVersion = store.getters.project_list_version;
            const version = localStorage.getItem('project_list_version');

            // Else try the network
            if (!version || version < currentVersion) {
                store.dispatch('update_isLoading', true);
                axios.get(import.meta.env.VUE_APP_BASE_URL + '/api/projects/project-list/')
                    .then(response => {
                        state.projects = { "response": response.data };
                        const array = state.projects.response;
                        state.foundItems = array.length;

                        localStorage.setItem('project_list', JSON.stringify({ "response": response.data }));
                        localStorage.setItem('project_list_version', currentVersion);
                        store.dispatch('update_isLoading', false);
                    })
                    .catch((err) => {
                        state.fetch_data_error.push(err);
                        store.dispatch('update_isLoading', false);
                    });
            }
        };

        const exportData = () => {
            state.exporting_data = true;
            axios.get(import.meta.env.VUE_APP_BASE_URL + '/api/projects/get-project-general-stats-as-csv/' + state.csv_date + '/')
                .then(response => {
                    FileDownload(response.data, "projectsReport.csv");
                    state.exporting_data = false;
                })
                .catch(() => {
                    state.exporting_data = false;
                    alert('Error while downloading CSV');
                });
        };

        const addProject = () => {
            state.add_project_button_text = 'adding project...';
            state.adding_project = true;

            axios.post(import.meta.env.VUE_APP_BASE_URL + '/api/projects/project-list/', {
                name: state.project_name,
                description: state.project_description,
                required_amount: state.amount,
                start: state.start_date,
                stop: state.ending_date
            }).then(() => {
                state.adding_project = false;
                state.project_name = '';
                state.project_description = '';
                state.amount = null;
                state.start_date = '';
                state.ending_date = '';
                state.add_project_button_text = '+ add project';

                const new_version = parseInt(localStorage.getItem('project_list_version')) + 1;
                store.dispatch('update_project_list_version', new_version);

                alert("Project added successfully");
            }).catch(() => {
                state.adding_project = false;
                alert('Failed, check date');
            });
        };

        const enableAddProjectButton = computed(() => {
            return state.project_name.length > 0 &&
                state.project_description.length > 0 &&
                state.start_date.length > 0 &&
                state.ending_date.length > 0 &&
                state.amount > 0;
        });

        watch([() => state.project_name, () => state.project_description, () => state.start_date, () => state.ending_date, () => state.amount], () => {
            state.enable_add_project_button = enableAddProjectButton.value;
        });

        onMounted(() => {
            checkLoggedIn();
            fetchdata();
        });

        return {
            state,
            fetchdata,
            exportData,
            addProject
        };
    }
};
</script>

<style>

</style>





//updated code



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
                            <a href="#" style="text-decoration: none" @click="goBack()">finances</a>
                        </span>
                    </li>
                    <li class="breadcrumb-item active" aria-current="page">
                        <span v-for="data in expenditure_type.response" :key="data.id">{{ data.type_name }}</span>
                    </li>
                </ol>
        </nav>
        <div class="continer">
            <div class="row">
                <div class="filters col-sm-8 col-md-8 col-lg-2" style="padding: 3px 3px 3px 3px"></div>
                <div class="col-sm-12 col-lg-9">
                    <div class="d-flex justify-content-between">
                        <h3>
                            <span v-for="data in expenditure_type.response" :key="data.id">{{ data.type_name }}</span>
                        </h3>
                        <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#addExpenditure">
                            + add expenditure
                        </button>
                    </div>
                    <div class="mt-5">
                        <div class="mb-4 text-muted" v-for="data in expenditure_type.response" :key="data.id">
                            <div class="d-flex justify-content-start">
                                <div class="stat-item mr-2 text-muted">
                                    Total allocated: <span class="text-secondary font-weight-bold">
                                        Ksh {{ humanize(data.total_available) }}
                                    </span>
                                </div>
                                <div class="stat-item mr-2 text-muted">
                                    Total spent: <span class="text-secondary font-weight-bold">
                                        Ksh {{ humanize(data.total.total) }}
                                    </span>
                                </div>
                                <div class="stat-item mr-2 text-muted">
                                    %age spent: <span class="text-secondary font-weight-bold">
                                        {{ humanize(data.total.percentage_used) }} %
                                    </span>
                                </div>
                                <div class="stat-item mr-2 text-muted">
                                    Spent this month: <span class="text-secondary font-weight-bold">
                                        Ksh {{ humanize(data.total_this_month) }}
                                    </span>
                                </div>
                                <div class="stat-item mr-2">
                                    Spent this year: <span class="text-secondary font-weight-bold">
                                        Ksh {{ humanize(data.total_this_year) }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <span class="mt-5 badge badge-pill badge-secondary">{{ foundItems }}</span> entries found
                    <table class="mt-5 table table-responsive-sm table-borderless">
                        <thead>
                            <tr>
                                <th>amount</th>
                                <th>date</th>
                                <th>narration</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="data in expenditures.response" :key="data.id">
                                <td>
                                    <router-link class="text-secondary" style="text-decoration: none;" :to="`/income/${data.id}/`">
                                        {{ humanize(data.amount) }}
                                    </router-link>
                                </td>
                                <td><p class="text-info">{{ $humanizeDate(data.date) }}</p></td>
                                <td><p class="text-secondary">{{ data.narration }}</p></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <!-- Add expenditure modal -->
            <div class="modal fade" id="addExpenditure" tabindex="-1" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalCenterTitle">add expenditure</h5>
                            <button id="closeAddExpenditureModal" type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form>
                                <div class="row form-group">
                                    <label class="col-3"><b>amount:</b></label>
                                    <input type="number" class="col-3 form-control" placeholder="amount" v-model="expenditure_amount">
                                    <div class="col-6 text-success" v-if="expenditure_amount > 0">
                                        <h3>KSh {{ humanize(expenditure_amount) }}</h3>
                                    </div>
                                    <div v-if="expenditure_amount_errors.length">
                                        <ul>
                                            <small>
                                                <li v-for="error in expenditure_amount_errors" :key="error">
                                                    <p class="text-danger">{{ error }}</p>
                                                </li>
                                            </small>
                                        </ul>
                                    </div>
                                </div>
                                <hr/>
                                <div class="row form-group">
                                    <label class="col-3"><b>narration:</b></label>
                                    <textarea type="text" class="col-8 form-control" rows="3" v-model="expenditure_narration"></textarea>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-success" @click="addExpenditure()">
                                <b>+</b> add expenditure
                                <span v-if="adding_expenditure" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import { ref, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import axios from 'axios';

export default {
    name: 'expenditure',
    setup() {
        const router = useRouter();
        const route = useRoute();
        const store = useStore();

        // State variables
        const fetch_data_error = ref([]);
        const foundItems = ref(0);
        const expenditure_type = ref(null);
        const expenditures = ref(null);
        const expenditure_narration = ref(null);
        const expenditure_amount = ref(null);
        const expenditure_amount_errors = ref([]);
        const adding_expenditure = ref(false);

        // Check if member is logged in
        const checkLoggedIn = () => {
            if (!sessionStorage.getItem("token")) {
                router.push("/login");
            }
        };

        // Humanize number format
        const humanize = (x) => {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        };

        // Go back to previous window
        const goBack = () => {
            window.history.back();
        };

        // Fetch data
        const fetchdata = () => {
            fetch_data_error.value = [];
            store.dispatch('update_isLoading', true);

            axios.get(`${import.meta.env.VITE_BASE_URL}/api/finance/expenditure-type/${route.params.id}/`)
                .then(response => {
                    expenditure_type.value = { "response": response.data };
                    store.dispatch('update_isLoading', false);
                })
                .catch(err => {
                    fetch_data_error.value.push(err);
                    store.dispatch('update_isLoading', false);
                });

            store.dispatch('update_isLoading', true);
            axios.get(`${import.meta.env.VITE_BASE_URL}/api/finance/expenditures-of-type/${route.params.id}/`)
                .then(response => {
                    expenditures.value = { "response": response.data };
                    foundItems.value = response.data.length;
                    store.dispatch('update_isLoading', false);
                })
                .catch(err => {
                    fetch_data_error.value.push(err);
                    store.dispatch('update_isLoading', false);
                });
        };

        // Validate expenditure form
        const expenditureFormOkay = () => {
            expenditure_amount_errors.value = [];

            if (expenditure_type.value !== null && expenditure_amount.value !== null) {
                return true;
            }
            if (expenditure_type.value === null) {
                expenditure_amount_errors.value.push("Select an income type or add one.");
                return false;
            }
            if (!(expenditure_amount.value > 0) || expenditure_amount.value === null) {
                expenditure_amount_errors.value.push("Enter an amount.");
                return false;
            }
        };

        // Add expenditure
        const addExpenditure = () => {
            if (expenditureFormOkay()) {
                adding_expenditure.value = true;
                axios.post(`${import.meta.env.VITE_BASE_URL}/api/finance/add-expenditure/`, {
                    recording_member_id: sessionStorage.getItem('member_id'),
                    expenditure_type_id: route.params.id,
                    narration: expenditure_narration.value,
                    amount: expenditure_amount.value
                })
                .then(() => {
                    expenditure_amount.value = null;
                    expenditure_narration.value = '';
                    adding_expenditure.value = false;
                    const new_version = parseInt(localStorage.getItem('expenditure_list_version')) + 1;
                    store.dispatch('update_expenditure_list_version', new_version);
                    document.getElementById('closeAddExpenditureModal').click();
                    fetchdata();
                })
                .catch(() => {
                    alert("Error while adding expenditure, check your connection and try again.");
                    adding_expenditure.value = false;
                });
            }
        };

        // Lifecycle hooks
        onMounted(() => {
            checkLoggedIn();
            fetchdata();
        });

        // Watch for route changes
        watch(() => route.path, fetchdata);

        return {
            fetch_data_error,
            foundItems,
            expenditure_type,
            expenditures,
            expenditure_narration,
            expenditure_amount,
            expenditure_amount_errors,
            adding_expenditure,
            humanize,
            goBack,
            addExpenditure
        };
    }
};
</script>

<style>
</style>

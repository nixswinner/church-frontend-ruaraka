



//updated code



<template>
  <div>
    <nav aria-label="breadcrumb" class="container">
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
          <span v-for="data in income_type.response" :key="data.id">{{ data.type_name }}</span>
        </li>
      </ol>
    </nav>
    <div class="container">
      <div class="row">
        <div class="filters col-12 col-sm-8 col-md-8 col-lg-2" style="padding: 3px"></div>
        <div class="col-lg-9 col-sm-12">
          <div class="d-flex justify-content-between">
            <h3>
              <span v-for="data in income_type.response" :key="data.id">{{ data.type_name }}</span>
            </h3>
            <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#addIncome">
              add income
            </button>
          </div>
          <p class="col-8">
          <div class="text-muted row" v-for="data in income_type.response" :key="data.id">
            <div class="row d-none d-lg-block d-xl-none">
              <div class="stat-item mr-2 text-muted">
                This month <span class="text-secondary font-weight-bold">
                  Ksh {{ humanize(data.total_this_month) }}
                </span>
              </div>
              <div class="stat-item mr-2">
                This year <span class="text-secondary font-weight-bold">
                  Ksh {{ humanize(data.total_this_year) }}
                </span>
              </div>
            </div>
          </div>
          <hr />
          <span class="badge badge-pill badge-secondary">{{ foundItems }}</span> entries found
          </p>
          <table class="table table-responsive-sm table-borderless">
            <thead>
              <tr>
                <th>amount</th>
                <th>date</th>
                <th>narration</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="data in incomes.response" :key="data.id">
                <td>
                  <router-link class="text-secondary" style="text-decoration: none" :to="`/income/` + data.id + `/`">
                    {{ humanize(data.amount) }}
                  </router-link>
                </td>
                <td>
                  <p class="text-info">{{ data.date }}</p>
                </td>
                <td>
                  <p class="text-secondary">{{ data.narration }}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- add income modal -->
        <div class="modal fade" id="addIncome" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalCenterTitle">add income</h5>
                <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <div class="alert alert-warning alert-dismissible fade show" role="alert" v-if="added_income.length > 0">
                  <strong>
                    <span v-for="data in added_income" :key="data.id">
                      income of type {{ data.type.type_name }} and amount {{ humanize(data.amount) }} successfully added
                    </span>
                  </strong>
                  <button type="button" class="close" data-bs-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <form>
                  <div class="row form-group">
                    <label class="col-3"><b>amount:</b></label>
                    <input type="number" class="col-3 form-control" placeholder="amount" v-model="income_amount" />
                    <div class="col-6 text-success" v-if="income_amount > 0">
                      <h3>KSh {{ humanize(income_amount) }}</h3>
                    </div>
                    <p v-if="income_amount_errors.length">
                      <ul>
                        <small>
                          <li v-for="error in income_amount_errors" :key="error">
                            <p class="text-danger">{{ error }}</p>
                          </li>
                        </small>
                      </ul>
                    </p>
                  </div>
                  <hr />
                  <div class="row form-group">
                    <label class="col-3"><b>narration:</b></label>
                    <textarea type="text" class="col-8 form-control" rows="3" v-model="income_narration"></textarea>
                  </div>
                </form>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" class="btn btn-success" @click="addIncome()">
                  <b>+</b> add income
                  <span v-if="adding_income" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
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
import { ref, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import axios from 'axios';

export default {
    name: 'income',
    setup() {
        const router = useRouter();
        const route = useRoute();
        const store = useStore();

        // State variables
        const fetch_data_error = ref([]);
        const foundItems = ref(0);
        const income_type = ref(null);
        const incomes = ref(null);
        const income_narration = ref(null);
        const income_type_errors = ref([]);
        const income_amount = ref(null);
        const income_amount_errors = ref([]);
        const added_income = ref([]);
        const adding_income = ref(false);

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

            axios.get(`${import.meta.env.VITE_BASE_URL}/api/finance/income-type/${route.params.id}/`)
                .then(response => {
                    income_type.value = { "response": response.data };
                    store.dispatch('update_isLoading', false);
                })
                .catch(err => {
                    fetch_data_error.value.push(err);
                    store.dispatch('update_isLoading', false);
                });

            store.dispatch('update_isLoading', true);
            axios.get(`${import.meta.env.VITE_BASE_URL}/api/finance/income-of-type/${route.params.id}/`)
                .then(response => {
                    incomes.value = { "response": response.data };
                    foundItems.value = response.data.length;
                    store.dispatch('update_isLoading', false);
                })
                .catch(err => {
                    fetch_data_error.value.push(err);
                    store.dispatch('update_isLoading', false);
                });
        };

        // Validate income form
        const incomeFormOK = () => {
            added_income.value = [];
            income_amount_errors.value = [];
            income_type_errors.value = [];

            if (income_type.value !== null && income_amount.value !== null) {
                return true;
            }
            if (income_type.value === null) {
                income_type_errors.value.push("Select an income type or add one.");
                return false;
            }
            if (!(income_amount.value > 0) || income_amount.value === null) {
                income_amount_errors.value.push("Enter an amount.");
                return false;
            }
        };

        // Add income
        const addIncome = () => {
            if (incomeFormOK()) {
                adding_income.value = true;
                axios.post(`${import.meta.env.VITE_BASE_URL}/api/finance/add-income/`, {
                    recording_member_id: sessionStorage.getItem('member_id'),
                    income_type_id: route.params.id,
                    narration: income_narration.value,
                    amount: income_amount.value
                })
                .then(response => {
                    added_income.value.push(response.data);
                    income_amount.value = null;
                    income_narration.value = '';
                    adding_income.value = false;
                    const new_version = parseInt(localStorage.getItem('income_type_list_version')) + 1;
                    store.dispatch('update_income_type_list_version', new_version);
                    alert("Income successfully added");
                    fetchdata();
                })
                .catch(err => {
                    alert(err);
                    adding_income.value = false;
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
            income_type,
            incomes,
            income_narration,
            income_type_errors,
            income_amount,
            income_amount_errors,
            added_income,
            adding_income,
            humanize,
            goBack,
            addIncome
        };
    }
};
</script>

<style >
</style>

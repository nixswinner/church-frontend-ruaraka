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
        <li class="breadcrumb-item active" aria-current="page">services</li>
      </ol>
    </nav>

    <div class="continer">
      <div class="row">
        <div class="col-12 col-sm-10 col-md-8 col-lg-2">
          <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
            <a class="action-list list-group-item list-group-item-action border-0 active" id="v-pills-expenditure-tab"
              data-bs-toggle="pill" href="#v-pills-this-month" role="tab" aria-controls="v-pills-this-month"
              aria-selected="true">all services</a>
            <a class="action-list list-group-item list-group-item-action border-0 " id="v-pills-income-tab"
              data-bs-toggle="pill" href="#v-pills-today" role="tab" aria-controls="v-pills-today"
              aria-selected="false">services today</a>
          </div>
        </div>

        <div class="col">
          <div class="tab-content" id="v-pills-tabContent">
            <!-- services today tab -->
            <div class="tab-pane fade show" id="v-pills-today" role="tabpanel" aria-labelledby="v-pills-today-tab">
              <div v-if="!services_available">
                <div class="mb-5 text-center text-muted">
                  <h3>Oops!</h3>
                  <h5>There are no services in session today</h5>
                </div>
                <hr>
              </div>
              <div v-if="services_available">
                <h3>Services Today</h3>
                <table class="table table-responsive-sm table-borderless">
                  <thead>
                    <tr>
                      <th scope="col">Service</th>
                      <th scope="col">venue</th>
                      <th scope="col">starts</th>
                      <th scope="col">ends</th>
                    </tr>
                  </thead>
                  <tbody v-if="services_today">
                    <tr class="text-muted" v-for="data in services_today.response" :key="data.service.id">
                      <td>
                        <router-link class="text-secondary" :to="`/service-bookings/` + data.service.id + `/`">
                          {{ data.service.type.name }} (today)
                        </router-link>
                      </td>
                      <td>{{ data.service.venue }}</td>
                      <td>{{ data.service.start }}</td>
                      <td>{{ data.service.end }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- default is services in general tab -->
            <div class="tab-pane fade show active" id="v-pills-this-month" role="tabpanel"
              aria-labelledby="v-pills-this-month-tab">
              <h3>All Services </h3>
              <div v-if="this_month_selected">
                <table class="table table-responsive-sm table-borderless">
                  <thead>
                    <tr>
                      <th scope="col">Service</th>
                      <th scope="col">venue</th>
                      <th scope="col">starts</th>
                      <th scope="col">ends</th>
                    </tr>
                  </thead>
                  <tbody v-if="services_this_month">
                    <tr class="text-muted" v-for="data in services_this_month.response" :key="data.service.id">
                      <td>
                        <router-link class="text-secondary" :to="`/service-bookings/` + data.service.id + `/`">
                          {{ data.service.type.name }} ({{ $humanizeDate(data.service.date) }})
                        </router-link>
                      </td>
                      <td>{{ data.service.venue }}</td>
                      <td>{{ data.service.start }}</td>
                      <td>{{ data.service.end }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-sm-10 col-md-8 col-lg-3">
          <div class="btn-group" style="padding: 0px 0px 25px 10px">
            <a href="#" data-bs-toggle="modal" data-bs-target="#addService" style="text-decoration: none">
              <div class="add-button">
                <b>+</b> add service
              </div>
            </a>
            <button type="button" class="btn btn-success dropdown-toggle dropdown-toggle-split" id="dropdownMenuReference"
              data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-reference="parent">
              <span class="sr-only">Toggle Dropdown</span>
            </button>
            <div class="dropdown-menu border-success" aria-labelledby="dropdownMenuReference">
              <a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#addServiceType">
                <b>+</b> add service type
              </a>
            </div>
          </div>
        </div>
      </div>

      <!-- add service -->
      <div class="modal fade" id="addService" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalCenterTitle">add service</h5>
              <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <!-- form fields remain unchanged -->
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-success" @click="addService">
                <b>+</b> add service
                <span v-if="adding_service" class="spinner-border spinner-border-sm" role="status"
                  aria-hidden="true"></span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- add service type -->
      <div class="modal fade" id="addServiceType" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalCenterTitle">add service type</h5>
              <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <!-- form fields remain unchanged -->
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-success" @click="addServiceType">
                <b>+</b> add service type
                <span v-if="adding_service_type" class="spinner-border spinner-border-sm" role="status"
                  aria-hidden="true"></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import axios from 'axios';

export default {
    name: 'services',
    setup() {
        const store = useStore();

        const state = reactive({
            fetch_data_error: [],
            services_today: null,
            services_available: false,
            this_month_selected: false,
            service_items: null,
            services_this_month: null,
            service_types: null,

            // Add service
            adding_service: false,
            service_type: 0,
            service_type_errors: [],
            service_venue: null,
            service_venue_errors: [],
            service_date: null,
            service_date_errors: [],
            service_start: null,
            service_period_errors: [],
            service_end: null,
            service_action: null,
            service_action_errors: [],
            service_value: null,
            service_value_errors: [],
            service_max_attendance: null,

            // Add service type
            service_type_name: '',
            service_type_description: '',
            service_type_name_errors: [],
            service_start_time: null,
            service_end_time: null,
            added_income_type: [],
        });

        const fetchData = () => {
            state.fetch_data_error = [];
            store.dispatch('update_isLoading', true);
            axios.get(`${store.state.BASE_URL}/api/services/services-today/`)
                .then(response => {
                    state.services_today = { "response": response.data };
                    state.services_available = state.services_today.response.length > 0;
                    store.dispatch('update_isLoading', false);
                })
                .catch(err => {
                    state.fetch_data_error.push(err);
                    store.dispatch('update_isLoading', false);
                });
        };

        const getServicesThisMonth = () => {
            state.this_month_selected = true;
            store.dispatch('update_isLoading', true);
            axios.get(`${store.state.BASE_URL}/api/services/services-this-month/`)
                .then(response => {
                    state.services_this_month = { "response": response.data };
                    store.dispatch('update_isLoading', false);
                })
                .catch(err => {
                    state.fetch_data_error.push(err);
                    store.dispatch('update_isLoading', false);
                });
        };

        const getServiceTypes = () => {
            store.dispatch('update_isLoading', true);
            axios.get(`${store.state.BASE_URL}/api/services/service-types/`)
                .then(response => {
                    state.service_types = { "response": response.data };
                    store.dispatch('update_isLoading', false);
                })
                .catch(() => {
                    state.found_service = [];
                    store.dispatch('update_isLoading', false);
                });
        };

        const checkAddServiceForm = () => {
            state.service_type_errors = [];
            state.service_venue_errors = [];
            state.service_date_errors = [];
            state.service_period_errors = [];
            state.service_action_errors = [];
            state.service_value_errors = [];

            if (state.service_type > 0 &&
                state.service_venue &&
                state.service_date &&
                state.service_start &&
                state.service_end) {
                return true;
            }

            if (state.service_type === 0) {
                state.service_type_errors.push("select service type");
                return false;
            }
            if (!state.service_venue || state.service_venue.length < 1) {
                state.service_venue_errors.push("enter service venue");
                return false;
            }
            if (!state.service_date || state.service_date.length < 1) {
                state.service_date_errors.push("enter service date");
                return false;
            }
            if (!state.service_start || state.service_start.length < 1) {
                state.service_period_errors.push("enter service start time");
                return false;
            }
            if (!state.service_end || state.service_end.length < 1) {
                state.service_period_errors.push("enter service ending time");
                return false;
            }
        };

        const addService = () => {
            if (checkAddServiceForm()) {
                state.adding_service = true;
                axios.post(`${store.state.BASE_URL}/api/services/add-service/`, {
                    service_type_id: state.service_type,
                    venue: state.service_venue,
                    date: state.service_date,
                    start: state.service_start + ':00',
                    end: state.service_end + ':00',
                    max_attendance: state.service_max_attendance
                }).then(response => {
                    state.adding_service = false;
                    state.service_venue = null;
                    state.service_date = null;
                    state.service_start = null;
                    state.service_end = null;
                    alert("service successfully added");
                    addServiceItem(response.data.id);
                }).catch(() => {
                    state.adding_service = false;
                    alert("error, try again later");
                });
            }
        };

        const addServiceItem = (service_id) => {
            state.adding_service = true;
            axios.post(`${store.state.BASE_URL}/api/services/add-service-item/`, {
                service_id: service_id,
                action: state.service_action,
                value: state.service_value
            }).then(() => {
                state.adding_service = false;
                fetchData();
                getServicesThisMonth();
                state.service_action = null;
                state.service_value = null;
            }).catch(() => {
                state.adding_service = false;
                alert("error, try again later");
            });
        };

        const serviceTypeFormOkay = () => {
            state.service_type_name_errors = [];
            if (state.service_type_description.length < 1) {
                state.service_type_description = "none given";
            }
            if (state.service_type_name.length > 0) {
                return true;
            }
            if (state.service_type_name.length < 1) {
                state.service_type_name_errors.push("name required");
                return false;
            }
        };

        const addServiceType = () => {
            if (serviceTypeFormOkay()) {
                state.adding_service = true;
                axios.post(`${store.state.BASE_URL}/api/services/service-types/`, {
                    name: state.service_type_name,
                    description: state.service_type_description,
                    start: state.service_start_time,
                    end: state.service_end_time
                }).then(() => {
                    state.adding_service = false;
                    state.service_type_name = '';
                    state.service_type_description = '';
                    alert("service type successfully added");
                    getServiceTypes();
                }).catch(() => {
                    state.adding_service = false;
                    alert("error, try again later");
                });
            }
        };

        onMounted(() => {
            fetchData();
            getServiceTypes();
            getServicesThisMonth();
        });

        return {
            state,
            fetchData,
            getServicesThisMonth,
            getServiceTypes,
            checkAddServiceForm,
            addService,
            addServiceItem,
            serviceTypeFormOkay,
            addServiceType
        };
    }
};
</script>

<style>
</style>

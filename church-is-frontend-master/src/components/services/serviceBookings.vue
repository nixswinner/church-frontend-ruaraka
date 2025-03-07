




<!-- updated vue 3 code -->




<template>
    <div>
        <nav aria-label="breadcrumb" class="continer">
            <ol class="breadcrumb">
                <li class="breadcrumb-item">
                    <span class="backButton">
                        <router-link style="text-decoration: none" :to="{ name: 'Home' }">
                            Home
                        </router-link>
                    </span>
                </li>
                <li class="breadcrumb-item">
                    <span class="backButton">
                        <router-link style="text-decoration: none" :to="{ name: 'services' }">
                            services
                        </router-link>
                    </span>
                </li>
                <li class="breadcrumb-item active" aria-current="page">Service Bookings</li>
            </ol>
        </nav>
        <div class="continer">
            <div class="row">
                <div class="col-12 col-sm-10 col-md-8 col-lg-2">
                    <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                        <a class="action-list list-group-item list-group-item-action border-0 active" id="v-pills-expenditure-tab" data-bs-toggle="pill" href="#v-pills-this-month" role="tab" aria-controls="v-pills-this-month" aria-selected="true">
                            All bookings
                        </a>
                    </div>
                </div>
                <div class="col">
                    <div class="tab-content" id="v-pills-tabContent">
                        <div class="tab-pane fade show active" id="v-pills-this-month" role="tabpanel" aria-labelledby="v-pills-this-month-tab">
                            <h3 class="mt-3 mb-5">{{ bookings[0].service_type_name }} ({{ $humanizeDate(bookings[0].service_date) }}) bookings</h3>
                            <div>
                                <table class="table table-responsive-sm table-borderless" id="bookingsTable">
                                    <thead>
                                        <tr>
                                            <td>#</td>
                                            <th scope="col">Names</th>
                                            <th scope="col">Phone</th>
                                            <th scope="col">Service</th>
                                            <th scope="col">booked on</th>
                                            <th scope="col">waiting list</th>
                                        </tr>
                                    </thead>
                                    <tbody v-if="bookings.length">
                                        <tr v-for="(booking, index) in bookings" :key="index">
                                            <td>{{ index + 1 }}</td>
                                            <td>{{ booking.names }}</td>
                                            <td>{{ booking.phone_number }}</td>
                                            <td>{{ booking.service_type_name }} ({{ $humanizeDate(booking.service_date) }})</td>
                                            <td>{{ $humanizeDate(booking.timestamp) }}</td>
                                            <td>
                                                <span class="badge badge-success"
                                                    :class="{ 'badge-danger': booking.waiting }"
                                                    data-bs-toggle="tooltip" data-bs-placement="top" title="member has been notified">
                                                    <span v-if="booking.waiting">Yes</span>
                                                    <span v-else>No</span>
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-sm-10 col-md-8 col-lg-3">
                    <div class="d-none btn-group" style="padding: 0px 0px 25px 10px">
                        <a href="#" data-bs-toggle="modal" data-bs-target="#updateService" style="text-decoration: none">
                            <div class="add-button">
                                <b>+</b> add service
                            </div>
                        </a>
                    </div>
                    <div class="list-group font-weight-bold">
                        <button type="button" class="d-flex justify-content-about font-weight-bold text-muted list-group-item list-group-item-action border-0"
                            data-bs-toggle="modal" data-bs-target="#textModalCenter">
                            <img src="@/assets/icons/icons8-comments-64.png" style="width: 45px; height:auto">
                            Text People
                        </button>
                        <button type="button" class="d-flex justify-content-about font-weight-bold text-muted action-list list-group-item list-group-item-action border-0"
                            @click="$exportTable('bookingsTable', 'bookings.csv')">
                            <img src="@/assets/icons/icons8-export-csv-30.png" style="width: 45px; height:auto">
                            Export To CSV
                        </button>
                    </div>
                </div>
            </div>

            <!-- add service -->
            <div class="modal fade" id="updateService" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalCenterTitle">add service</h5>
                            <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="row form-group">
                                <label class="col-3"><b>type:</b></label>
                                <select class="col-4 form-control" v-model="service.type">
                                    <option v-for="data in service_types.response" :value="data.id">{{ data.name }}</option>
                                </select>
                                <a href="#" class="col-2 text-success" data-bs-toggle="modal" data-bs-target="#addServiceType">
                                    <p class="mt-1">+ Add</p>
                                </a>
                            </div>
                            <div class="row form-group">
                                <label class="col-3"><b>venue:</b></label>
                                <input type="text" class="col-8 form-control" placeholder="venue for the service" v-model="service.venue">
                            </div>
                            <div class="row form-group">
                                <label class="col-3"><b>date:</b></label>
                                <div class="input-group form-group col-5" style="padding: 0px">
                                    <input type="date" name="bday" max="3000-12-31"
                                        min="1000-01-01" class="form-control" v-model="service.date">
                                </div>
                            </div>
                            <div class="row form-group">
                                <label class="col-3"><b>period:</b></label>
                                <div class="col-8">
                                    <div class="d-flex form-group">
                                        <div class="">
                                            <label class="col-2">from</label>
                                            <input type="time" class="col-12 form-control" v-model="service.start">
                                        </div>
                                        <div class="ml-1">
                                            <label class="col-2">to</label>
                                            <input type="time" class="col-12 form-control" v-model="service.end">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row form-group">
                                <label class="col-3"><b>max attendance:</b></label>
                                <input type="number" class="col-8 form-control" v-model="service.max_attendance">
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-success" @click="updateService()">
                                <b>+</b> add service
                                <span v-if="updating_service"
                                    class="spinner-border spinner-border-sm" role="status" aria-hidden="true">
                                </span>
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
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import axios from 'axios';

export default {
    name: 'smsAnalytics',
    setup() {
        const store = useStore();
        const route = useRoute();

        const bookings = ref(null);
        const service = ref({});
        const service_types = ref(null);
        const groups = ref([]);
        const group_members = ref([]);
        const expected_to_attend = ref(0);

        const getBookings = () => {
            store.dispatch('update_isLoading', true);
            axios.get(`${store.state.BASE_URL}/api/services/bookings-for-service/${route.params.id}/`)
                .then(response => {
                    bookings.value = response.data;
                    store.dispatch('update_isLoading', false);
                })
                .catch(() => {
                    alert("Error occurred while fetching data");
                    store.dispatch('update_isLoading', false);
                });

            // Get groups
            store.dispatch('update_isLoading', true);
            axios.get(`${store.state.BASE_URL}/api/events/get-groups-attending-event/${route.params.id}/`)
                .then(response => {
                    groups.value = response.data;
                    if (groups.value.length) {
                        getGroupMembers(groups.value[0].group.id);
                        expected_to_attend.value = groups.value[0].group.number_of_members;
                    }
                    store.dispatch('update_isLoading', false);
                })
                .catch(() => {
                    store.dispatch('update_isLoading', false);
                });
        };

        const getGroupMembers = (group_id) => {
            store.dispatch('update_isLoading', true);
            axios.get(`${store.state.BASE_URL}/api/groups/church-group-members/${group_id}/`)
                .then(response => {
                    group_members.value = response.data;
                    store.dispatch('update_isLoading', false);
                })
                .catch(() => {
                    store.dispatch('update_isLoading', false);
                });
        };

        const getServiceTypes = () => {
            store.dispatch('update_isLoading', true);
            axios.get(`${store.state.BASE_URL}/api/services/service-types/`)
                .then(response => {
                    service_types.value = { response: response.data };
                    store.dispatch('update_isLoading', false);
                })
                .catch(() => {
                    store.dispatch('update_isLoading', false);
                });
        };

        watch(groups, (newVal) => {
            if (!newVal.length) {
                getBookings();
            }
        });

        onMounted(() => {
            getBookings();
            getServiceTypes();
        });

        return {
            bookings,
            service,
            service_types,
            groups,
            group_members,
            expected_to_attend,
            getBookings,
            getGroupMembers,
            getServiceTypes
        };
    }
};
</script>



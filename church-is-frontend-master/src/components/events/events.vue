


//updated code





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
                <li class="breadcrumb-item active" aria-current="page">events</li>
            </ol>
        </nav>
        <div class="continer">
            <div class="row">
                <div class="col">
                    <!-- filters for events -->
                    <div class="row">
                        <div class="col">
                            <div class="row">
                                <!-- list and calendar views -->
                                <div class="col-6 col-lg-2">
                                    <div class="form-group">
                                        <select class="form-control" v-model="view">
                                            <option value="list">list</option>
                                            <option value="calendar">calendar</option>
                                        </select>
                                    </div>
                                </div>
                                <!-- add button on smaller devices -->
                                <div class="col-6 btn-group d-sm-block d-md-none text-right">
                                    <div style="padding: 0px 0px 25px 10px">
                                        <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#addEvent">
                                            <b>+</b> add event
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- calendar view -->
                    <vue-cal v-if="view === 'calendar'"
                        :disable-views="['years', 'year']"
                        default-view="month"
                        events-on-month-view="short"
                        :events="events"
                        style="height: 600px">
                    </vue-cal>
                    <!-- list view -->
                    <div v-if="view === 'list'">
                        <div v-for="event in events" :key="event.id">
                            <div class="card mb-5">
                                <div class="mt-3 ml-3">
                                    <img style="width: 45px; height: auto" src="../../assets/icons/icons8-schedule-64.png">
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title">
                                        {{ event.title }}
                                    </h5>
                                    <h5 class="text-muted">
                                        {{ event.start }} ---> {{ event.end }}
                                        @ {{ event.location }}
                                    </h5>
                                    <p class="card-text text-muted">{{ event.description }}</p>
                                    <div class="row">
                                        <div class="col text-right">
                                            <span class="backButton">
                                                <router-link class="text-primary" style="text-decoration: none"
                                                    :to="`/eventDetail/${event.id}/`">
                                                    Mark register
                                                </router-link>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- add button -->
                <div class="col-12 col-sm-10 col-md-8 col-lg-3 d-none d-lg-block">
                    <div style="padding: 0px 0px 25px 10px">
                        <a href="#" data-bs-toggle="modal" data-bs-target="#addEvent" style="text-decoration: none">
                            <div class="add-button">
                                <b>+</b> add upcoming event
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
        <!-- add event Modal -->
        <div class="modal fade" id="addEvent" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalCenterTitle">add an upcoming event</h5>
                        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close" @click="fetchData">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <form>
                            <div class="row form-group">
                                <label class="col-3"><b>title:</b></label>
                                <input type="text" class="col-8 form-control" maxlength="20"
                                    placeholder="enter title of event" v-model="event_title">
                                <ul v-if="event_title_errors.length">
                                    <li v-for="error in event_title_errors" :key="error">
                                        <p class="text-danger">{{ error }}</p>
                                    </li>
                                </ul>
                            </div>

                            <div class="row form-group">
                                <label class="col-3"><b>location:</b></label>
                                <input type="text" class="col-8 form-control" maxlength="20"
                                    placeholder="enter event location" v-model="event_location">
                                <ul v-if="event_location_errors.length">
                                    <li v-for="error in event_location_errors" :key="error">
                                        <p class="text-danger">{{ error }}</p>
                                    </li>
                                </ul>
                            </div>

                            <hr />

                            <div class="form-group">
                                <div class="row">
                                    <label class="col-3"><b>start date:</b></label>
                                    <div class="col-8">
                                        <input type="date" class="form-control" v-model="start_date">
                                        <ul v-if="start_date_errors.length">
                                            <li v-for="error in start_date_errors" :key="error">
                                                <p class="text-danger">{{ error }}</p>
                                            </li>
                                        </ul>
                                        <label class="col-3">from</label>
                                        <input type="time" class="col-8 form-control" v-model="start_time">
                                    </div>
                                </div>
                            </div>

                            <hr />

                            <div class="form-group">
                                <div class="row">
                                    <label class="col-3"><b>end date:</b></label>
                                    <div class="col-8">
                                        <input type="date" class="form-control" v-model="end_date">
                                        <label class="col-3">to</label>
                                        <input type="time" class="col-8 form-control" v-model="end_time">
                                    </div>
                                </div>
                            </div>

                            <div class="row form-group">
                                <label class="col-3"><b>description:</b></label>
                                <textarea class="col-8 form-control" maxlength="150" rows="3" v-model="event_description"></textarea>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="fetchData">
                            Close
                        </button>
                        <button type="button" class="btn btn-success" @click="addEvent">
                            {{ add_event_button_text }}
                            <span v-if="adding_event" class="spinner-border spinner-border-sm" role="status"
                                aria-hidden="true"></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import { useStore } from "vuex";
import axios from "axios";

const router = useRouter();
const store = useStore();

const fetch_data_error = ref([]);
const events_available = ref(false);
const add_event_button_text = ref("add event");
const view = ref("list");

// Add event
const event_title = ref("");
const event_title_errors = ref([]);
const event_location = ref("");
const event_location_errors = ref([]);
const event_description = ref("");
const start_date = ref("");
const start_time = ref("");
const start_date_errors = ref([]);
const start_time_errors = ref([]);
const end_date = ref("");
const end_time = ref("");
const end_time_errors = ref([]);
const end_date_errors = ref([]);
const added_event = ref([]);
const adding_event = ref(false);
const events = ref([]);

const humanize = (x) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const checkLoggedIn = () => {
  if (!sessionStorage.getItem("token")) {
    router.push("/login");
  }
};

const fetchData = () => {
  store.dispatch("update_isLoading", true);
  axios
    .get(import.meta.env.VITE_BASE_URL + "/api/events/event-list/")
    .then((response) => {
      events.value = response.data;
      store.dispatch("update_isLoading", false);
    })
    .catch((err) => {
      fetch_data_error.value.push(err);
      store.dispatch("update_isLoading", false);
    });
};

const addEventFormOkay = () => {
  event_title_errors.value = [];
  event_location_errors.value = [];
  start_date_errors.value = [];
  start_time_errors.value = [];
  end_date_errors.value = [];
  end_time_errors.value = [];

  if (
    event_title.value.length > 0 &&
    event_location.value.length > 0 &&
    event_description.value.length > 0 &&
    start_date.value.length > 0 &&
    start_time.value.length > 0 &&
    end_date.value.length > 0 &&
    end_time.value.length > 0
  ) {
    return true;
  }

  if (event_title.value.length === 0) {
    event_title_errors.value.push("a title to the event needed");
    return false;
  }
  if (event_location.value.length === 0) {
    event_location_errors.value.push("location of the event needed");
    return false;
  }
  if (event_description.value.length === 0) {
    event_description.value = "none given";
  }
  if (start_date.value.length === 0) {
    start_date_errors.value.push("select a starting date for the event");
    return false;
  }
  if (end_date.value.length === 0) {
    end_date_errors.value.push("select an ending date for the event");
    return false;
  }
  if (start_time.value.length !== 5 || start_time.value.split(":").length !== 2) {
    start_time_errors.value.push("use HH:MM format for time");
    return false;
  }
  if (end_time.value.length !== 5 || end_time.value.split(":").length !== 2) {
    end_time_errors.value.push("use HH:MM format for time");
    return false;
  }

  return true;
};

const addEvent = () => {
  if (addEventFormOkay()) {
    adding_event.value = true;
    axios
      .post(import.meta.env.VITE_BASE_URL + "/api/events/add-event/", {
        title: event_title.value,
        description: event_description.value,
        location: event_location.value,
        start_date: start_date.value,
        start_time: start_time.value,
        end_date: end_date.value,
        end_time: end_time.value,
      })
      .then(() => {
        event_title.value = "";
        event_location.value = "";
        event_description.value = "";
        start_date.value = "";
        start_time.value = "";
        end_date.value = "";
        end_time.value = "";
        adding_event.value = false;
        alert("event successfully added ");
      })
      .catch(() => {
        adding_event.value = false;
        alert("an error occurred when trying to add event, check your form and try again");
      });
  }
};

onMounted(() => {
  checkLoggedIn();
  fetchData();
});
</script>


<style>
</style>

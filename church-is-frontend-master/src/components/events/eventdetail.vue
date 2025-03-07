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
        <li class="breadcrumb-item">
          <span class="backButton">
            <router-link style="text-decoration: none" :to="{ name: 'events' }">
              events
            </router-link>
          </span>
        </li>
        <li class="breadcrumb-item active" aria-current="page">{{ event[0].title }}</li>
      </ol>
    </nav>

    <div class="continer">
      <div class="row">
        <div class="col">
          <div>
            <h3>{{ event[0].title }}</h3>
            <h5>
              {{ event[0].start }}
              <span class="text-muted">---to---</span>
              {{ event[0].end }}
            </h5>
          </div>

          <span class="mr-2 text-muted" v-for="group in groups" :key="group.group.name">
            {{ group.group.name }} expected to attend
          </span>

          <div class="text-left mt-2">
            <div class="text-center text-muted col-lg-3 col-sm-8 border border-secondary rounded">
              <h1>{{ event[0].attendees }}</h1>
              People attended
            </div>
          </div>

          <hr />
          <div v-if="!groups.length" class="text-center text-muted">
            <h3>Oops!</h3>
            <h5>No group selected to attend event</h5>
            <p>You need to select a group so that we can generate a check-in register.</p>
            <button
              type="button"
              class="btn btn-success"
              data-toggle="modal"
              data-target="#addAttendingGroupModal"
            >
              Add attending group
              <span
                v-if="adding_group"
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            </button>
          </div>

          <!-- Members Expected to Attend -->
          <ul v-if="group_members" class="list-group list-group-flush">
            <li class="list-group-item" v-for="item in group_members" :key="item.member.member.id">
              <div class="row">
                <div class="col">
                  <router-link :to="`/memberDetail/` + item.member.member.id">
                    <span class="text-secondary">
                      {{ item.member.member.first_name }} {{ item.member.member.last_name }}
                    </span>
                  </router-link>
                </div>
                <div class="col text-right">
                  <div v-if="!attended_member_ids.includes(item.member.member.id)">
                    <button
                      type="button"
                      class="btn btn-sm btn-success"
                      @click="checkInMember(item.member.member.id)"
                    >
                      Check In
                      <span
                        class="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                        :id="item.member.member.id + `_check_in_spinner`"
                      ></span>
                    </button>
                  </div>
                  <div v-else>
                    <button disabled type="button" class="btn btn-sm btn-light">Checked</button>
                  </div>
                </div>
              </div>
            </li>
          </ul>

          <div v-else class="text-muted text-center">
            <h5 v-if="groups.length">Getting Register ...</h5>
          </div>
        </div>

        <!-- Actions -->
        <div class="col-lg-3 col-sm-12"></div>
      </div>
    </div>

    <!-- Modal -->
    <div
      class="modal fade"
      id="addAttendingGroupModal"
      tabindex="-1"
      role="dialog"
      aria-labelledby="exampleModalCenterTitle"
      aria-hidden="true"
    >
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalCenterTitle">Add attending group</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="continer mt-5 mb-5" v-if="groups_list">
            <label><b>Select group:</b></label>
            <select class="form-control" v-model="group_id">
              <option v-for="data in groups_list.response" :key="data.id" :value="data.id">
                {{ data.name }}
              </option>
            </select>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" class="btn btn-success" @click="addGroupAttendingEvent">
              Add attending group
              <span
                v-if="adding_group"
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import axios from "axios";

export default {
  name: "smsAnalytics",
  setup() {
    const route = useRoute();
    const store = useStore();

    const event = ref(null);
    const groups = ref(null);
    const group_members = ref(null);
    const expected_to_attend = ref(0);
    const attended_members = ref(null);
    const attended_member_ids = ref([]);
    const groups_list = ref(null);
    const adding_group = ref(false);
    const group_id = ref(null);

    const fetchData = () => {
      store.dispatch("update_isLoading", true);
      axios
        .get(`${store.state.BASE_URL}/api/events/event/${route.params.id}/`)
        .then((response) => {
          event.value = response.data;
          store.dispatch("update_isLoading", false);
        })
        .catch(() => {
          alert("Error occurred while fetching data");
          store.dispatch("update_isLoading", false);
        });

      store.dispatch("update_isLoading", true);
      axios
        .get(`${store.state.BASE_URL}/api/events/get-groups-attending-event/${route.params.id}/`)
        .then((response) => {
          groups.value = response.data;
          if (groups.value.length > 0) {
            getGroupMembers(groups.value[0].group.id);
            expected_to_attend.value = groups.value[0].group.number_of_members;
          }
          store.dispatch("update_isLoading", false);
        })
        .catch(() => {
          store.dispatch("update_isLoading", false);
        });
    };

    const getGroupMembers = (group_id) => {
      store.dispatch("update_isLoading", true);
      axios
        .get(`${store.state.BASE_URL}/api/groups/church-group-members/${group_id}/`)
        .then((response) => {
          group_members.value = response.data;
          store.dispatch("update_isLoading", false);
        })
        .catch(() => {
          store.dispatch("update_isLoading", false);
        });
    };

    const getMembersThatAttendedEvent = () => {
      store.dispatch("update_isLoading", true);
      axios
        .get(`${store.state.BASE_URL}/api/events/members-that-attended-event/${route.params.id}/`)
        .then((response) => {
          attended_members.value = response.data;
          attended_member_ids.value = attended_members.value.map((item) => item.member.member.id);
          store.dispatch("update_isLoading", false);
        })
        .catch(() => {
          store.dispatch("update_isLoading", false);
        });
    };

    const checkInMember = (member_id) => {
      const check_in_spinner = document.getElementById(member_id + "_check_in_spinner");
      if (check_in_spinner) check_in_spinner.classList.remove("d-none");

      axios
        .post(`${store.state.BASE_URL}/api/events/record-member-that-attended-event/`, {
          member_id: member_id,
          event_id: route.params.id,
        })
        .then(() => {
          getMembersThatAttendedEvent();
          if (check_in_spinner) check_in_spinner.classList.add("d-none");
        })
        .catch((err) => {
          alert(err);
          if (check_in_spinner) check_in_spinner.classList.add("d-none");
        });
    };

    const getGroups = () => {
      groups_list.value = JSON.parse(localStorage.getItem("group_list"));
      const currentVersion = store.getters.group_list_version;
      const version = localStorage.getItem("group_list_version");

      if (!version || version < currentVersion) {
        axios
          .get(`${store.state.BASE_URL}/api/groups/church-group-list/`)
          .then((response) => {
            groups_list.value = { response: response.data };
            localStorage.setItem("group_list", JSON.stringify({ response: response.data }));
            localStorage.setItem("group_list_version", currentVersion);
          })
          .catch((err) => {
            alert(err);
          });
      }
    };

    const addGroupAttendingEvent = () => {
      adding_group.value = true;
      axios
        .post(`${store.state.BASE_URL}/api/events/add-group-attending-event/`, {
          event_id: route.params.id,
          group_id: group_id.value,
        })
        .then(() => {
          fetchData();
          adding_group.value = false;
        })
        .catch((err) => {
          alert(err);
          adding_group.value = false;
        });
    };

    watch(groups, (newGroups) => {
      if (!newGroups || newGroups.length === 0) {
        getGroups();
      }
    });

    onMounted(() => {
      fetchData();
      getMembersThatAttendedEvent();
    });

    return {
      event,
      groups,
      group_members,
      expected_to_attend,
      attended_members,
      attended_member_ids,
      groups_list,
      adding_group,
      group_id,
      fetchData,
      getGroupMembers,
      getMembersThatAttendedEvent,
      checkInMember,
      getGroups,
      addGroupAttendingEvent,
    };
  },
};
</script>






updated vue 3 code


<template>
    <div class="child">
        <!-- general search -->
        <div class="input-group">
            <input type="text" class="form-control" v-model="generalSearch"
                placeholder="search members, groups & events">
            <div class="input-group-append">
                <span class="input-group-text">
                    <img style="width: 20px; height: auto" src="@/assets/icons/icons8-search-80.png">
                </span>
            </div>
        </div>
        <div style="background-color: ghostwhite" class="text-info rounded">{{ search_status }}</div>
        <div class="pre-scrollable searchedItemsDiv border"
            style="min-width: 400px;
                   max-height: 350px;
                   overflow-y: scroll;
                   position: absolute;
                   z-index: 3;
                   background-color: white"
            v-if="showSearchResults">

            <table class="table border-0 text-left">
                <tbody>
                    <!-- MEMBERS -->
                    <h6 class="ml-2 font-weight-bold" v-if="found_members.response.length">Members found</h6>
                    <!-- if no member matching pattern was found -->
                    <tr class="searchedItem border-0" v-for="data in found_members.response" :key="data.member.id" style="cursor:pointer">
                        <a>
                            <td class="border-0" v-on:click="hideSearchResults(`/memberDetail/` + data.member.id)">
                                <img v-if="data.gender == 'M'" style="height: 32px" src="@/assets/avatars/icons8-user-male-skin-type-4-40.png">
                                <img v-if="data.gender == 'F'" style="height: 32px" src="@/assets/avatars/icons8-user-female-skin-type-4-40.png">
                                <img v-if="data.gender == 'R'" style="height: 32px" src="@/assets/avatars/icons8-contacts-96.png">
                                <span class="text-secondary text-capitalize">
                                    {{ data.member.first_name }} {{ data.member.last_name }}
                                    <small>({{ data.phone_number }})</small>
                                </span>
                            </td>
                        </a>
                    </tr>

                    <!-- GROUPS -->
                    <h6 class="ml-2 font-weight-bold" v-if="found_groups.length">Groups found</h6>
                    <tr class="searchedItem border-0" v-for="group in found_groups" :key="group.id" style="cursor:pointer">
                        <router-link class="text-secondary" style="text-decoration: none;" :to="`/groupDetail/` + group.id">
                            <td class="d-flex justify-content-between border-0" v-on:click="hideSearchResults()">
                                {{ group.name }}
                                <span class="badge badge-pill badge-secondary ml-4">
                                    {{ group.number_of_members }}
                                </span>
                            </td>
                        </router-link>
                    </tr>

                    <!-- EVENTS -->
                    <h6 class="ml-2 font-weight-bold" v-if="found_events.length">Events found</h6>
                    <tr class="searchedItem border-0" v-for="event in found_events" :key="event.id" style="cursor:pointer">
                        <router-link class="text-secondary" style="text-decoration: none" :to="`/eventDetail/` + event.id + `/`">
                            <td class="ml-2 border-0 row" v-on:click="hideSearchResults()">
                                <img style="width: 25px; height: auto" src="@/assets/icons/icons8-schedule-64.png">
                                {{ event.title }}
                                <div class="ml-3 text-small">
                                    ({{ $humanizeDate(event.start) }})
                                </div>
                            </td>
                        </router-link>
                    </tr>
                </tbody>
            </table>
            <!-- nothing found -->
            <div class="text-center text-muted" v-if="!found_members.response.length && !found_events.length && !found_groups.length">
                <h3>Oops!</h3>
                <h5>Nothing matching query found</h5>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import _ from "lodash";

export default {
  name: "generalsearch",
  setup() {
    const router = useRouter();

    const generalSearch = ref("");
    const showSearchResults = ref(false);
    const found_members = ref([]);
    const search_status = ref("");
    const found_groups = ref([]);
    const groupSearch_status = ref("");
    const found_events = ref([]);
    const eventSearch_status = ref("");

    const debouncedGetAnswer = _.debounce(getAnswer, 1000);

    watch(generalSearch, (newValue) => {
      if (newValue.length > 0) {
        showSearchResults.value = true;
        search_status.value = "typing...";
        debouncedGetAnswer();
      } else {
        search_status.value = "";
        found_members.value = [];
        found_events.value = [];
        found_groups.value = [];
        showSearchResults.value = false;
      }
    });

    function hideSearchResults(route) {
      showSearchResults.value = false;
      generalSearch.value = "";
      router.push(route);
      location.reload();
    }

    function getAnswer() {
      if (generalSearch.value.length > 0) {
        found_members.value = [];
        search_status.value = "searching...";

        // Search for members
        fetch(`${import.meta.env.VUE_APP_BASE_URL}/api/members/filter-by-first_name/${generalSearch.value}/`)
          .then((response) => response.json())
          .then((data) => {
            found_members.value = { response: data };
            search_status.value = "";
          })
          .catch(() => {
            search_status.value = "";
          });

        // Search for groups
        fetch(`${import.meta.env.VUE_APP_BASE_URL}/api/groups/church-group-where-name-like/${generalSearch.value}/`)
          .then((response) => response.json())
          .then((data) => {
            found_groups.value = data;
            groupSearch_status.value = "";
          })
          .catch(() => {
            groupSearch_status.value = "";
          });

        // Search for events
        fetch(`${import.meta.env.VUE_APP_BASE_URL}/api/events/event-where-pattern-like/${generalSearch.value}/`)
          .then((response) => response.json())
          .then((data) => {
            found_events.value = data;
            eventSearch_status.value = "";
          })
          .catch(() => {
            eventSearch_status.value = "";
          });
      }
    }

    return {
      generalSearch,
      showSearchResults,
      found_members,
      search_status,
      found_groups,
      groupSearch_status,
      found_events,
      eventSearch_status,
      hideSearchResults,
    };
  },
};
</script>


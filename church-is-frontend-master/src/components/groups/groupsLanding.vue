<!-- updated vue 3 code -->

<template>
  <div class="groupsLanding">
    <nav aria-label="breadcrumb" class="p-5">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <span class="backButton">
            <router-link style="text-decoration: none" :to="{ name: 'Home' }">
              Home
            </router-link>
          </span>
        </li>
        <li class="breadcrumb-item active" aria-current="page">groups</li>
      </ol>
    </nav>

    <section class="p-5">
      <div class="row">
        <div class="col-12 ml-3 mb-3">
          <h3 class="row">
            <b>Groups</b>
          </h3>
          <div class="d-flex justify-content-between">
            <div class="d-flex">
              <a
                class="stat-item btn btn-outline-secondary dropdown-toggle"
                data-bs-toggle="collapse"
                href="#statsTab"
                role="button"
                aria-expanded="false"
                aria-controls="statsTab"
              >
                stats
              </a>
            </div>
            <div class="btn-group">
              <a
                class="add-button"
                href="#"
                data-bs-toggle="modal"
                v-on:click="switchToGroup()"
                data-bs-target="#addModal"
                style="text-decoration: none"
              >
                + Add group
              </a>
              <button
                type="button"
                class="btn btn-success dropdown-toggle dropdown-toggle-split"
                id="dropdownMenuReference"
                data-bs-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
                data-reference="parent"
              >
                <span class="sr-only">Toggle Dropdown</span>
              </button>
              <div
                class="dropdown-menu border-success text-capitalize"
                aria-labelledby="dropdownMenuReference"
                style="z-index: 99999"
              >
                <router-link
                  class="dropdown-item"
                  style="text-decoration: none"
                  :to="{ name: 'randomMessage' }"
                >
                  Text random numbers
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <section class="collapse col-12" id="statsTab" style="max-width: 500px">
          <div class="card card-body">
            <groupstats msg="expenditure stats" />
          </div>
        </section>
      </div>
      <hr />
    </section>

    <div class="continer">
      <div>
        <div v-if="independent_groups" class="p-5 mt-4 d-flex flex-wrap">
          <div
            class="border rounded mt-3 ml-3"
            v-for="data in independent_groups.response"
            :key="data.id"
          >
            <router-link
              :to="`/groupDetail/` + data.id"
              class="list-group-item list-group-item-action border-0"
            >
              <span class="">
                <div>
                  <i class="fas fa-users"></i>
                  <span class="text-dark">{{ data.name }}</span>
                  <p>{{ data.description }}</p>
                </div>
                <span class="text-muted font-weight-bold">
                  {{ data.number_of_members }} members
                </span>
              </span>
            </router-link>
          </div>
        </div>

        <section>
          <!-- Modal add group -->
          <div
            class="modal fade"
            id="addModal"
            tabindex="-1"
            role="dialog"
            aria-labelledby="exampleModalCenterTitle"
            aria-hidden="true"
          >
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalCenterTitle">
                    add {{ group_type }}
                  </h5>
                  <button
                    type="button"
                    class="close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <div class="form-group">
                    <label for="addGroup"> name</label>
                    <input
                      type="text"
                      class="form-control"
                      maxlength="20"
                      v-model="name"
                    />
                    <p v-if="name_errors.length">
                      <ul>
                        <small>
                          <li v-for="error in name_errors" :key="error">
                            <p class="text-danger">{{ error }}</p>
                          </li>
                        </small>
                      </ul>
                    </p>
                  </div>
                  <div class="form-group">
                    <label for="addGroupDescription">description</label>
                    <textarea
                      class="form-control"
                      maxlength="50"
                      id="addGroupDescription"
                      rows="3"
                      v-model="description"
                    ></textarea>
                  </div>
                </div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button type="button" class="btn btn-success" v-on:click="addGroup()">
                    <b>+</b> add
                    <span
                      v-if="adding_group"
                      class="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    >
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script>
import router from "../../router";
import groupstats from '@/subcomponents/statistics/groupstats.vue'
import { ref, onMounted, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useStore } from "vuex";
import axios from "axios";

export default {
  name: 'groupsLanding',
  components: { groupstats },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();

    const groups = ref(null);
    const independent_groups = ref(null);
    const foundItems = ref(null);
    const foundItems_independent = ref(null);
    const fetch_data_error = ref([]);

    // Add group
    const adding_group = ref(false);
    const group_type = ref('group');
    const name = ref('');
    const name_errors = ref([]);
    const description = ref('');
    const add_group_error = ref(null);

    const checkLoggedIn = () => {
      if (!sessionStorage.getItem("token")) {
        router.push("/login");
      }
    };

    const fetchData = () => {
      fetch_data_error.value = [];
      store.dispatch('update_isLoading', true);

      // Try local storage
      groups.value = JSON.parse(localStorage.getItem('group_list'));
      if (groups.value) {
        foundItems.value = groups.value.response.length;
        store.dispatch('update_isLoading', false);
      }

      const currentVersion = store.getters.group_list_version;
      const version = localStorage.getItem('group_list_version');

      // Fetch from network if needed
      if (!version || version <= currentVersion) {
        axios.get(`${store.state.BASE_URL}/api/groups/group-of-church-groups-list`)
          .then(response => {
            groups.value = { response: response.data };
            foundItems.value = response.data.length;
            localStorage.setItem('group_list', JSON.stringify({ response: response.data }));
            localStorage.setItem('group_list_version', currentVersion);
            store.dispatch('update_isLoading', false);
          })
          .catch(err => {
            fetch_data_error.value.push(err);
            store.dispatch('update_isLoading', false);
          });
      }

      // Fetch independent groups
      store.dispatch('update_isLoading', true);
      independent_groups.value = JSON.parse(localStorage.getItem('group_list_independent'));
      if (independent_groups.value) {
        foundItems_independent.value = independent_groups.value.response.length;
        store.dispatch('update_isLoading', false);
      }

      if (!version || version < currentVersion) {
        axios.get(`${store.state.BASE_URL}/api/groups/church-groups-not-in-group/`)
          .then(response => {
            independent_groups.value = { response: response.data };
            foundItems_independent.value = response.data.length;
            localStorage.setItem('group_list_independent', JSON.stringify({ response: response.data }));
            store.dispatch('update_isLoading', false);
          })
          .catch(err => {
            fetch_data_error.value.push(err);
            store.dispatch('update_isLoading', false);
          });
      }
    };

    const switchToFolder = () => {
      group_type.value = 'folder';
    };

    const switchToGroup = () => {
      group_type.value = 'group';
    };

    const addGroup = () => {
      let url = '';
      name_errors.value = [];

      if (!name.value) {
        name_errors.value.push('you must have a name for the group');
      }
      if (!description.value) {
        description.value = 'none given';
      }
      if (group_type.value === 'folder') {
        url = '/api/groups/group-of-church-groups-list/';
      }
      if (group_type.value === 'group') {
        url = '/api/groups/add-group/';
      }

      adding_group.value = true;

      axios.post(`${store.state.BASE_URL}${url}`, {
        group: null,
        name: name.value,
        description: description.value
      })
        .then(() => {
          name.value = '';
          description.value = '';
          if (group_type.value === 'folder') {
            alert("folder successfully added");
          }
          if (group_type.value === 'group') {
            adding_group.value = false;
            alert("group successfully added");

            // Update local storage
            const new_version = parseInt(localStorage.getItem('group_list_version')) + 1;
            store.dispatch('update_group_list_version', new_version);
            fetchData();
          }
        })
        .catch(() => {
          adding_group.value = false;
          group_type.value = 'group';
          alert("an error occurred while trying to add group");
        });
    };

    onMounted(() => {
      checkLoggedIn();
      fetchData();
    });

    watch(() => route.fullPath, fetchData);

    return {
      groups,
      independent_groups,
      foundItems,
      foundItems_independent,
      fetch_data_error,
      adding_group,
      group_type,
      name,
      name_errors,
      description,
      add_group_error,
      checkLoggedIn,
      fetchData,
      switchToFolder,
      switchToGroup,
      addGroup
    };
  }
};
</script>
<style>
</style>

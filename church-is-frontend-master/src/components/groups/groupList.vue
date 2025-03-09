





upadate_group.vue  to vue 3

<template>
    <div>
        <div class="row">
            <div class="col">
                <h3>
                    <img style="width: 30px; height: auto" src="../../assets/icons/icons8-folder-48.png">
                    {{ group_name }} / groups
                </h3>
                <hr/>
                <div class="col-8 center-div" v-if="fetch_data_error.length > 0 && group_name">
                    <div class="center-div">
                        <img style="height: 64px" src="../../assets/icons/icons8-wi-fi-off-64.png">
                        <p class="text-info">Check your connection</p>
                    </div>
                </div>
                <div v-if="fetch_data_error.length === 0">
                    Found <span class="badge badge-pill badge-secondary">{{ foundItems }}</span>
                    <p></p>
                    <table v-if="groups" class="table">
                        <tbody>
                            <tr v-for="data in groups.response" :key="data.id">
                                <td>
                                    <router-link class="text-secondary" style="text-decoration: none;" :to="`/groupDetail/` + data.id">
                                        <img style="width: 30px; height: auto" src="../../assets/icons/icons8-user-groups-48.png">
                                        {{ data.name }}
                                    </router-link>
                                </td>
                                <td></td>
                                <td></td>
                                <td>
                                    <p>
                                        <span class="badge badge-pill badge-secondary">{{ data.number_of_members }}</span>
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="col-sm-10 col-md-8 col-lg-3 text-right">
                <button v-if="group_name" class="btn btn-success" data-bs-toggle="modal" data-bs-target="#addGroup">
                    <b>+</b> Add to {{ group_name }}
                </button>
            </div>
        </div>

        <!-- Modal Add Group -->
        <div class="modal fade" id="addGroup" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title text-capitalize" id="exampleModalCenterTitle">Add group to {{ group_name }} folder</h5>
                        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close" @click="fetchData()">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="form-group">
                            <label for="addGroup">Group Name</label>
                            <input type="text" class="form-control" maxlength="20" id="addGroup" v-model="name">
                            <div v-if="name_errors.length">
                                <ul>
                                    <small><li v-for="error in name_errors" :key="error">
                                        <p class="text-danger">{{ error }}</p>
                                    </li></small>
                                </ul>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="addGroupDescription">Description</label>
                            <textarea class="form-control" id="addGroupDescription" maxlength="50" rows="3" v-model="description"></textarea>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="fetchData()">Close</button>
                        <button type="button" class="btn btn-success" @click="addGroup()">
                            <b>+</b> Add Group
                            <span v-if="adding_group" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import router from "../../router";
import { ref, watch, onMounted } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import axios from "axios";

export default {
  name: "groupList",
  setup() {
    const store = useStore();
    const route = useRoute();

    const group_name = ref("church");
    const groups = ref(null);
    const foundItems = ref(null);
    const fetch_data_error = ref([]);
    const name = ref("");
    const name_errors = ref([]);
    const description = ref("");
    const add_group_error = ref(null);
    const adding_group = ref(false);

    const checkLoggedIn = () => {
      if (!sessionStorage.getItem("token")) {
        router.push("/login");
      }
    };

    const fetchData = () => {
      store.dispatch("update_isLoading", true);
      group_name.value = route.params.group_name;
      fetch_data_error.value = [];

      axios
        .get(`${process.env.VUE_APP_BASE_URL}/api/groups/church-groups-in-group/${route.params.id}/`)
        .then((response) => {
          groups.value = { response: response.data };
          foundItems.value = groups.value.response.length;
          store.dispatch("update_isLoading", false);
        })
        .catch((err) => {
          fetch_data_error.value.push(err);
          store.dispatch("update_isLoading", false);
        });
    };

    const addGroup = () => {
      name_errors.value = [];
      if (!name.value) {
        name_errors.value.push("You must have a name for the group");
      }
      if (!description.value) {
        description.value = "None given";
      }
      adding_group.value = true;

      axios
        .post(`${process.env.VUE_APP_BASE_URL}/api/groups/add-group/`, {
          group: route.params.id,
          name: name.value,
          description: description.value,
        })
        .then(() => {
          name.value = "";
          description.value = "";
          adding_group.value = false;
          alert("Group successfully added");
        })
        .catch((err) => {
          adding_group.value = false;
          alert("Error occurred while trying to add group: " + err);
        });
    };

    onMounted(() => {
      checkLoggedIn();
      if (route.params.id) {
        fetchData();
      }
    });

    watch(() => route.params, fetchData);

    return {
      group_name,
      groups,
      foundItems,
      fetch_data_error,
      name,
      name_errors,
      description,
      add_group_error,
      adding_group,
      fetchData,
      addGroup,
    };
  },
};
</script>

<style>
</style>

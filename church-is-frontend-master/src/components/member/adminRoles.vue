<!-- updated vue 3 code -->

<template>
    <div>
        <nav aria-label="breadcrumb" class="continer">
            <ol class="breadcrumb">
                <li class="breadcrumb-item">
                    <span class="backButton">
                        <router-link style="text-decoration: none" :to="{name: 'Home'}">Home</router-link>
                    </span>
                </li>
                <li class="breadcrumb-item">
                    <span class="backButton">
                        <router-link style="text-decoration: none" :to="{name: 'memberList'}">members</router-link>
                    </span>
                </li>
                <li class="breadcrumb-item active" aria-current="page">assign roles</li>
            </ol>
        </nav>
        <div class="continer">
            <div class="row">
                <div class="col-12 col-sm-10 col-md-8 col-lg-2">
                    <a href="#" v-if="member_found" @click="backToSearch()" role="button" aria-expanded="false">
                        <div class="moreButton">
                            <b> back to search</b>
                        </div>
                    </a>
                </div>
                <div class="col">
                    <div class="form-group" v-if="!member_found">
                        <label><b>search member:</b></label>
                        <div>
                            <input type="text" class="form-control" placeholder="type to search member" v-model="memberSearch" autofocus />
                            <div style="padding: 10px" class="text-info">{{ memberSearch_status }}</div>

                            <div class="pre-scrollable searchedItemsDiv border" style="max-height: 185px; overflow-y: scroll;" v-if="showMemberInput">
                                <table class="table border-0">
                                    <tbody>
                                        <tr class="searchedItem border-0" v-for="data in found_members.response" :key="data.member.id">
                                            <a href="#" style="text-decoration: none" @click="selectMember(data.member.id, data.member.first_name, data.member.last_name)">
                                                <td class="border-0">
                                                    <img v-if="data.gender == 'M'" style="height: 32px" src="@/assets/avatars/icons8-user-male-skin-type-4-40.png" />
                                                    <img v-if="data.gender == 'F'" style="height: 32px" src="@/assets/avatars/icons8-user-female-skin-type-4-40.png" />
                                                    <img v-if="data.gender == 'R'" style="height: 32px" src="@/assets/avatars/icons8-contacts-96.png" />
                                                    <span class="text-secondary">{{ data.member.first_name }} {{ data.member.last_name }}</span>
                                                </td>
                                            </a>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div v-if="member_found">
                        <div>
                            <h3>{{ memberSearch_status }}</h3>
                        </div>
                        <div class="row">
                            <div style="padding: 10px">
                                <div class="row">
                                    <div class="alert alert-warning alert-dismissible fade show" role="alert" v-if="assigned_roles.length > 0">
                                        <p v-for="data in assigned_roles" :key="data.role.role">
                                            <strong>role: {{ data.role.role }}</strong> {{ data.role.description }}
                                        </p>
                                        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <table class="table">
                                        <thead>
                                            <tr></tr>
                                            <tr></tr>
                                            <tr></tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <th></th>
                                                <th>role</th>
                                                <th><small>member admin</small></th>
                                                <th><small>group admin</small></th>
                                                <th><small>event admin</small></th>
                                                <th><small>projects admin</small></th>
                                                <th><small>finance admin</small></th>
                                                <th><small>site admin</small></th>
                                            </tr>
                                            <tr v-for="data in roles.response" :key="data.id">
                                                <td>
                                                    <span v-for="data2 in roles_for_member.response" :key="data2.role.role">
                                                        <span v-if="data2.role.role == data.role">
                                                            <input multiple class="form-check-input" type="checkbox" :value="data.id" v-model="selected_role" disabled />
                                                        </span>
                                                        <span v-else>
                                                            <input multiple class="form-check-input" type="checkbox" :value="data.id" v-model="selected_role" />
                                                        </span>
                                                    </span>
                                                    <span v-if="!member_has_roles">
                                                        <input multiple class="form-check-input" type="checkbox" :value="data.id" v-model="selected_role" />
                                                    </span>
                                                </td>
                                                <td>{{ data.role }}</td>
                                                <td><span class="badge badge-pill" :class="data.member_admin ? 'badge-success' : 'badge-danger'">{{ data.member_admin ? 'yes' : 'no' }}</span></td>
                                                <td><span class="badge badge-pill" :class="data.group_admin ? 'badge-success' : 'badge-danger'">{{ data.group_admin ? 'yes' : 'no' }}</span></td>
                                                <td><span class="badge badge-pill" :class="data.event_admin ? 'badge-success' : 'badge-danger'">{{ data.event_admin ? 'yes' : 'no' }}</span></td>
                                                <td><span class="badge badge-pill" :class="data.projects_admin ? 'badge-success' : 'badge-danger'">{{ data.projects_admin ? 'yes' : 'no' }}</span></td>
                                                <td><span class="badge badge-pill" :class="data.finance_admin ? 'badge-success' : 'badge-danger'">{{ data.finance_admin ? 'yes' : 'no' }}</span></td>
                                                <td><span class="badge badge-pill" :class="data.site_admin ? 'badge-success' : 'badge-danger'">{{ data.site_admin ? 'yes' : 'no' }}</span></td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                    <hr />
                    <div style="padding: 0px 0px 25px 0px" v-if="member_found">
                        <a href="#" @click="assignRoles()" style="text-decoration: none" aria-disabled="true">
                            <div class="add-button">
                                {{ assign_button_text }}
                            </div>
                        </a>
                    </div>
                </div>
                <div class="col-12 col-sm-10 col-md-8 col-lg-3">
                    <div class="btn-group" style="padding: 0px 0px 25px 0px" v-if="member_found">
                        <a href="#" data-toggle="modal" data-target="#addRole" style="text-decoration: none">
                            <div class="add-button">
                                <b>+</b> add role
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import { ref, reactive, watch, onMounted } from "vue";
import axios from "axios"; // Ensure axios is installed and imported
import _ from "lodash"; // Lodash for debouncing

export default {
  name: "adminRoles",
  setup() {
    // State Variables
    const fetch_data_error = ref([]);
    const roles = ref(null);
    const roles_for_member = ref(null);

    // Search Member
    const member_has_roles = ref(false);
    const memberSearch = ref("");
    const found_members = ref([]);
    const memberSearch_status = ref("");
    const selectedMember = ref(null);
    const showMemberInput = ref(false);
    const member_found = ref(false);

    // Add Role
    const role_name = ref(null);
    const role_description = ref(null);
    const enable_role_button = ref(false);
    const add_role_button_text = ref("+ add role");
    const added_role = ref([]);

    // Assign Roles
    const selected_role = ref([]);
    const assign_button_text = ref("assign role(s)");
    const member_admin = ref(false);
    const site_admin = ref(false);
    const group_admin = ref(false);
    const event_admin = ref(false);
    const projects_admin = ref(false);
    const finance_admin = ref(false);
    const assigned_roles = ref([]);

    // Fetch Data Function
    const fetchdata = () => {
      fetch_data_error.value = [];
      axios
        .get(import.meta.env.VUE_APP_BASE_URL + "/api/members/role-list/")
        .then((response) => {
          roles.value = { response: response.data };
        })
        .catch((err) => {
          fetch_data_error.value.push(err);
        });
    };

    // Fetch roles for a selected member
    const get_roles_for_member = () => {
      axios
        .get(import.meta.env.VUE_APP_BASE_URL + "/api/members/roles-for-member/" + selectedMember.value + "/")
        .then((response) => {
          roles_for_member.value = { response: response.data };
          member_has_roles.value = Object.keys(roles_for_member.value.response).length > 0;
        })
        .catch((err) => {
          fetch_data_error.value.push(err);
        });
    };

    // Search member function
    const getAnswer = () => {
      if (memberSearch.value.length > 0) {
        found_members.value = [];
        memberSearch_status.value = "searching...";
        axios
          .get(import.meta.env.VUE_APP_BASE_URL + "/api/members/filter-by-first_name/" + memberSearch.value + "/")
          .then((response) => {
            found_members.value = { response: response.data };
            memberSearch_status.value = "";
          })
          .catch(() => {});
      }
    };

    // Debounce the search function
    const debouncedGetAnswer = _.debounce(getAnswer, 1000);

    // Watchers
    watch(memberSearch, () => {
      if (memberSearch.value.length > 0) {
        member_has_roles.value = false;
        selected_role.value = [];
        showMemberInput.value = true;
        memberSearch_status.value = "typing...";
        debouncedGetAnswer();
      } else {
        memberSearch_status.value = "";
        found_members.value = [];
        showMemberInput.value = false;
        fetchdata();
        enable_role_button.value = false;
      }
    });

    watch([role_name, role_description], () => {
      enable_role_button.value = role_name.value && role_description.value;
    });

    // Select a member
    const selectMember = (id, first_name, last_name) => {
      selectedMember.value = id;
      memberSearch_status.value = `:${first_name} ${last_name}`;
      showMemberInput.value = false;
      member_found.value = true;
      get_roles_for_member();
    };

    // Add role function
    const addRole = () => {
      enable_role_button.value = false;
      add_role_button_text.value = "adding role...";
      axios
        .post(import.meta.env.VUE_APP_BASE_URL + "/api/members/role-list/", {
          role: role_name.value,
          description: role_description.value,
          member_admin: member_admin.value,
          site_admin: site_admin.value,
          group_admin: group_admin.value,
          event_admin: event_admin.value,
          projects_admin: projects_admin.value,
          finance_admin: finance_admin.value,
        })
        .then((response) => {
          added_role.value.push(response.data);
          role_name.value = "";
          role_description.value = "";
          add_role_button_text.value = "+ add role";
          alert("Role successfully added");
          fetchdata();
        })
        .catch(() => {});
    };

    // Assign roles function
    const assignRoles = () => {
      selected_role.value.forEach((roleId) => {
        assign_button_text.value = "assigning roles...";
        axios
          .post(import.meta.env.VUE_APP_BASE_URL + "/api/members/add-role-for-member/", {
            member_id: selectedMember.value,
            role_id: roleId,
          })
          .then((response) => {
            assigned_roles.value.push(response.data);
            assign_button_text.value = "assign role(s)";
            selected_role.value = [];
            alert("Successfully assigned roles");
            fetchdata();
          })
          .catch(() => {});
      });
    };

    // Lifecycle hook: Fetch data when the component is mounted
    onMounted(() => {
      fetchdata();
    });

    return {
      fetch_data_error,
      roles,
      roles_for_member,
      member_has_roles,
      memberSearch,
      found_members,
      memberSearch_status,
      selectedMember,
      showMemberInput,
      member_found,
      role_name,
      role_description,
      enable_role_button,
      add_role_button_text,
      added_role,
      selected_role,
      assign_button_text,
      member_admin,
      site_admin,
      group_admin,
      event_admin,
      projects_admin,
      finance_admin,
      assigned_roles,
      fetchdata,
      get_roles_for_member,
      getAnswer,
      selectMember,
      addRole,
      assignRoles,
    };
  },
};
</script>

<style>
</style>

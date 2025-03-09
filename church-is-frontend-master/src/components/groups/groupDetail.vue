<template>
  <div>
    <!-- Text Message Modal Component -->
    <textmessage :memberIds="member_ids" />

    <!-- Breadcrumb Navigation -->
    <nav aria-label="breadcrumb" class="continer">
      <ol class="breadcrumb">
        <li class="breadcrumb-item">
          <span class="backButton">
            <router-link style="text-decoration: none" :to="{ name: 'Home' }">Home</router-link>
          </span>
        </li>
        <li class="breadcrumb-item">
          <span class="backButton">
            <router-link style="text-decoration: none" :to="{ name: 'groupsLanding' }">Groups</router-link>
          </span>
        </li>
        <li class="breadcrumb-item active" aria-current="page" v-for="data in group.response" :key="data.id">
          {{ data.name }}
        </li>
      </ol>
    </nav>

    <!-- Main Content -->
    <body v-if="group.response.length">
    <div class="continer">
      <div class="row ml-2">
        <div class="col" v-for="data in group.response" :key="data.id">
          <h3 class="row">
            <b>{{ data.name }}</b>
          </h3>
          <p class="row">{{ data.description }}</p>
        </div>
      </div>
      <hr>
    </div>

    <!-- Tab Navigation -->
    <div class="continer">
      <div class="row">
        <div class="col-sm-10 col-md-8 col-lg-2 mb-3" style="padding: 0px">
          <nav class="nav nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
            <a class="action-list list-group-item list-group-item-action border-0 active"
               data-toggle="pill" href="#member" role="tab" aria-controls="members" aria-selected="true">
              <img style="width: 30px; height: auto;" src="../../assets/icons/icons8-user-groups-40.png"> Members
            </a>
            <a class="action-list list-group-item list-group-item-action border-0"
               data-toggle="pill" href="#activity" role="tab" aria-controls="activity" @click="getGroupActivity">
              <img style="width: 30px; height: auto;" src="../../assets/icons/icons8-activity-history-48.png"> Activity
            </a>
          </nav>
        </div>

        <!-- Tab Content -->
        <div class="tab-content col">
          <!-- Group Members Tab -->
          <div class="tab-pane fade show active" id="member" role="tabpanel" aria-labelledby="profile-tab">
            <div class="center-div" v-if="fetch_data_error.length > 0">
              <img style="height: 64px" src="../../assets/icons/icons8-wi-fi-off-64.png">
              <p class="text-info">Check your connection</p>
            </div>
            <div v-if="fetch_data_error.length === 0">
              <div>
                  <span aria-current="page" v-for="data in group.response" :key="data.id">
                    <hr class="d-sm-block d-lg-none">
                    <h3>Members</h3>
                    <div class="btn-group d-sm-block d-md-none ml-2">
                      <a @click="openAction">
                        <div class="btn btn-light">Actions</div>
                      </a>
                      <button @click="openAction" type="button" class="btn btn-sm btn-light dropdown-toggle dropdown-toggle-split">
                        <span class="sr-only">Toggle Dropdown</span>
                      </button>
                    </div>
                  </span>
                <hr>
                <div class="row mb-1">
                  <p class="ml-4">
                    Found <span class="badge badge-pill badge-secondary">{{ foundItems }}</span>
                  </p>
                </div>
              </div>
            </div>
            <div v-if="!members.response.length" class="text-center text-muted">
              <h3>Oops!</h3>
              <h3>Group has no members added</h3>
              <p>Add members to group so that we can list them</p>
            </div>
            <table class="table table-responsive-sm table-borderless">
              <tbody>
              <tr>
                <th class="anvil-checkbox">
                  <label class="anvil-checkbox">All
                    <input type="checkbox" :value="true" v-model="all_members">
                    <span class="anvil-checkmark"></span>
                  </label>
                </th>
                <th>Names</th>
                <th>Role</th>
              </tr>
              <tr v-for="data in members.response.slice(0, 100)" :key="data.user_id">
                <td>
                  <label class="anvil-checkbox">
                    <input multiple type="checkbox" :value="data.user_id" v-model="member_ids">
                    <span class="anvil-checkmark"></span>
                  </label>
                </td>
                <td>
                  <img v-if="data.member_gender === 'M'" style="height: 32px" src="../../assets/avatars/icons8-user-male-skin-type-4-40.png">
                  <img v-if="data.member_gender === 'F'" style="height: 32px" src="../../assets/avatars/icons8-user-female-skin-type-4-40.png">
                  <img v-if="data.member_gender === 'R'" style="height: 32px" src="../../assets/avatars/icons8-contacts-96.png">
                  <router-link :to="`/memberDetail/` + data.user_id">
                    <span class="text-secondary">{{ data.member_full_name }}</span>
                  </router-link>
                </td>
                <td class="text-muted">{{ data.role_name }}</td>
              </tr>
              </tbody>
            </table>
          </div>

          <!-- Group Activity Tab -->
          <div class="tab-pane fade" id="activity" role="tabpanel">
            <hr class="d-sm-block d-lg-none">
            <h3>Activity</h3>
            <hr>
            <div v-if="group_meetings">
              <div v-if="group_meetings.length">
                <table class="table table-responsive-sm table-borderless">
                  <thead>
                  <tr>
                    <th scope="col">Event</th>
                    <th scope="col">Start</th>
                    <th scope="col">End</th>
                    <th scope="col">Attenders</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr v-for="meeting in group_meetings" :key="meeting.event.id" class="text-muted">
                    <td>
                      <router-link class="text-muted" :to="`/eventDetail/` + meeting.event.id + `/`">
                        {{ meeting.event.title }}
                      </router-link>
                    </td>
                    <td>{{ meeting.event.start }}</td>
                    <td>{{ meeting.event.end }}</td>
                    <td>
                          <span class="badge badge-pill badge-secondary">
                            {{ meeting.event.attendees }}
                          </span>
                      of
                      <span class="badge badge-pill badge-secondary">
                            {{ meeting.group.number_of_members }}
                          </span>
                    </td>
                  </tr>
                  </tbody>
                </table>
              </div>
              <div class="text-muted text-center" v-else>
                <h3>Oops!</h3>
                <h3>Group has not had any meetings recently</h3>
                <p>Mark event registers by this group to get content here</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar Actions -->
        <div class="col-12 col-sm-10 col-md-8 col-lg-3 d-sm-none d-md-block">
          <div class="btn-group" style="padding: 0px 0px 25px 0px">
            <a href="#" data-toggle="modal" data-target="#addMemberToGroup" style="text-decoration: none">
              <div class="add-button">
                <span><b>+</b> Add member to group</span>
              </div>
            </a>
            <button type="button" class="btn btn-success dropdown-toggle dropdown-toggle-split" id="dropdownMenuReference" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-reference="parent">
              <span class="sr-only">Toggle Dropdown</span>
            </button>
            <div class="dropdown-menu border-success" aria-labelledby="dropdownMenuReference">
              <a class="d-none dropdown-item" href="#" data-toggle="modal" data-target="#importCSV"><b>+</b> Import from CSV</a>
            </div>
          </div>
          <div class="list-group">
            <button type="button" class="d-none action-list list-group-item list-group-item-action border-0" data-toggle="modal" data-target="#emailModatCenter">
              <img src="../../assets/app_logo.png" style="width: 55px; height:auto"> Anvil Channels
            </button>
            <button type="button" class="d-none action-list list-group-item list-group-item-action border-0" data-toggle="modal" data-target="#emailModatCenter">
              <img src="../../assets/icons/icons8-email-64.png"> Email
            </button>
            <button type="button" class="list-group-item list-group-item-action border-0" data-toggle="modal" data-target="#textModalCenter">
              <img src="../../assets/icons/icons8-comments-64.png" style="width: 35px; height:auto">
              Text members
            </button>
            <button type="button" class="list-group-item list-group-item-action border-0" data-toggle="modal" data-target="#removeMembersModal">
              <img src="../../assets/icons/icons8-delete-64.png" style="width: 35px; height:auto">
              Remove members
            </button>
            <button type="button" class="ml-2 d-flex fex-row list-group-item list-group-item-action border-0" data-toggle="modal" data-target="#deleteGroupModal">
              <h2 class="font-weight-bold text-danger">X</h2>
              <span class="mt-2 ml-3">Delete group</span>
            </button>
          </div>

          <!-- Modals -->
          <!-- Add Member to Group Modal -->
          <div class="modal fade" id="addMemberToGroup" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalCenterTitle">Add member to group</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close" @click="fetchData">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <div class="d-flex justify-content-around">
                    <label><b>Member</b></label>
                    <div class="d-flex flex-column">
                      <searchmember @memberSelected="onMemberSelected" />
                      <span v-if="checking_if_in_group" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      <span v-if="member_in_group" class="text-danger">
                          <small>Member already in group</small>
                        </span>
                    </div>
                  </div>
                  <hr>
                  <div class="mt-3 d-flex justify-content-around">
                    <label><b>Role</b></label>
                    <div class="d-flex justify-content-around">
                      <select class="ml-4 form-control" v-model="role">
                        <option v-for="data in roles.response" :value="data.id" :key="data.id">{{ data.role }}</option>
                      </select>
                      <button class="ml-2 btn btn-outline-success" data-toggle="modal" data-target="#addRole">Add</button>
                    </div>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                  <button v-if="selectedMember" type="button" class="btn btn-success" @click="addMemberToGroup">
                    <b>+</b> Add member
                    <span v-if="adding_member" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Add Role Modal -->
          <div class="modal fade" id="addRole" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalCenterTitle">Add a role</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <form>
                    <div class="row form-group">
                      <label class="col-3"><b>Name:</b></label>
                      <input type="text" class="col-8 form-control" placeholder="Enter name of the role" v-model="role_name">
                    </div>
                    <div class="row form-group">
                      <label class="col-3"><b>Description:</b></label>
                      <textarea type="text" class="col-8 form-control" rows="3" v-model="role_description"></textarea>
                    </div>
                  </form>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                  <button type="button" class="btn btn-success" @click="addRole">
                    {{ add_role_button_text }}
                    <span v-if="adding_member" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Remove Members Modal -->
          <div class="modal fade" id="removeMembersModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalCenterTitle">Remove members</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="continer mt-5 mb-5">
                  <span class="d-flex fex-row"><h2 class="text-muted font-weight-bold">{{ member_ids.length }}</h2> Members</span>
                  <h4 class="text-danger">These members alongside with all their data will be removed from the group</h4>
                  <i>This action is irreversible, are you sure that this is what you want??</i>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="setAssignGroupButtonText('assign group')">Close</button>
                  <button type="button" class="btn btn-danger" @click="removeMembers">
                    Remove members
                    <span v-if="removing_members" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Delete Group Modal -->
          <div class="modal fade" id="deleteGroupModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalCenterTitle">Delete group</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="continer mt-5 mb-5">
                  <h4 class="text-danger">This Group alongside with all its data will be deleted</h4>
                  <i>This action is irreversible, are you sure that this is what you want??</i>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-dismiss="modal" @click="setAssignGroupButtonText('assign group')">Close</button>
                  <button type="button" class="btn btn-danger" @click="deleteGroup">
                    Delete group
                    <span v-if="removing_members" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </body>

    <!-- Group Not Found Message -->
    <body v-else class="text-center h1 text-muted">
    Group not found, it might be deleted
    </body>

    <!-- Bottom Navigation -->
    <div id="bottom-actions-tab" class="bottom-action-tab bg-light shadow-lg" style="border-radius: 5%">
      <h2 class="text-right mr-5">
        <a href="javascript:void(0)" class="closebtn text-secondary" @click="closeActions">&times;</a>
      </h2>
      <div>
        <button type="button" class="list-group-item list-group-item-action border-0" data-toggle="modal" data-target="#textModalCenter" @click="closeActions">
          <img src="../../assets/icons/icons8-comments-64.png" style="width: 25px; height:auto">
          Text members
        </button>
        <button type="button" class="list-group-item list-group-item-action border-0" data-toggle="modal" data-target="#removeMembersModal" @click="closeActions">
          <img src="../../assets/icons/icons8-delete-64.png" style="width: 25px; height:auto">
          Remove members
        </button>
        <button type="button" class="ml-2 d-flex fex-row list-group-item list-group-item-action border-0" data-toggle="modal" data-target="#deleteGroupModal" @click="closeActions">
          <h4 class="font-weight-bold text-danger">X</h4>
          <span class="mt-2 ml-3">Delete group</span>
        </button>
        <div class="text-right mr-5 mt-3">
          <span class="btn btn-success d-sm-block d-md-none mx-auto" data-toggle="modal" data-target="#addMemberToGroup" @click="closeActions">
            + Add member
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import axios from 'axios'; // Import Axios
import searchmember from '../../subcomponents/searchmember.vue';
import textmessage from '../../subcomponents/textmessage.vue';

// Reactive state
const group = ref({ response: [] });
const fetch_data_error = ref([]);
const members = ref({ response: [] });
const foundItems = ref(0);
const group_meetings = ref([]);
const activity_selected = ref(false);

// Add member state
const member_in_group = ref(false);
const checking_if_in_group = ref(false);
const role = ref(null);
const selectedMember = ref(null);
const roles = ref({ response: [] });
const member_ids = ref([]);
const adding_member = ref(false);

// Add role state
const role_name = ref('');
const role_description = ref('');
const add_role_button_text = ref('+ add role');
const enable_role_button = ref(false);

// All members state
const all_members = ref(false);
const removing_members = ref(false);

// Router and store
const route = useRoute();
const router = useRouter();
const store = useStore();

// Fetch data on mount
onMounted(() => {
  fetchData();
  getRoles();
});

// Fetch group data
const fetchData = async () => {
  try {
    const groupResponse = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/groups/church-group/${route.params.id}/`);
    group.value = { response: groupResponse.data };

    const membersResponse = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/groups/church-group-members/${route.params.id}/`);
    members.value = { response: membersResponse.data };
    foundItems.value = members.value.response.length;
    member_ids.value = members.value.response.map(member => member.user_id);
  } catch (err) {
    fetch_data_error.value.push(err);
  }
};

// Get roles
const getRoles = async () => {
  try {
    const rolesResponse = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/members/role-list/`);
    roles.value = { response: rolesResponse.data.filter(item => item.is_group_role || item.role === 'member' || item.role === 'group admin') };
  } catch (err) {
    fetch_data_error.value.push(err);
  }
};

// Add member to group
const addMemberToGroup = async () => {
  if (selectedMember.value && role.value && !member_in_group.value) {
    adding_member.value = true;
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/groups/add-member-to-group/`, {
        church_group: group.value.response[0].id,
        member: selectedMember.value,
        role: role.value
      });
      alert('Member successfully added');
      fetchData();
    } catch (err) {
      alert('Error adding member: ' + err);
    } finally {
      adding_member.value = false;
    }
  } else {
    alert('Error: Invalid data');
  }
};

// Get group activity
const getGroupActivity = async () => {
  try {
    const activityResponse = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/events/events-by-group/${route.params.id}/`);
    group_meetings.value = activityResponse.data;
    activity_selected.value = true;
  } catch (err) {
    alert('Error fetching activity: ' + err);
  }
};

// Add role
const addRole = async () => {
  if (role_name.value && role_description.value) {
    add_role_button_text.value = 'Adding role...';
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/members/role-list/`, {
        role: role_name.value,
        description: role_description.value,
        is_group_role: true
      });
      alert('Role successfully added');
      getRoles();
    } catch (err) {
      alert('Error adding role: ' + err);
    } finally {
      add_role_button_text.value = '+ add role';
    }
  } else {
    alert('Error: Invalid data');
  }
};

// Delete group
const deleteGroup = async () => {
  if (confirm('Are you sure you want to delete this group?')) {
    removing_members.value = true;
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/groups/church-group/${route.params.id}/`);
      alert('Group deleted');
      router.push({ name: 'groupsLanding' });
    } catch (err) {
      alert('Error deleting group: ' + err);
    } finally {
      removing_members.value = false;
    }
  }
};

// Remove members
const removeMembers = async () => {
  if (confirm('Are you sure you want to remove these members?')) {
    removing_members.value = true;
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/groups/remove-members-from-group/`, {
        group_id: route.params.id,
        member_ids: member_ids.value
      });
      alert('Members removed');
      fetchData();
    } catch (err) {
      alert('Error removing members: ' + err);
    } finally {
      removing_members.value = false;
    }
  }
};

// Open bottom actions tab
const openAction = () => {
  document.getElementById('bottom-actions-tab').style.height = '200px';
};

// Close bottom actions tab
const closeActions = () => {
  document.getElementById('bottom-actions-tab').style.height = '0px';
};

// Set assign group button text
const setAssignGroupButtonText = (text) => {
  console.log('Assign group button text set to:', text);
};

// Watchers
watch([role_name, role_description], () => {
  enable_role_button.value = role_name.value && role_description.value;
});

watch(all_members, (newVal) => {
  member_ids.value = newVal ? members.value.response.map(member => member.user_id) : [];
});
</script>

<style scoped>
/* Add your styles here */
</style>

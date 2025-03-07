


updated vue3 code




<template>
    <div class="memberdetail">
        <!-- title bit with avatar -->
        <div class="mx-auto" style="width: 200px;">
            <div class="row">
                <div class="col border" style="height: 100px; border-radius: 15px">
                    <div style="padding: 25px">
                        <img src="@/assets/avatars/icons8-user-male-skin-type-4-40.png">
                    </div>
                </div>
                <div style="padding: 10px">
                    <div class="row mx-auto">
                        <b>name :</b>
                        {{ member_info.member[0].member.first_name }}
                        {{ member_info.member[0].middle_name }}
                        {{ member_info.member[0].member.last_name }}
                    </div>
                </div>
            </div>
        </div>
        <hr/>
        <div class="row" style="padding: 25px">
            <div class="col">
                <!-- personal detail -->
                <div class="card border-0" style="max-width: 18rem;">
                    <div class="card-header border-0">
                        <span class="row">
                            <span class="col text-left">Personal</span>
                            <span class="col text-right">
                                <a href="#" data-toggle="modal" data-target="#editPersonalDetailModal">
                                    <img src="@/assets/icons/icons8-edit-24.png" style="width: 20px; height: auto">
                                </a>
                            </span>
                        </span>
                    </div>
                    <div class="card-body">
                        <span v-for="data in member_info" :key="data.member.username">
                            <p><b>username:</b> {{ data.member.username }}</p>
                            <p v-if="data.gender == 'M'"><b>gender :</b> male</p>
                            <p v-if="data.gender == 'F'"><b>gender :</b> female</p>
                        </span>
                        <p v-if="marital_status_info.marital_status.length == 0"><b>marital status :</b> none given</p>
                        <span v-for="data in marital_status_info" :key="data.status">
                            <p v-if="data.status == 'M'"><b>marital status :</b> married</p>
                            <p v-if="data.status == 'S'"><b>marital status :</b> single</p>
                            <p v-if="data.status == 'D'"><b>marital status :</b> divorced</p>
                            <p v-if="data.status == 'W'"><b>marital status :</b> widowed</p>
                        </span>
                        <p v-if="age_errors.length > 0"><b>age :</b> none given</p>
                        <span v-for="data in age_info" :key="data.age">
                            <p><b>age :</b> {{ data.age }} <small class="text-info">({{ data.d_o_b }})</small></p>
                        </span>
                    </div>
                </div>
                <!-- residence data -->
                <div class="card border-0" style="max-width: 18rem;">
                    <div class="card-header border-0">
                        <span class="row">
                            <span class="col text-left">Residence</span>
                            <span class="col text-right">
                                <a href="#" data-toggle="modal" data-target="#editResidenceModal">
                                    <img src="@/assets/icons/icons8-edit-24.png" style="width: 20px; height: auto">
                                </a>
                            </span>
                        </span>
                    </div>
                    <div class="card-body">
                        <p v-if="residence_info.residence.length == 0">none given</p>
                        <span v-for="data in residence_info" :key="data.town">
                            <p><b>town:</b> {{ data.town }}</p>
                            <p><b>road:</b> {{ data.road }}</p>
                            <p><b>street/drive:</b> {{ data.street }}</p>
                            <p><b>estate:</b> {{ data.village_estate }}</p>
                            <p><b>description:</b> {{ data.description }}</p>
                        </span>
                    </div>
                </div>
            </div>
            <!-- COL 2 -->
            <div class="col">
                <!-- contact detail -->
                <div class="card border-0" style="max-width: 18rem;">
                    <div class="card-header border-0">
                        <span class="row">
                            <span class="col text-left">Contact</span>
                            <span class="col text-right">
                                <a href="#" data-toggle="modal" data-target="#editContactModal">
                                    <img src="@/assets/icons/icons8-edit-24.png" style="width: 20px; height: auto">
                                </a>
                            </span>
                        </span>
                    </div>
                    <div class="card-body" v-if="contact_info">
                        <p v-if="contact_info.contact.length == 0">none given</p>
                        <span v-for="data in contact_info" :key="data.phone">
                            <p><b>phone 1:</b> {{ data.phone }}</p>
                            <p><b>phone 2:</b> {{ data.phone2 }}</p>
                            <div v-if="data.member.email == ''"><b>email :</b> none given</div>
                            <div v-if="data.member.email != ''"><b>email :</b> {{ data.member.email }}</div>
                        </span>
                    </div>
                </div>
                <div class="card border-0" style="max-width: 18rem;">
                    <div class="card-header border-0">Family</div>
                    <div class="card-body"></div>
                </div>
            </div>
        </div>
        <!-- edit personal detail Modal -->
        <div class="modal fade" id="editPersonalDetailModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalCenterTitle">Edit Personal detail</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="row form-group">
                            <label class="col-3"><b>first name:</b></label>
                            <input type="text" class="col-8 form-control"
                                   :placeholder="member_info.member[0].member.first_name"
                                   v-model="new_first_name">
                        </div>
                        <div class="row form-group">
                            <label class="col-3"><b>middle name:</b></label>
                            <input type="text" class="col-8 form-control"
                                   :placeholder="member_info.member[0].middle_name || 'not given'"
                                   v-model="new_middle_name">
                        </div>
                        <div class="row form-group">
                            <label class="col-3"><b>last name:</b></label>
                            <input type="text" class="col-8 form-control"
                                   :placeholder="member_info.member[0].member.last_name"
                                   v-model="new_last_name">
                        </div>
                        <div class="row form-group">
                            <label class="col-3"><b>date of birth:</b></label>
                            <input type="date" name="bday" max="3000-12-31"
                                   min="1000-01-01" class="col-8 form-control" v-model="new_d_o_b">
                        </div>
                        <div class="row form-group">
                            <label class="col-3"><b>gender:</b></label>
                            <select class="col-8 custom-select" v-model="new_gender">
                                <option value="M">male</option>
                                <option value="F">female</option>
                            </select>
                        </div>
                        <div class="row form-group">
                            <label class="col-3"><b>marital status:</b></label>
                            <select class="col-8 custom-select" v-model="new_marital_status">
                                <option value="M" selected>married</option>
                                <option value="S">single</option>
                                <option value="D">divorced</option>
                                <option value="W">widowed</option>
                            </select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-success" v-on:click="updatePersonalDetail()">
                            Save changes
                            <span v-if="updating_details" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <!-- edit residence data Modal -->
        <div class="modal fade" id="editResidenceModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalCenterTitle">Modal Residence</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body" v-if="residence_info.residence.length">
                        <div class="row form-group">
                            <label class="col-3"><b>town:</b></label>
                            <input type="text" class="col-8 form-control"
                                   :placeholder="residence_info.residence[0].town || 'not given'"
                                   v-model="new_town_name">
                        </div>
                        <div class="row form-group">
                            <label class="col-3"><b>road:</b></label>
                            <input type="text" class="col-8 form-control"
                                   :placeholder="residence_info.residence[0].road || 'not given'"
                                   v-model="new_road_name">
                        </div>
                        <div class="row form-group">
                            <label class="col-3"><b>street:</b></label>
                            <input type="text" class="col-8 form-control"
                                   :placeholder="residence_info.residence[0].street || 'not given'"
                                   v-model="new_street_name">
                        </div>
                        <div class="row form-group">
                            <label class="col-3"><b>estate:</b></label>
                            <input type="text" class="col-8 form-control"
                                   :placeholder="residence_info.residence[0].village_estate || 'not given'"
                                   v-model="new_estate">
                        </div>
                        <div class="row form-group">
                            <label class="col-3"><b>description:</b></label>
                            <input type="text" class="col-8 form-control"
                                   :placeholder="residence_info.residence[0].description || 'not given'"
                                   v-model="new_description">
                        </div>
                    </div>
                    <div class="modal-body" v-else>
                        <div class="row form-group">
                            <label class="col-3"><b>town:</b></label>
                            <input type="text" class="col-8 form-control" placeholder="not given" v-model="new_town_name">
                        </div>
                        <div class="row form-group">
                            <label class="col-3"><b>road:</b></label>
                            <input type="text" class="col-8 form-control" placeholder="not given" v-model="new_road_name">
                        </div>
                        <div class="row form-group">
                            <label class="col-3"><b>street:</b></label>
                            <input type="text" class="col-8 form-control" placeholder="not given" v-model="new_street_name">
                        </div>
                        <div class="row form-group">
                            <label class="col-3"><b>estate:</b></label>
                            <input type="text" class="col-8 form-control" placeholder="not given" v-model="new_estate">
                        </div>
                        <div class="row form-group">
                            <label class="col-3"><b>description:</b></label>
                            <input type="text" class="col-8 form-control" placeholder="not given" v-model="new_description">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-success" v-on:click="updateResidenceDetail()">
                            Save changes
                            <span v-if="updating_details" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <!-- edit contact data Modal -->
        <div class="modal fade" id="editContactModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalCenterTitle">Edit Contact</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body" v-if="contact_info.contact.length">
                        <div class="row mb-3">
                            <span class="col-12">
                                <label><b>phone number 1:</b></label>
                                <input type="text" class="form-control"
                                       :placeholder="contact_info.contact[0].phone || 'not given'" v-model="phone_number1">
                            </span>
                        </div>
                        <div class="row mb-5">
                            <span class="col-12">
                                <label><b>phone number 2:</b></label>
                                <input type="text" class="form-control"
                                       :placeholder="contact_info.contact[0].phone2 || 'not given'" v-model="phone_number2">
                            </span>
                        </div>
                        <p v-if="phone_number_errors.length">
                            <ul>
                                <small><li v-for="error in phone_number_errors" :key="error"><p class="text-danger">{{ error }}</p></li></small>
                            </ul>
                        </p>
                        <p v-if="phone_number_OK.length">
                            <ul>
                                <small><li v-for="error in phone_number_OK" :key="error"><p class="text-success">{{ error }}</p></li></small>
                            </ul>
                        </p>
                        <hr/>
                        <div class="row form-group">
                            <label class="col-3"><b>email:</b></label>
                            <input type="email" class="col-8 form-control"
                                   :placeholder="contact_info.contact[0].member.email || 'not given'"
                                   v-model="new_email">
                        </div>
                    </div>
                    <div class="modal-body" v-else>
                        <div class="row mb-3">
                            <span class="col-12">
                                <label><b>phone number 1:</b></label>
                                <input type="text" class="form-control"
                                       placeholder="not given" v-model="phone_number1">
                            </span>
                        </div>
                        <div class="row mb-5">
                            <span class="col-12">
                                <label><b>phone number 2:</b></label>
                                <input type="text" class="form-control"
                                       placeholder="not given" v-model="phone_number2">
                            </span>
                        </div>
                        <p v-if="phone_number_errors.length">
                            <ul>
                                <small><li v-for="error in phone_number_errors" :key="error"><p class="text-danger">{{ error }}</p></li></small>
                            </ul>
                        </p>
                        <p v-if="phone_number_OK.length">
                            <ul>
                                <small><li v-for="error in phone_number_OK" :key="error"><p class="text-success">{{ error }}</p></li></small>
                            </ul>
                        </p>
                        <hr/>
                        <div class="row form-group">
                            <label class="col-3"><b>email:</b></label>
                            <input type="email" class="col-8 form-control"
                                   placeholder="email not given"
                                   v-model="new_email">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-success" v-on:click="updateContactDetail()">
                            Save changes
                            <span v-if="updating_details" class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent, ref, watch, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useStore } from "vuex";
import axios from "axios";

export default defineComponent({
  name: "memberdetail",
  setup() {
    const route = useRoute();
    const store = useStore();

    const member_info = ref(null);
    const contact_info = ref(null);
    const contact_errors = ref([]);
    const age_info = ref(null);
    const age_errors = ref([]);
    const residence_info = ref(null);
    const residence_errors = ref([]);
    const roles_info = ref(null);
    const roles_errors = ref([]);
    const marital_status_info = ref(null);
    const marital_status_errors = ref([]);
    const family_info = ref(null);
    const family_errors = ref([]);

    const updating_details = ref(false);
    const new_d_o_b = ref(null);
    const new_first_name = ref(null);
    const new_middle_name = ref(null);
    const new_last_name = ref(null);
    const new_gender = ref(null);
    const new_marital_status = ref(null);

    const new_town_name = ref(null);
    const new_road_name = ref(null);
    const new_estate = ref(null);
    const new_street_name = ref(null);
    const new_description = ref(null);

    const new_email = ref("");
    const phone_number_errors = ref([]);
    const phone_number_OK = ref([]);
    const country_code = ref("+254");
    const phone_number1 = ref(null);
    const phone_number2 = ref(null);

    const fetchData = () => {
      store.dispatch("update_isLoading", true);

      axios
        .get(`${process.env.BASE_URL}/api/members/member/${route.params.id}/`)
        .then((response) => {
          member_info.value = { member: response.data };
        })
        .catch(() => {});

      axios
        .get(
          `${process.env.BASE_URL}/api/members/contact-for-member/${route.params.id}/`
        )
        .then((response) => {
          contact_info.value = { contact: response.data };
        })
        .catch(() => {});

      axios
        .get(
          `${process.env.BASE_URL}/api/members/age-for-member/${route.params.id}/`
        )
        .then((response) => {
          age_info.value = { age: response.data };
        })
        .catch(() => {});

      axios
        .get(
          `${process.env.BASE_URL}/api/members/residence-for-member/${route.params.id}/`
        )
        .then((response) => {
          residence_info.value = { residence: response.data };
        })
        .catch((error) => {
          residence_errors.value.push(error);
        });

      axios
        .get(
          `${process.env.BASE_URL}/api/members/roles-for-member/${route.params.id}/`
        )
        .then((response) => {
          roles_info.value = { roles: response.data };
        })
        .catch((error) => {
          roles_errors.value.push(error);
        });

      axios
        .get(
          `${process.env.BASE_URL}/api/members/marital-status-for-member/${route.params.id}/`
        )
        .then((response) => {
          marital_status_info.value = { marital_status: response.data };
        })
        .catch((error) => {
          marital_status_errors.value.push(error);
        });

      axios
        .get(
          `${process.env.BASE_URL}/api/members/family-for-member/${route.params.id}/`
        )
        .then((response) => {
          family_info.value = { family: response.data };
        })
        .catch((error) => {
          family_errors.value.push(error);
        });

      axios
        .get(
          `${process.env.BASE_URL}/api/members/family-tree-for-member/${route.params.id}/`
        )
        .then((response) => {
          family_info.value = { tree: response.data };
          store.dispatch("update_isLoading", false);
        })
        .catch((error) => {
          family_errors.value.push(error);
          store.dispatch("update_isLoading", false);
        });
    };

    onMounted(fetchData);

    watch(phone_number1, (newVal) => {
      phone_number_errors.value = [];
      phone_number_OK.value = [];

      if (isNaN(newVal)) {
        phone_number_errors.value.push("Phone number should be numbers only");
      } else if (newVal.length > 10) {
        phone_number_errors.value.push("Number too long");
      } else if (newVal.length < 10) {
        phone_number_errors.value.push("Number too short");
      } else {
        phone_number_OK.value.push("Number OK");
      }
    });

    watch(phone_number2, (newVal) => {
      phone_number_errors.value = [];
      phone_number_OK.value = [];

      if (isNaN(newVal)) {
        phone_number_errors.value.push("Phone number should be numbers only");
      } else if (newVal.length > 9) {
        phone_number_errors.value.push("Number too long");
      } else if (newVal.length < 9) {
        phone_number_errors.value.push("Number too short");
      } else {
        phone_number_OK.value.push("Number OK");
      }
    });

    const updatePersonalDetail = () => {
      updating_details.value = true;
      axios
        .patch(`${process.env.BASE_URL}/api/members/update-member-detail/`, {
          member_id: route.params.id,
          first_name: new_first_name.value,
          last_name: new_last_name.value,
          middle_name: new_middle_name.value,
          gender: new_gender.value,
          d_o_b: new_d_o_b.value,
          marital_status: new_marital_status.value,
        })
        .then(() => {
          new_first_name.value = null;
          new_d_o_b.value = null;
          new_gender.value = null;
          new_last_name.value = null;
          new_middle_name.value = null;
          new_marital_status.value = null;
          updating_details.value = false;

          let new_version =
            parseInt(localStorage.getItem("member_list_version")) + 1;
          store.dispatch("update_member_list_version", new_version);
          fetchData();
          alert("Update successful");
        })
        .catch(() => {
          fetchData();
          updating_details.value = false;
          alert("Error updating");
        });
    };

    const updateResidenceDetail = () => {
      updating_details.value = true;
      axios
        .patch(`${process.env.BASE_URL}/api/members/update-member-residence/`, {
          member_id: route.params.id,
          town: new_town_name.value,
          road: new_road_name.value,
          street: new_street_name.value,
          estate: new_estate.value,
          description: new_description.value,
        })
        .then(() => {
          new_town_name.value = null;
          new_road_name.value = null;
          new_street_name.value = null;
          new_description.value = null;
          updating_details.value = false;
          fetchData();
          alert("Update successful");
        })
        .catch(() => {
          updating_details.value = false;
          alert("Error updating");
        });
    };

    const updateContactDetail = () => {
      updating_details.value = true;
      axios
        .patch(`${process.env.BASE_URL}/api/members/update-member-contact/`, {
          member_id: route.params.id,
          phone: phone_number1.value,
          phone2: phone_number2.value,
          email: new_email.value,
        })
        .then(() => {
          phone_number1.value = null;
          phone_number2.value = null;
          new_email.value = null;
          updating_details.value = false;
          fetchData();
          alert("Update successful");
        })
        .catch(() => {
          updating_details.value = false;
          alert("Error updating");
        });
    };

    return {
      member_info,
      contact_info,
      age_info,
      residence_info,
      roles_info,
      marital_status_info,
      family_info,
      updating_details,
      new_first_name,
      new_last_name,
      new_middle_name,
      new_d_o_b,
      new_gender,
      new_marital_status,
      new_town_name,
      new_road_name,
      new_street_name,
      new_estate,
      new_description,
      phone_number1,
      phone_number2,
      phone_number_errors,
      phone_number_OK,
      updatePersonalDetail,
      updateResidenceDetail,
      updateContactDetail,
    };
  },
});
</script>


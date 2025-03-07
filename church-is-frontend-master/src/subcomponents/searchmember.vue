<!-- updated vue 3 code -->

<template>
    <div class="child">
        <div class="anvil-select row form-group">
            <select class="ml-3 custom-select border-0 shadow-0 text-muted"
                v-model="selected_input"
                style="outline: none;
                       box-shadow:none !important;">
                <option value="existing_member" selected>existing member</option>
                <option value="new_member">new member</option>
            </select>
        </div>

        <div v-if="selected_input == 'existing_member'">
            <!-- search for member -->
            <input type="text" class="form-control" placeholder="type to search member" v-model="memberSearch" autofocus>
            <div class="pre-scrollable searchedItemsDiv border"
                style="min-width: 300px;
                        max-height: 185px;
                        overflow-y: scroll;
                            position: absolute;
                            z-index: 1;
                            background-color: white"
                v-if="showMemberInput">

                <div style="padding: 10px 10px 10px 10px" class="text-info">{{ memberSearch_status }}</div>

                <table class="table border-0">
                    <tbody>
                        <tr class="searchedItem border-0" v-for="data in found_members.response" :key="data.member.id">
                            <a href="#" style="text-decoration: none" @click.prevent="selectMember(data.member.id, data.member.first_name, data.member.last_name)">
                                <td class="border-0">
                                    <img v-if="data.gender == 'M'" style="height: 32px" src="@/assets/avatars/icons8-user-male-skin-type-4-40.png">
                                    <img v-if="data.gender == 'F'" style="height: 32px" src="@/assets/avatars/icons8-user-female-skin-type-4-40.png">
                                    <img v-if="data.gender == 'R'" style="height: 32px" src="@/assets/avatars/icons8-contacts-96.png">
                                    <span class="text-secondary text-capitalize">
                                        {{ data.member.first_name }} {{ data.member.last_name }}
                                        <small>( {{ data.phone_number }} )</small>
                                    </span>
                                </td>
                            </a>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- add new member -->
        <div v-if="selected_input == 'new_member'">
            <div>
                <div class="form-group">
                    <label><b>first name :</b></label>
                    <input type="text" class="form-control" placeholder="first name" v-model="first_name" autofocus>
                    <p v-if="first_name_errors.length">
                        <ul>
                            <small>
                                <li v-for="error in first_name_errors" :key="error">
                                    <p class="text-danger">{{ error }}</p>
                                </li>
                            </small>
                        </ul>
                    </p>
                </div>
                <div class="form-group">
                    <label><b>last name :</b></label>
                    <input type="text" class="form-control" placeholder="last name" v-model="last_name">
                    <p v-if="last_name_errors.length">
                        <ul>
                            <small>
                                <li v-for="error in last_name_errors" :key="error">
                                    <p class="text-danger">{{ error }}</p>
                                </li>
                            </small>
                        </ul>
                    </p>
                </div>
                <hr>
                <div class="checkbox">
                    <div class="radio">
                        <label><input type="radio" value="M" v-model="gender"> male</label>
                    </div>
                    <div class="radio">
                        <label><input type="radio" value="F" v-model="gender"> female</label>
                    </div>
                    <p v-if="gender_errors.length">
                        <ul>
                            <small>
                                <li v-for="error in gender_errors" :key="error">
                                    <p class="text-danger">{{ error }}</p>
                                </li>
                            </small>
                        </ul>
                    </p>
                </div>
                <hr>
                <div>
                    <span class="col-4">
                        <label><b>code :</b></label>
                        <input class="form-control" type="text" placeholder="+254" v-model="country_code">
                    </span>
                    <span class="col-8">
                        <label><b>phone number :</b></label>
                        <input type="text" class="form-control" placeholder="712345678" v-model="phone_number">
                    </span>
                    <p v-if="phone_number_errors.length">
                        <ul>
                            <small>
                                <li v-for="error in phone_number_errors" :key="error">
                                    <p class="text-danger">{{ error }}</p>
                                </li>
                            </small>
                        </ul>
                    </p>
                    <p v-if="phone_number_OK.length">
                        <ul>
                            <small>
                                <li v-for="success in phone_number_OK" :key="success">
                                    <p class="text-success">{{ success }}</p>
                                </li>
                            </small>
                        </ul>
                    </p>
                </div>
                <div style="padding: 0px 0px 25px 0px">
                    <a href="#add-member" @click.prevent="addMember()" style="text-decoration: none">
                        <div class="add-button">
                            add new member
                            <span v-if="adding_member"
                                  class="spinner-border spinner-border-sm"
                                  role="status"
                                  aria-hidden="true"></span>
                        </div>
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent, ref, watch, computed, onMounted } from "vue";
import _ from "lodash";
import axios from "axios";

export default defineComponent({
  name: "searchmember",
  setup(_, { emit }) {
    const childMessage = ref("");
    const selected_input = ref("existing_member");

    // Member search
    const memberSearch = ref("");
    const found_members = ref([]);
    const memberSearch_status = ref("");
    const selectedMember = ref(null);
    const showMemberInput = ref(false);

    const country_code = ref("+254");
    const contact = ref(" ");
    const postal_address = ref("");
    const phone_number = ref("");
    const phone_number_errors = ref([]);
    const phone_number_OK = ref([]);

    // Names and gender
    const first_name = ref("");
    const first_name_errors = ref([]);
    const last_name = ref("");
    const last_name_errors = ref([]);
    const gender = ref("");
    const gender_errors = ref([]);
    const added_member = ref([]);
    const add_member_button_text = ref("+ add member");
    const add_member_error = ref([]);
    const added_member_id = ref(null);
    const adding_member = ref(false);

    // Debounce member search
    const debouncedGetAnswer = _.debounce(() => getAnswer(), 1000);

    watch(memberSearch, () => {
      const array = memberSearch.value.split(" ");
      if (memberSearch.value.length > 0 && array.length === 1) {
        showMemberInput.value = true;
        debouncedGetAnswer();
      } else {
        memberSearch_status.value = "";
        found_members.value = [];
        showMemberInput.value = false;
      }
    });

    watch(phone_number, () => {
      phone_number_errors.value = [];
      phone_number_OK.value = [];

      if (isNaN(phone_number.value)) {
        phone_number_errors.value.push("Phone number should be numbers only");
      }

      if (phone_number.value.length > 9) {
        phone_number_errors.value.push("Number too long");
      } else if (phone_number.value.length < 9) {
        phone_number_errors.value.push("Number too short");
      } else if (phone_number.value.length === 9) {
        phone_number_OK.value.push("Number OK");
      }
    });

    function emitToParent() {
      emit("memberSelected", selectedMember.value);
    }

    function getAnswer() {
      if (memberSearch.value.length > 0) {
        found_members.value = [];
        memberSearch_status.value = "searching...";

        axios
          .get(`${process.env.VUE_APP_BASE_URL}/api/members/filter-by-first_name/${memberSearch.value}/`)
          .then((response) => {
            found_members.value = { response: response.data };
            memberSearch_status.value = "";
          })
          .catch(() => {
            memberSearch_status.value = "";
            showMemberInput.value = false;
          });
      }
    }

    function selectMember(id, first_name, last_name) {
      selectedMember.value = id;
      memberSearch.value = `${first_name} ${last_name}`;
      memberSearch_status.value = "";
      showMemberInput.value = false;
      emitToParent();
    }

    function addMember() {
      first_name_errors.value = [];
      last_name_errors.value = [];
      gender_errors.value = [];

      if (!first_name.value) {
        first_name_errors.value.push("You must enter the first name");
        return false;
      }
      if (first_name.value.split(" ").length > 1) {
        first_name_errors.value.push("First name must be one word only, remove any spaces");
        return false;
      }
      if (!last_name.value) {
        last_name_errors.value.push("You must enter a last name");
        return false;
      }
      if (last_name.value.split(" ").length > 1) {
        last_name_errors.value.push("Last name must be one word only, remove spaces");
        return false;
      }
      if (!gender.value) {
        gender_errors.value.push("Select gender");
        return false;
      }

      adding_member.value = true;
      axios
        .post(`${process.env.VUE_APP_BASE_URL}/api/members/add-member/`, {
          first_name: first_name.value,
          last_name: last_name.value,
          gender: gender.value,
          email: "",
        })
        .then((response) => {
          const added_member_data = response.data;
          added_member.value.push(added_member_data);

          last_name.value = "";
          first_name.value = "";
          adding_member.value = false;

          const added_member_id_value = added_member_data.member.id;
          const added_member_firstname = added_member_data.member.first_name;
          const added_member_lastname = added_member_data.member.last_name;

          selected_input.value = "existing_member";
          selectMember(added_member_id_value, added_member_firstname, added_member_lastname);

          addContact(added_member_id_value);

          const new_version = parseInt(localStorage.getItem("member_list_version")) + 1;
          emit("update_member_list_version", new_version);
          alert("Member added successfully");
        })
        .catch((err) => {
          add_member_error.value.push(err);
        });
    }

    function addContact(added_member_id) {
      axios.post(`${process.env.VUE_APP_BASE_URL}/api/members/add-member-contact/`, {
        member_id: added_member_id,
        postal_address: postal_address.value,
        phone: `${country_code.value}${phone_number.value}`,
        contact: contact.value,
      });
    }

    return {
      childMessage,
      selected_input,
      memberSearch,
      found_members,
      memberSearch_status,
      selectedMember,
      showMemberInput,
      country_code,
      contact,
      postal_address,
      phone_number,
      phone_number_errors,
      phone_number_OK,
      first_name,
      first_name_errors,
      last_name,
      last_name_errors,
      gender,
      gender_errors,
      added_member,
      add_member_button_text,
      add_member_error,
      added_member_id,
      adding_member,
      emitToParent,
      getAnswer,
      selectMember,
      addMember,
      addContact,
    };
  },
});
</script>

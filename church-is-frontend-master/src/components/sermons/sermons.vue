


    <style >
    </style>




updated vue 3 code


<template>
    <div>
        <nav aria-label="breadcrumb" class="continer">
            <ol class="breadcrumb">
                <li class="breadcrumb-item">
                    <span class="backButton">
                        <router-link style="text-decoration: none" :to="{ name: 'Home' }">Home</router-link>
                    </span>
                </li>
                <li class="breadcrumb-item active" aria-current="page">sermons</li>
            </ol>
        </nav>

        <div class="continer">
            <div class="row">
                <div class="col-12 col-sm-10 col-md-8 col-lg-2">
                    <div class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                        <a class="action-list list-group-item list-group-item-action border-0 active"
                            id="v-pills-income-tab"
                            href="#v-pills-today"
                            role="tab"
                            aria-controls="v-pills-today"
                            aria-selected="true"
                        >
                            today
                        </a>
                        <a class="action-list list-group-item list-group-item-action border-0"
                            id="v-pills-expenditure-tab"
                            href="#v-pills-this-month"
                            role="tab"
                            aria-controls="v-pills-this-month"
                            aria-selected="false"
                            @click="getSermonsThisMonth()"
                        >
                            this month
                        </a>
                    </div>
                </div>

                <div class="col">
                    <div class="tab-content" id="v-pills-tabContent">
                        <div class="tab-pane fade show active" id="v-pills-today" role="tabpanel" aria-labelledby="v-pills-today-tab">
                            <div v-if="!sermons_available">no sermons available today</div>
                            <div v-if="sermons_available">
                                <div v-for="data in sermons_today.response" :key="data.id">
                                    <div>{{ data.title }}</div>
                                    <hr />
                                    <div class="row">
                                        <div class="col-12 col-sm-10 col-md-8 col-lg-2">
                                            <img :src="data.featured_image" />
                                        </div>
                                        <div class="col text-secondary">{{ data.sermon }}</div>
                                    </div>
                                    <div>
                                        <div class="card-body">
                                            <p class="card-text text-muted">
                                                by --{{ data.preached_by_member.member.first_name }} {{ data.preached_by_member.member.last_name }}--
                                            </p>
                                            <p class="card-text">
                                                <small class="text-muted">date - <b>{{ data.date }}</b></small>
                                            </p>
                                        </div>
                                    </div>
                                    <hr />
                                </div>
                            </div>
                        </div>

                        <div class="tab-pane fade" id="v-pills-this-month" role="tabpanel" aria-labelledby="v-pills-this-month-tab">
                            <div v-if="this_month_selected">
                                <div v-for="data in sermons_this_month.response" :key="data.id">
                                    <div>{{ data.title }}</div>
                                    <hr />
                                    <div class="row">
                                        <div class="col-12 col-sm-10 col-md-8 col-lg-2">
                                            <img :src="data.featured_image" />
                                        </div>
                                        <div class="col text-secondary">{{ data.sermon }}</div>
                                    </div>
                                    <div>
                                        <div class="card-body">
                                            <p class="card-text text-muted">
                                                by --{{ data.preached_by_member.member.first_name }} {{ data.preached_by_member.member.last_name }}--
                                            </p>
                                            <p class="card-text">
                                                <small class="text-muted">date - <b>{{ data.date }}</b></small>
                                            </p>
                                        </div>
                                    </div>
                                    <hr />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-12 col-sm-10 col-md-8 col-lg-3">
                    <div style="padding: 0px 0px 25px 10px">
                        <a href="#" style="text-decoration: none" data-bs-toggle="modal" data-bs-target="#addSermon">
                            <div class="add-button">+ add sermon</div>
                        </a>
                    </div>
                </div>
            </div>

            <!-- Add Sermon Modal -->
            <div class="modal fade" id="addSermon" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered" role="document">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalCenterTitle">add sermon</h5>
                            <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form>
                                <div class="row checkbox">
                                    <div class="col-3"></div>
                                    <div class="col-8">
                                        <label>
                                            <input type="checkbox" :value="true" v-model="non_member" />
                                            sermon by non-member
                                        </label>
                                    </div>
                                </div>
                                <hr />
                                <div class="row form-group" v-if="!non_member">
                                    <label class="col-3"><b>member:</b></label>
                                    <div class="col-8">
                                        <input type="text" class="form-control" placeholder="type to search member" v-model="memberSearch" autofocus />
                                        <div style="padding: 10px" class="text-info">{{ memberSearch_status }}</div>
                                        <div class="pre-scrollable searchedItemsDiv border" style="max-height: 185px; overflow-y: scroll;" v-if="showMemberInput">
                                            <table class="table border-0">
                                                <tbody>
                                                    <tr class="searchedItem border-0" v-for="data in found_members.response" :key="data.member.id">
                                                        <a href="#" style="text-decoration: none" @click="selectMember(data.member.id, data.member.first_name, data.member.last_name)">
                                                            <td class="border-0">
                                                                <img v-if="data.gender === 'M'" style="height: 32px" src="@/assets/avatars/icons8-user-male-skin-type-4-40.png" />
                                                                <img v-if="data.gender === 'F'" style="height: 32px" src="@/assets/avatars/icons8-user-female-skin-type-4-40.png" />
                                                                <img v-if="data.gender === 'R'" style="height: 32px" src="@/assets/avatars/icons8-contacts-96.png" />
                                                                <span class="text-secondary">{{ data.member.first_name }} {{ data.member.last_name }}</span>
                                                            </td>
                                                        </a>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-success" @click="addOffering()"><b>+</b> add sermon</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
import { ref, reactive, watch, onMounted } from "vue";
import axios from "axios";
import _ from "lodash";

export default {
  name: "sermons",
  setup() {
    const non_member = ref(false);
    const fetch_data_errors = ref(null);
    const sermons_available = ref(false);
    const sermons_today = ref(null);
    const this_month_selected = ref(false);
    const sermons_this_month = ref(null);

    // Search for members
    const memberSearch = ref("");
    const found_members = ref([]);
    const memberSearch_status = ref("");
    const selectedMember = ref(null);
    const showMemberInput = ref(false);

    const fetchData = () => {
      fetch_data_errors.value = [];
      axios
        .get(import.meta.env.VUE_APP_BASE_URL + "/api/sermons/sermons-today/")
        .then((response) => {
          sermons_today.value = { response: response.data };
          if (sermons_today.value.response.length > 0) {
            sermons_available.value = true;
          }
        })
        .catch((err) => {
          fetch_data_errors.value.push(err);
        });
    };

    const getSermonsThisMonth = () => {
      this_month_selected.value = true;
      axios
        .get(import.meta.env.VUE_APP_BASE_URL + "/api/sermons/sermons-this-month/")
        .then((response) => {
          sermons_this_month.value = { response: response.data };
        })
        .catch((err) => {
          fetch_data_errors.value.push(err);
        });
    };

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

    const debouncedGetAnswer = _.debounce(getAnswer, 1000);

    watch(memberSearch, (newVal) => {
      const array = newVal.split(" ");
      if (newVal.length > 0 && array.length === 1) {
        showMemberInput.value = true;
        memberSearch_status.value = "typing...";
        debouncedGetAnswer();
      } else {
        memberSearch_status.value = "";
        found_members.value = [];
        showMemberInput.value = false;
      }
    });

    const selectMember = (id, first_name, last_name) => {
      selectedMember.value = id;
      memberSearch.value = first_name + " " + last_name;
      memberSearch_status.value = "";
      showMemberInput.value = false;
    };

    onMounted(() => {
      fetchData();
    });

    return {
      non_member,
      fetch_data_errors,
      sermons_available,
      sermons_today,
      this_month_selected,
      sermons_this_month,
      memberSearch,
      found_members,
      memberSearch_status,
      selectedMember,
      showMemberInput,
      fetchData,
      getSermonsThisMonth,
      getAnswer,
      selectMember,
    };
  },
};
</script>

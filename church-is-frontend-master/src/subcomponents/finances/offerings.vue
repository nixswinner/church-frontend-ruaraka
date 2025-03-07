
//updated vue 3 code
<!-- Parent.vue -->
<template>
  <div v-if="offerings && offering_stats">
    <!-- OFFERING CONTENT -->
    <div v-if="!hide_content">
      <!-- what to show on small devices -->
      <div class="text-muted">
        <div class="d-flex d-flex-row justify-content-center">
          <div class="d-none d-lg-block stat-item mr-2 text-muted">
            This month
            <span class="text-secondary font-weight-bold">
              Ksh {{ humanize(offering_stats.response.total_in_offerings_this_month) }}
            </span>
          </div>
          <div class="d-none d-lg-block stat-item mr-2">
            This year
            <span class="text-secondary font-weight-bold">
              Ksh {{ humanize(offering_stats.response.total_in_offerings_this_year) }}
            </span>
          </div>
          <a class="ml-3 btn btn-outline-secondary dropdown-toggle"
            data-bs-toggle="collapse"
            href="#statsTab"
            role="button"
            aria-expanded="false"
            aria-controls="statsTab">
            more stats
          </a>
          <!-- when on a small device show this button -->
          <div class="ml-3 d-sm-block d-md-none btn-group">
            <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#addOffering">
              <b>+</b> Add Offering
            </button>
          </div>
        </div>
        <div class="collapse" id="statsTab">
          <div class="card card-body outline-0">
            <OfferingStats msg="offering stats" />
          </div>
        </div>
      </div>
      <span class="mt-4">
        <p><span class="mt-4 badge badge-pill badge-secondary">{{ foundOfferings }}</span> entries</p>
      </span>
      <table class="mt-4 table table-responsive-sm table-borderless">
        <thead>
          <tr>
            <th>
              <label class="anvil-checkbox">all
                <input type="checkbox" :value="true" v-model="all_members" />
                <span class="anvil-checkmark"></span>
              </label>
            </th>
            <td></td>
            <th>
              <div class="dropdown">
                <a class="p-0 font-weight-bold btn btn-white border-0 dropdown-toggle"
                  href="#"
                  role="button"
                  id="dropdownMenuLink"
                  data-bs-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false">
                  Date
                </a>
                <div class="p-2 dropdown-menu border-0 shadow">
                  <div class="p-2 form-group d-flex justify-content-between">
                    <label class="mr-2">From</label>
                    <input type="date" class="col-9 form-control" v-model="from_date" />
                  </div>
                  <div class="p-2 form-group d-flex justify-content-between">
                    <label class="mr-2">To</label>
                    <input type="date" class="col-9 form-control" v-model="to_date" />
                  </div>
                  <div class="p-2 d-flex justify-content-end">
                    <button class="btn btn-sm btn-success" :disabled="!(from_date && to_date)" @click="filterOfferings()">
                      Filter
                    </button>
                  </div>
                </div>
              </div>
            </th>
            <th>Name</th>
            <th>Amount</th>
            <th>Method</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="data in offerings.response" :key="data.id">
            <td>
              <label class="anvil-checkbox">
                <input multiple type="checkbox" :value="data.id" v-model="member_ids" />
                <span class="anvil-checkmark"></span>
              </label>
            </td>
            <td>
              <h6>
                <span v-if="!data.notified"
                  class="badge badge-danger"
                  style="height: 5px; width: 5px"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="member has not been notified">
                  <span style="visibility: hidden">.</span>
                </span>
                <span v-if="data.notified"
                  class="badge badge-success"
                  style="height: 5px; width: 5px"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="member has been notified">
                  <span style="visibility: hidden">.</span>
                </span>
              </h6>
            </td>
            <td>{{ $humanizeDate(data.date) }}</td>
            <td v-if="data.member">
              <router-link :to="`/memberDetail/${data.user_id}`">
                <span class="text-secondary">{{ data.member_full_name }}</span>
              </router-link>
            </td>
            <td v-if="data.service">{{ data.service_type_name }} ({{ data.service_date }})</td>
            <td v-if="data.group">
              <router-link :to="`/groupDetail/${data.group_id}`" class="text-muted">
                <div>{{ data.group_name }}</div>
              </router-link>
            </td>
            <td v-if="!data.group && !data.service && !data.member && data.name_if_not_member">
              {{ data.name_if_not_member }} <small>({{ data.phone_if_not_member }})</small>
            </td>
            <td><p class="text-secondary">{{ humanize(data.amount) }}</p></td>
            <td>{{ data.mode_of_payment_name }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- add offering modal -->
    <div class="modal fade" :id="`addOffering-${offering_type.id}`" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title text-capitalize">add {{ offering_type.name }}</h5>
            <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form>
              <CustomSelect
                :fields="['member', 'service', 'group']"
                @inputChanged="onInputChanged"
                @memberSelected="onMemberSelected"
                @serviceFound="onServiceFound"
                @groupSelected="onGroupSelected"
              />
              <div class="row form-group">
                <label class="col-3"><b>Amount:</b></label>
                <input type="number" class="col-3 form-control" v-model="offering_amount" />
                <div v-if="offering_amount > 0" class="col-6 text-success">
                  <h3>KSh {{ humanize(offering_amount) }}</h3>
                </div>
              </div>
              <div class="row form-group">
                <label class="col-3"><b>Payment method</b></label>
                <select class="col-5 form-control custom-select" v-model="payment_method">
                  <option v-for="method in payment_methods" :key="method.id" :value="method.id">
                    {{ method.name }}
                  </option>
                </select>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-success" @click="addOffering()">
              <b>+</b> add {{ offering_type.name }}
              <span v-if="adding_offering" class="spinner-border spinner-border-sm" role="status"></span>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import { ref, watch, computed, onMounted, defineComponent } from 'vue';
import customselect from '@/subcomponents/finances/select.vue';
import offeringstats from '@/subcomponents/statistics/offeringstats.vue';
import { useStore } from 'vuex';
import { useRoute } from 'vue-router';
import axios from 'axios';

export default defineComponent({
  name: 'offerings',
  components: { customselect, offeringstats },
  props: {
    reload_data: null,
    offering_type: null,
    payment_methods: null,
    hide_content: null
  },
  setup(props, { emit }) {
    const store = useStore();
    const route = useRoute();

    const reload_data = ref(null);
    const non_member = ref(false);
    const group = ref(false);

    const from_date = ref(null);
    const to_date = ref(null);
    const offering_stats = ref(null);
    const offering_types = ref(null);
    const selected_offering_type = ref(null);
    const offerings = ref(null);

    const adding_offering = ref(false);
    const offering_amount = ref(null);
    const name_if_not_member = ref('');
    const payment_method = ref(null);
    const country_code = ref('+254');
    const phone_number = ref('');
    const offering_narration = ref('');
    const offering_year = ref('');
    const offering_month = ref('');
    const offering_day = ref('');
    const offering_date = ref('');
    const phone_number_errors = ref([]);
    const phone_number_OK = ref([]);
    const searched_for_service = ref(false);
    const found_service = ref([]);
    const offering_amount_errors = ref([]);
    const selected_member_errors = ref([]);
    const name_if_not_member_errors = ref([]);
    const offering_date_errors = ref([]);
    const service_type_errors = ref([]);
    const added_offering = ref([]);
    const service_type = ref(null);
    const service_types = ref(null);

    const offering_from = ref('');
    const csv_date = ref('');
    const exporting_data = ref(false);

    const all_members = ref(false);
    const member_ids = ref([]);
    const all_member_ids = ref([]);

    const show_date = ref(true);
    const service = ref(null);

    const humanize = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    const onMemberSelected = (value) => {
      non_member.value = false;
      show_date.value = true;
      selected_offering_type.value = value;
    };

    const onServiceFound = (found_service_data) => {
      non_member.value = true;
      show_date.value = false;
      offering_date.value = found_service_data[0].date;
      found_service.value = found_service_data;
      service_type.value = found_service_data[0].type.id;
    };

    const onInputChanged = () => {
      selected_offering_type.value = null;
      group.value = null;
      service.value = null;
    };

    const onGroupSelected = (selected_group) => {
      show_date.value = true;
      non_member.value = true;
      group.value = selected_group;
    };

    const emitToParent = () => {
      emit('membersSelected', member_ids.value);
    };

    const getOfferingTypes = () => {
      axios.get(`${store.state.BASE_URL}/api/finance/offering-types/`)
        .then(response => {
          offering_types.value = response.data;
        });
    };

    const filterOfferings = () => {
      localStorage.removeItem('offering_list_version');
      getOfferings();
    };

    const getOfferings = () => {
      axios.get(`${store.state.BASE_URL}/api/finance/offering-stats/${props.offering_type.id}/`)
        .then(response => {
          offering_stats.value = { response: response.data };
        })
        .catch(err => {
          console.error(err);
        });

      offerings.value = JSON.parse(localStorage.getItem('offering_list'));
      if (offerings.value) {
        if (props.offering_type) {
          const offering_type_id = props.offering_type.id;
          offerings.value.response = offerings.value.response.filter(offering => offering.type === offering_type_id);
        }
        all_member_ids.value = offerings.value.response.map(offering => offering.id);
      }

      const currentVersion = store.getters.offering_list_version;
      const version = localStorage.getItem('offering_list_version');

      if (!version || version < currentVersion) {
        all_members.value = false;
        member_ids.value = [];
        all_member_ids.value = [];

        const params = from_date.value && to_date.value ? { from_date: from_date.value, to_date: to_date.value } : {};

        store.dispatch('update_isLoading', true);

        axios.get(`${store.state.BASE_URL}/api/finance/offerings-by-members-this-month/`, { params })
          .then(response => {
            offerings.value = { response: response.data };
            localStorage.setItem('offering_list', JSON.stringify({ response: response.data }));
            localStorage.setItem('offering_list_version', currentVersion);
            store.dispatch('update_isLoading', false);
            if (props.offering_type) {
              const offering_type_id = props.offering_type.id;
              offerings.value.response = offerings.value.response.filter(offering => offering.type === offering_type_id);
            }
            all_member_ids.value = offerings.value.response.map(offering => offering.id);
          })
          .catch(err => {
            console.error(err);
            store.dispatch('update_isLoading', false);
          });
      }
    };

    const addOfferingFormOK = () => {
      offering_amount_errors.value = [];
      selected_member_errors.value = [];
      offering_date_errors.value = [];
      name_if_not_member_errors.value = [];

      if (!offering_narration.value.length) {
        offering_narration.value = 'none given';
      }

      if (!offering_amount.value || offering_amount.value < 1) {
        offering_amount_errors.value.push('Enter an amount');
        return false;
      }

      if (!non_member.value && !selected_offering_type.value) {
        alert('Select a member, none selected');
        return false;
      }

      if (!non_member.value && !offering_date.value.length) {
        offering_date_errors.value.push('Date input required');
        return false;
      }

      return true;
    };

    const addOffering = () => {
      if (addOfferingFormOK()) {
        adding_offering.value = true;
        const url = non_member.value ?
          `${store.state.BASE_URL}/api/finance/add-service-offering/` :
          `${store.state.BASE_URL}/api/finance/add-offering/`;

        const data = non_member.value ? {
          service_type_id: service_type.value,
          type: props.offering_type.id,
          group: group.value,
          mode_of_payment: payment_method.value,
          recording_member_id: store.state.session.member_id,
          date: offering_date.value,
          narration: offering_narration.value,
          amount: offering_amount.value
        } : {
          member: selected_offering_type.value,
          recorded_by: store.state.session.member_id,
          name_if_not_member: name_if_not_member.value,
          type: props.offering_type.id,
          date: offering_date.value,
          mode_of_payment: payment_method.value,
          anonymous: false,
          narration: offering_narration.value,
          amount: offering_amount.value
        };

        axios.post(url, data)
          .then(response => {
            if (!non_member.value) added_offering.value.push(response.data);
            adding_offering.value = false;
            offering_amount.value = null;
            offering_narration.value = null;
            payment_method.value = null;
            name_if_not_member.value = '';
            offering_date.value = '';
            const new_version = parseInt(localStorage.getItem('offering_list_version')) + 1;
            store.dispatch('update_offering_list_version', new_version);
            getOfferings();
            alert(`${props.offering_type.name} successfully added`);
          })
          .catch(err => {
            alert(err);
            adding_offering.value = false;
          });
      }
    };

    onMounted(() => {
      getOfferings();
    });

    return {
      reload_data,
      non_member,
      group,
      from_date,
      to_date,
      offering_stats,
      offering_types,
      selected_offering_type,
      offerings,
      adding_offering,
      offering_amount,
      name_if_not_member,
      payment_method,
      country_code,
      phone_number,
      offering_narration,
      offering_year,
      offering_month,
      offering_day,
      offering_date,
      phone_number_errors,
      phone_number_OK,
      searched_for_service,
      found_service,
      offering_amount_errors,
      selected_member_errors,
      name_if_not_member_errors,
      offering_date_errors,
      service_type_errors,
      added_offering,
      service_type,
      service_types,
      offering_from,
      csv_date,
      exporting_data,
      all_members,
      member_ids,
      all_member_ids,
      show_date,
      service,
      humanize,
      onMemberSelected,
      onServiceFound,
      onInputChanged,
      onGroupSelected,
      emitToParent,
      getOfferingTypes,
      filterOfferings,
      getOfferings,
      addOfferingFormOK,
      addOffering
    };
  }
});</script>

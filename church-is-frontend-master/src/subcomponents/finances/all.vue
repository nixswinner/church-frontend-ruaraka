



<!-- updated vue 3 code -->


<!-- Parent.vue -->
<template>
    <div>
        <!-- TITHES CONTENT -->
        <div v-if="!hide_content">
            <!-- main content-->
            <content>
                <span class="mt-4">
                    <p><span class="mt-4 badge badge-pill badge-secondary">{{ foundTithesAndOfferings }}</span> entries</p>
                </span>
                <table class="mt-5 table table-responsive-sm table-borderless">
                    <thead>
                        <tr>
                            <th>
                                <label class="anvil-checkbox">All
                                    <input type="checkbox" :value="true" v-model="all_members">
                                    <span class="anvil-checkmark"></span>
                                </label>
                            </th>
                            <th></th>
                            <th>
                                <div class="dropdown">
                                    <a class="p-0 font-weight-bold btn btn-whte border-0 dropdown-toggle" href="#" role="button" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        Date
                                    </a>

                                    <div class="p-2 dropdown-menu border-0 shadow">
                                        <div class="p-2 form-group d-flex justify-content-between">
                                            <label class="mr-2">From</label>
                                            <input type="date" name="bday" max="3000-12-31"
                                            min="1000-01-01" class="col-9 form-control" v-model="from_date">
                                        </div>
                                        <div class="p-2 form-group d-flex justify-content-between">
                                            <label class="mr-2">To</label>
                                            <input type="date" name="bday" max="3000-12-31"
                                            min="1000-01-01" class="col-9 form-control" v-model="to_date">
                                        </div>
                                        <div class="p-2 d-flex justify-content-end">
                                            <button class="btn btn-sm btn-success"
                                                :disabled="!(from_date && to_date)"
                                                @click="filterTithesAndOfferings">
                                                Filter
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </th>
                            <th>Name</th>
                            <th>Amount</th>
                            <th>Type</th>
                            <th>Method</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="data in tithes_and_offerings.response" :key="data.id">
                            <td>
                                <label class="anvil-checkbox">
                                    <input multiple type="checkbox"
                                        :value="{ type: data.type_name, id: data.id }"
                                        v-model="envelope_ids">
                                    <span class="anvil-checkmark"></span>
                                </label>
                            </td>
                            <td>
                                <h6>
                                    <span class="badge badge-danger" style="height: 5px; width: 5px" v-if="!data.notified"
                                        data-bs-toggle="tooltip" data-bs-placement="top" title="member has not been notified">
                                        <span style="visibility: hidden">.</span>
                                    </span>
                                    <span class="badge badge-success" style="height: 5px; width: 5px" v-if="data.notified"
                                        data-bs-toggle="tooltip" data-bs-placement="top" title="member has been notified">
                                        <span style="visibility: hidden">.</span>
                                    </span>
                                </h6>
                            </td>
                            <td>{{ $humanizeDate(data.date) }}</td>
                            <td v-if="data.member">
                                <router-link :to="`/memberDetail/` + data.user_id">
                                    <span class="text-secondary">{{ data.member_full_name }}</span>
                                </router-link>
                            </td>
                            <td v-if="data.service">{{ data.service_type_name }} ({{ data.service_date }})</td>
                            <td v-if="data.group">
                                <router-link :to="`/groupDetail/` + data.group_id" class="text-muted">
                                    <div>
                                        {{ data.group_name }}
                                    </div>
                                </router-link>
                            </td>
                            <td v-if="!data.group && !data.service && !data.member && data.name_if_not_member">
                                {{ data.name_if_not_member }} <small>({{ data.phone_if_not_member }})</small>
                            </td>
                            <td><p class="text-secondary">{{ humanize(data.amount) }}</p></td>
                            <td>{{ data.type_name }}</td>
                            <td>{{ data.mode_of_payment_name }}</td>
                        </tr>
                    </tbody>
                </table>
            </content>
        </div>
    </div>
</template>


<script>
import tithestats from '@/subcomponents/statistics/tithestats.vue'
import customselect from '@/subcomponents/finances/select.vue'
import { ref, watch, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useSession } from 'vue-session'

export default {
    name: 'about',
    components: { tithestats, customselect },
    props: {
        payment_methods: null,
        reload_data: null,
        hide_content: null
    },
    setup(props, { emit }) {
        const store = useStore()
        const session = useSession()

        const reload_data = ref(null)
        const access_level = ref(session.get('access_level'))
        const foundTithesAndOfferings = ref(null)

        // Fetch data
        const from_date = ref(null)
        const to_date = ref(null)
        const tithe_stats = ref(null)
        const tithes_and_offerings = ref(null)
        const fetch_data_error = ref([])

        // Selected Member
        const selectedMember = ref(null)

        // Adding tithe
        const adding_tithe = ref(false)
        const add_tithe_button_text = ref('+ add tithe')
        const enable_add_tithe_button = ref(true)
        const tithe_amount = ref(null)
        const tithe_date = ref(null)
        const payment_method = ref(null)
        const tithe_narration = ref('')
        const tithe_amount_error = ref([])
        const tithe_member_error = ref([])
        const added_tithe = ref([])
        const add_tithe_errors = ref([])

        // Exporting data
        const csv_date = ref('')
        const exporting_data = ref(false)

        // Member IDs
        const all_members = ref(false)
        const envelope_ids = ref([])
        const all_envelope_ids = ref([])

        // Sending message
        const sms_status = ref([])
        const sending_message = ref(false)

        // Additional fields
        const not_member = ref(false)
        const group = ref(null)
        const service = ref(null)

        // Watchers
        watch(() => props.reload_data, (newValue) => {
            if (newValue === true) {
                getTitheAndOfferings()
            }
        })

        watch(all_members, (newValue) => {
            if (!newValue) {
                envelope_ids.value = []
            } else {
                envelope_ids.value = [...all_envelope_ids.value]
            }
        })

        watch(envelope_ids, () => {
            emitToParent()
        })

        // Methods
        const emitToParent = () => {
            emit('membersSelected', envelope_ids.value)
        }

        const humanize = (x) => {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        }

        const onMemberSelected = (value) => {
            selectedMember.value = value
        }

        const onInputChanged = () => {
            selectedMember.value = null
            group.value = null
            service.value = null
        }

        const onServiceFound = (found_service) => {
            service.value = found_service[0].type.id
        }

        const onGroupSelected = (selectedGroup) => {
            group.value = selectedGroup
        }

        const filterTithesAndOfferings = () => {
            getTitheAndOfferings()
        }

        const getTitheAndOfferings = () => {
            all_members.value = false
            envelope_ids.value = []
            all_envelope_ids.value = []
            fetch_data_error.value = []
            store.dispatch('update_isLoading', true)

            let params = {}
            if (from_date.value && to_date.value) {
                params = { from_date: from_date.value, to_date: to_date.value }
            }

            store.dispatch('update_isLoading', true)

            fetch(`${import.meta.env.VUE_APP_BASE_URL}/api/finance/tithes-and-offerings/`, {
                method: 'GET',
                params
            })
                .then(response => response.json())
                .then(data => {
                    tithes_and_offerings.value = { response: data }
                    let array = tithes_and_offerings.value.response
                    for (let item of array) {
                        all_envelope_ids.value.push({
                            "type": item.type_name,
                            "id": item.id
                        })
                    }
                    emitToParent()
                    foundTithesAndOfferings.value = array.length
                    store.dispatch('update_isLoading', false)
                })
                .catch(err => {
                    fetch_data_error.value.push(err)
                    store.dispatch('update_isLoading', false)
                })
        }

        onMounted(() => {
            getTitheAndOfferings()
        })

        return {
            reload_data,
            access_level,
            foundTithesAndOfferings,
            from_date,
            to_date,
            tithe_stats,
            tithes_and_offerings,
            fetch_data_error,
            selectedMember,
            adding_tithe,
            add_tithe_button_text,
            enable_add_tithe_button,
            tithe_amount,
            tithe_date,
            payment_method,
            tithe_narration,
            tithe_amount_error,
            tithe_member_error,
            added_tithe,
            add_tithe_errors,
            csv_date,
            exporting_data,
            all_members,
            envelope_ids,
            all_envelope_ids,
            sms_status,
            sending_message,
            not_member,
            group,
            service,
            emitToParent,
            humanize,
            onMemberSelected,
            onInputChanged,
            onServiceFound,
            onGroupSelected,
            filterTithesAndOfferings,
            getTitheAndOfferings
        }
    }
}
</script>


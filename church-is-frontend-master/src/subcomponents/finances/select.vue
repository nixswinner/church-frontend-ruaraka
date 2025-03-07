
<!-- updated vue3 code -->

<!-- Child.vue -->
<template>
    <div class="d-flex d-flex-column">
        <div class="anvil-select row form-group">
                <select class="col-4 custom-select border-0 shadow-0 font-weight-bold"
                        v-model="selected_input"
                        style="outline: none;
                               box-shadow:none !important;">
                        <option value="member_input" v-if="fields.includes('member')" selected>member</option>
                        <option value="group_input" v-if="fields.includes('group')">group</option>
                        <option value="service_input" v-if="fields.includes('service')">service</option>
                        <option value="none_member_input" v-if="fields.includes('non_member')">non member</option>
                </select>

                <div class="col-8 height-smooth">
                    <!-- member -->
                    <SearchMember v-if="selected_input === 'member_input'" @memberSelected="onMemberSelected" />
                    <!-- groups -->
                    <select v-if="selected_input === 'group_input'" class="ml-4 col-12 form-control" v-model="selected_group">
                            <option v-for="data in groups.response" :key="data.id" :value="data.id">{{ data.name }}</option>
                    </select>
                    <!-- service                  -->
                    <div v-if="selected_input === 'service_input'">
                            <select class="ml-3 form-control" v-model="service_type">
                                    <option v-for="data in service_types.response" :key="data.id" :value="data.id">{{ data.name }}</option>
                            </select>
                            <label class="ml-4 mt-3">date</label>
                            <div class="ml-3 input-group form-group" style="padding: 0px">
                                <input type="date" name="bday" max="3000-12-31"
                                       min="1000-01-01" class="form-control" v-model="date">
                            </div>
                            <span v-if="searching_for_service">
                                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> searching ...
                            </span>
                            <p v-if="found_service.length">
                                <ul v-if="found_service.length > 0">
                                    <small><li><p class="text-success"> found a service on that date, proceed</p></li></small>
                                </ul>
                            </p>
                            <p v-if="found_service.length === 0 && searched_for_service">
                                <ul>
                                    <small>
                                        <li>
                                            <p class="text-danger"> NO service found on that date</p>
                                            <p>select the date when you had the service</p>
                                        </li>
                                    </small>
                                </ul>
                            </p>
                    </div>
                    <!-- non-member -->
                    <div class="row form-group" v-if="selected_input === 'none_member_input'">
                            <input type="text" class="form-control" placeholder="enter name" v-model="name_if_not_member">
                    </div>
                    <div class="row form-group" v-if="selected_input === 'none_member_input'">
                            <div class="">
                                    <div class="row">
                                            <span class="col-4">
                                                    <label>code :</label>
                                                    <input class="form-control" type="text" placeholder="+254" v-model="country_code">
                                            </span>
                                            <span class="col-8">
                                                    <label>phone number :</label>
                                                    <input type="text" class="form-control" placeholder="712345678" v-model="phone_number">
                                            </span>
                                            <div style="padding: 5px">
                                            <p v-if="phone_number_errors.length">
                                                <ul>
                                                    <small><li v-for="error in phone_number_errors" :key="error"><p class="text-danger">{{ error }}</p></li></small>
                                                </ul>
                                            </p>
                                            <p v-if="phone_number_OK.length">
                                                <ul>
                                                    <small><li v-for="ok in phone_number_OK" :key="ok"><p class="text-success">{{ ok }}</p></li></small>
                                                </ul>
                                            </p>
                                            </div>
                                    </div>
                            </div>
                    </div>
                </div>
        </div>
    </div>
</template>

<script>
import { ref, watch, onMounted } from 'vue';
import searchmember from '@/subcomponents/searchmember.vue';

export default {
    name: 'textmessage',
    components: { searchmember },
    props: {
        fields: null
    },
    setup(props, { emit }) {
        const selected_input = ref("member_input");
        const selectedMember = ref(null);
        const selected_group = ref(null);
        const groups = ref(null);
        const service_type = ref(null);
        const service_types = ref(null);
        const found_service = ref([]);
        const searching_for_service = ref(false);
        const searched_for_service = ref(false);
        const date = ref('');
        const offering_date_errors = ref([]);
        const service_type_errors = ref([]);
        const name_if_not_member = ref('');
        const phone_number = ref('');
        const phone_number_errors = ref([]);
        const phone_number_OK = ref([]);
        const fetch_data_error = ref([]);

        const emitToParent = (event, data) => {
            emit(event, data);
        };

        const onMemberSelected = (value) => {
            selectedMember.value = value;
            emitToParent('memberSelected', selectedMember.value);
        };

        const getGroups = () => {
            fetch(`${import.meta.env.VITE_BASE_URL}/api/groups/church-group-list/`)
                .then(response => response.json())
                .then(data => {
                    groups.value = { response: data };
                })
                .catch(err => {
                    fetch_data_error.value.push(err);
                });
        };

        const getServiceTypes = () => {
            fetch(`${import.meta.env.VITE_BASE_URL}/api/services/service-types/`)
                .then(response => response.json())
                .then(data => {
                    service_types.value = { response: data };
                })
                .catch(() => {
                    found_service.value = [];
                });
        };

        const checkForService = () => {
            searching_for_service.value = true;
            fetch(`${import.meta.env.VITE_BASE_URL}/api/services/service-on-date/${date.value}/of-type/${service_type.value}/`)
                .then(response => response.json())
                .then(data => {
                    found_service.value = data;
                    emitToParent('serviceFound', found_service.value);
                    searched_for_service.value = true;
                    searching_for_service.value = false;
                })
                .catch(err => {
                    fetch_data_error.value.push(err);
                    searching_for_service.value = false;
                });
        };

        watch(selected_group, () => {
            emitToParent("groupSelected", selected_group.value);
        });

        watch(selected_input, () => {
            emitToParent("inputChanged", selected_input.value);
        });

        watch(date, () => {
            searched_for_service.value = false;
            found_service.value = [];
            service_type_errors.value = [];
            if (service_type.value == null) {
                service_type_errors.value.push("select a type of service");
                return;
            }
            checkForService();
        });

        watch(service_type, () => {
            searched_for_service.value = false;
            found_service.value = [];
            if (date.value.length > 0) {
                if (date.value == null) {
                    return;
                }
                checkForService();
            }
        });

        onMounted(() => {
            getGroups();
            getServiceTypes();
        });

        return {
            selected_input,
            selectedMember,
            selected_group,
            groups,
            service_type,
            service_types,
            found_service,
            searching_for_service,
            searched_for_service,
            date,
            offering_date_errors,
            service_type_errors,
            name_if_not_member,
            phone_number,
            phone_number_errors,
            phone_number_OK,
            fetch_data_error,
            emitToParent,
            onMemberSelected,
            getGroups,
            getServiceTypes,
            checkForService
        };
    }
};
</script>

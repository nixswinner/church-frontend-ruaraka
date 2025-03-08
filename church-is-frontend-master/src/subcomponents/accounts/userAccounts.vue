<!-- updated vue 3 code -->

<!-- Child.vue -->
<template>
    <div class="row">
        <!-- this component requires text message modal -->
        <TextMessage :memberIds="member_in_focus"/>
        <div v-if="admins" class="col-sm-12 col-lg-9">
            <h3 class="font-weight-bold mb-5">user accounts</h3>
            <table class="table table-responsive-sm table-borderless">
                <thead>
                  <tr>
                    <th scope="col">name</th>
                    <th scope="col">role</th>
                    <th scope="col">description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="admin in admins" :key="admin.user_id" class="text-muted">
                    <td>{{ admin.member_full_name }}</td>
                    <td>{{ admin.role_name }}</td>
                    <td>{{ admin.role_description }}</td>
                    <td v-if="access_level == 0">
                        <div class="btn-group">
                            <a href="#" style="text-decoration: none">
                                <div class="text-success">
                                    actions
                                </div>
                            </a>
                            <button type="button" class="ml-1 btn btn-light dropdown-toggle dropdown-toggle-split" id="dropdownMenuReference" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span class="sr-only">Toggle Dropdown</span>
                            </button>
                            <div class="dropdown-menu border-success" aria-labelledby="dropdownMenuReference">
                                <a class="dropdown-item d-flex flex-column justify-content-center"
                                    href="#" data-bs-toggle="modal"
                                    data-bs-target="#textModalCenter"
                                    @click="member_in_focus = [admin.user_id]">
                                    send 'made admin' message
                                    <small class="text-muted">send message to user to inform them<br/>
                                        that they are now admin in the site
                                    </small>
                                </a>
                                <a class="dropdown-item d-flex flex-column justify-content-center"
                                    href="#" data-bs-toggle="modal"
                                    data-bs-target="#textModalCenter"
                                    @click="member_in_focus = [admin.user_id]">
                                    send password reset message
                                    <small class="text-muted">send message to user to inform them<br/>
                                         that their password has been reset
                                    </small>
                                </a>
                                <a class="dropdown-item d-flex flex-column justify-content-center"
                                    href="#"
                                    data-bs-toggle="modal"
                                    data-bs-target="#resetPasswordModal"
                                    @click="member_in_focus = [admin.user_id]">
                                    reset user's password
                                    <small class="text-muted">this will reset user password back <br/>
                                            to starter password 'changeMe'<br/>
                                            only use this feature when a user has lost their password
                                    </small>
                                </a>
                            </div>
                        </div>
                    </td>
                  </tr>
                </tbody>
              </table>
        </div>
        <div class="col-sm-12 col-lg-3">
            <div class="btn-group">
                <a href="#" data-bs-toggle="modal" data-bs-target="#addUserModal" style="text-decoration: none">
                    <div class="add-button">
                        + add user
                    </div>
                </a>
                <button type="button" class="btn btn-success dropdown-toggle dropdown-toggle-split" id="dropdownMenuReference" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span class="sr-only">Toggle Dropdown</span>
                </button>
                <div class="dropdown-menu border-success" aria-labelledby="dropdownMenuReference">
                    <a class="dropdown-item"
                        href="#" data-bs-toggle="modal"
                        data-bs-target="#addRoleModal">
                        + add role
                    </a>
                    <a class="dropdown-item"
                        href="#" data-bs-toggle="modal"
                        data-bs-target="#manageRolesModal">
                        manage roles
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import searchmember from '@/subcomponents/searchmember.vue'
import textmessage from '@/subcomponents/textmessage.vue'
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import axios from 'axios'

export default {
    name: 'userAccounts',
    components: { searchmember, textmessage },
    setup() {
        const store = useStore()

        const access_level = ref(sessionStorage.getItem('access_level'))
        const member_in_focus = ref([])
        const test = ref(false)
        const updated_roles = ref({})
        const updated_permision_levels = ref({})
        const roles = ref(null)
        const admins = ref(null)
        const selected_member = ref(null)

        // Add role
        const adding = ref(false)
        const role_name = ref(null)
        const role_description = ref(null)
        const permission_level = ref(null)
        const updating_role_id = ref(null)

        // Assign role to member
        const selected_role = ref(null)

        const BASE_URL = import.meta.env.VITE_BASE_URL

        const getRoles = () => {
            store.dispatch('update_isLoading', true)
            axios.get(`${BASE_URL}/api/members/role-list/`)
                .then((response) => {
                    roles.value = response.data
                    store.dispatch('update_isLoading', false)
                })
                .catch((err) => {
                    alert(err)
                    store.dispatch('update_isLoading', false)
                })
        }

        const getMembersWithAdminRoles = () => {
            store.dispatch('update_isLoading', true)
            axios.get(`${BASE_URL}/api/members/members-with-admin-roles/`, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                }
            }).then((response) => {
                admins.value = response.data
                store.dispatch('update_isLoading', false)
            }).catch((err) => {
                alert(err)
                store.dispatch('update_isLoading', false)
            })
        }

        const addRole = () => {
            adding.value = true
            axios.post(`${BASE_URL}/api/members/role-list/`, {
                role: role_name.value,
                description: role_description.value,
                permission_level: permission_level.value
            }).then(() => {
                adding.value = false
                role_name.value = ''
                role_description.value = ''
                getRoles()
                alert("role successfully added")
            }).catch((err) => {
                adding.value = false
                alert(err)
            })
        }

        const assignRoles = () => {
            adding.value = true
            axios.post(`${BASE_URL}/api/members/add-role-for-member/`, {
                member: selected_member.value,
                role: selected_role.value
            }).then(() => {
                selected_role.value = null
                adding.value = false
                getMembersWithAdminRoles()
                alert("admin user added")
            }).catch((err) => {
                alert(err)
                adding.value = false
            })
        }

        const updateRole = (role_id) => {
            updating_role_id.value = role_id
            adding.value = true
            let data = {}

            if (updated_permision_levels.value[role_id] != null) {
                data.permission_level = updated_permision_levels.value[role_id]
            }
            if (updated_roles.value[role_id] != null) {
                data.is_group_role = updated_roles.value[role_id]
            }
            if (updated_permision_levels.value[role_id] != null && updated_roles.value[role_id] != null) {
                data = {
                    permission_level: updated_permision_levels.value[role_id],
                    is_group_role: updated_roles.value[role_id]
                }
            }

            data.role_id = role_id

            axios.patch(`${BASE_URL}/api/members/role-list/`, data)
                .then(() => {
                    adding.value = false
                    alert('update successful')
                    getRoles()
                })
                .catch((err) => {
                    adding.value = false
                    alert(err)
                })
        }

        const resetPassword = (user_id) => {
            adding.value = true
            axios.post(`${BASE_URL}/api/members/reset-password/`, { user_id }, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                }
            }).then(() => {
                alert("password for user reset to starter password 'ChangeMe'")
                adding.value = false
            }).catch((err) => {
                alert(err)
                adding.value = false
            })
        }

        onMounted(() => {
            getRoles()
            getMembersWithAdminRoles()
        })

        return {
            access_level,
            member_in_focus,
            test,
            updated_roles,
            updated_permision_levels,
            roles,
            admins,
            selected_member,
            adding,
            role_name,
            role_description,
            permission_level,
            updating_role_id,
            selected_role,
            getRoles,
            getMembersWithAdminRoles,
            addRole,
            assignRoles,
            updateRole,
            resetPassword
        }
    }
}
</script>

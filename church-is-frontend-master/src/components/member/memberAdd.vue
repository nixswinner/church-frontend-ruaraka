

<!-- updated vue3 code -->

<template>
    <div class="memberAdd">
        <nav aria-label="breadcrumb" class="continer">
            <ol class="breadcrumb">
                <li class="breadcrumb-item">
                    <span class="backButton">
                        <router-link style="text-decoration: none" :to="{ name: 'Home' }">Home</router-link>
                    </span>
                </li>
                <li class="breadcrumb-item">
                    <span class="backButton">
                        <router-link style="text-decoration: none" :to="{ name: 'memberList' }">members</router-link>
                    </span>
                </li>
                <li class="breadcrumb-item active" aria-current="page">add member</li>
            </ol>
        </nav>
        <div class="continer">
            <div class="row">
                <div class="col-12 col-sm-12 col-lg-8">
                    <div v-if="add_member_error.length > 0" role="alert">
                        <!-- if no connection -->
                        <div class="col">
                            <img style="height: 64px" src="@/assets/icons/icons8-wi-fi-off-64.png" />
                            <p class="text-info">check your connection</p>
                        </div>
                        <div>
                            <strong>add member will not work without a connection !</strong>
                            <p>check your connection and try again.</p>
                            <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    </div>

                    <!-- PERSONAL DETAILS -->
                    <section class="mx-auto col-lg-8 col-sm-12" v-if="form_in_view === 'personal_detail_form'">
                        <!-- first_name last name and surname -->
                        <div class="ml-0 mb-3">
                            <h2 class="text-muted">Personal detail</h2>
                        </div>
                        <div v-if="!added_member.length">
                            <div class="row">
                                <div class="col">
                                    <div class="mb-3 form-group">
                                        <input type="text" class="form-control" placeholder="First Name" v-model="first_name" autofocus />
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
                                        <input type="text" class="form-control" placeholder="Middle Name" v-model="middle_name" />
                                    </div>
                                    <div class="form-group">
                                        <input type="text" class="form-control" placeholder="Last Name" v-model="last_name" />
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
                                </div>
                            </div>

                            <!-- gender -->
                            <div>
                                <div class="row">
                                    <div class="checkbox col">
                                        <div class="radio">
                                            <label><input type="radio" value="M" v-model="gender" /> Male</label>
                                        </div>
                                        <div class="radio">
                                            <label><input type="radio" value="F" v-model="gender" /> Female</label>
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
                                </div>
                            </div>
                        </div>
                        <div v-else class="d-flex">
                            <span class="p-2">{{ added_member[0].member.first_name }} {{ added_member[0].member.last_name }}</span>
                            <button class="ml-4 btn btn-outline-success" @click="resetForm()">Add New</button>
                        </div>
                    </section>

                    <!-- MEMBER CONTACT -->
                    <section class="mb-5 mx-auto col-lg-8 col-sm-12" v-if="form_in_view === 'personal_detail_form'">
                        <hr />
                        <div class="ml-0 mb-3">
                            <h2 class="text-muted">Contact</h2>
                        </div>
                        <div v-if="!added_contact">
                            <div class="row">
                                <div class="col">
                                    <div class="form-group">
                                        <label><b>email :</b></label>
                                        <input type="email" class="form-control" placeholder="example@gmail.com" v-model="email" />
                                    </div>
                                    <div class="form-group">
                                        <div class="row">
                                            <span class="col-12">
                                                <label><b>phone number :</b></label>
                                                <input type="text" class="form-control" placeholder="0712345678" v-model="phone_number" />
                                            </span>
                                        </div>
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
                                                    <li v-for="error in phone_number_OK" :key="error">
                                                        <p class="text-success">{{ error }}</p>
                                                    </li>
                                                </small>
                                            </ul>
                                        </p>
                                    </div>
                                    <div class="form-group">
                                        <label><b>postal address :</b></label>
                                        <input type="text" class="form-control" placeholder="123-456" v-model="postal_address" />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div v-if="added_contact">
                            <p>email: <span class="text-muted">{{ added_contact.member.member.email }}</span></p>
                            <p>phone number: <span class="text-muted">{{ added_contact.member.phone_number }}</span></p>
                        </div>
                    </section>

                    <!-- MEMBER AGE -->
                    <section class="mb-5 mx-auto col-lg-8 col-sm-12" v-if="form_in_view === 'personal_detail_form'">
                        <hr />
                        <div class="ml-0 mb-3">
                            <h2 class="text-muted">Age</h2>
                        </div>
                        <div v-if="!added_age" class="row">
                            <div class="col">
                                <div class="form-group">
                                    <label><b>date of birth :</b></label>
                                    <input type="date" name="bday" max="3000-12-31" min="1000-01-01" class="form-control" v-model="d_o_b" />
                                </div>
                            </div>
                        </div>
                        <div v-if="added_age">
                            <p>date of birth: <span class="text-muted">{{ added_age.d_o_b }}</span></p>
                        </div>
                    </section>

                    <!-- Other sections remain unchanged -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'memberAdd',
  data() {
    return {
      //add button text
      add_button_text: "+ Add Member",
      //select form in view
      form_in_view: 'personal_detail_form',
      //contact
      email: '',
      country_code: '',
      contact: ' ',
      postal_address: '',
      phone_number: '',
      phone_number_errors: [],
      phone_number_OK: [],
      added_contact: null,
      //names and gender
      first_name: '',
      first_name_errors: [],
      last_name: '',
      last_name_errors: [],
      middle_name: null,
      gender: '',
      gender_errors: [],
      added_member: [],
      add_member_error: [],
      added_member_id: null,
      //date of birth
      d_o_b: '',
      added_age: null,
      //residence
      home_town: '',
      road: '',
      street: '',
      estate: '',
      description: '',
      added_residence: null,
      //marital status
      marital_status: '',
      added_marital_status: null,
      //add member
      adding_member_detail: false,
      //add member to group.
      groups: null,
      group_ids: [],
      groups_added_into: []
    }
  },
  created() {
    this.getGroups()
  },
  watch: {
    phone_number(newVal) {
      this.phone_number_errors = []
      this.phone_number_OK = []
      if (isNaN(newVal)) {
        this.phone_number_errors.push("Phone number should be numbers only")
      }
      if (newVal.length > 10) {
        this.phone_number_errors.push("Number too long")
      }
      if (newVal.length < 10) {
        this.phone_number_errors.push("Number too short")
      }
      if (newVal.length === 10) {
        this.phone_number_OK.push("Number OK")
      }
    },
    day(newVal) {
      if (this.month === 0) {
        this.date_errors = []
        this.date_errors.push("Input month first")
      }
      if (newVal > 0 && newVal > 30) {
        this.date_errors = []
        this.date_errors.push("Day must be between 1 & 30")
      }
    },
    month(newVal) {
      if (this.year === 0) {
        this.date_errors = []
        this.date_errors.push("Input year first")
      }
      if (newVal > 0 && newVal > 12) {
        this.month
      }
    },
    year() {}
  },
  computed: {
    folders() {
      return this.groupBy(this.groups?.response || [], 'group')
    }
  },
  methods: {
    resetForm() {
      this.added_contact = null
      this.added_member = []
      this.add_member_error = []
      this.added_member_id = null
      this.added_age = null
      this.added_residence = null
      this.added_marital_status = null
      this.adding_member_detail = false
      this.add_button_text = "+ Add Member"
    },
    addMember() {
      if (!this.added_member.length) {
        this.first_name_errors = []
        this.last_name_errors = []
        this.gender_errors = []

        if (!this.first_name) {
          this.first_name_errors.push('You must enter the first name')
          alert('You must enter the first name')
          return
        }
        if (this.first_name.split(' ').length > 1) {
          this.first_name_errors.push('First name must be one word only')
          alert('First name must be one word only')
          return
        }
        if (!this.last_name) {
          this.last_name_errors.push('You must enter a last name')
          alert('You must enter a last name')
          return
        }
        if (this.last_name.split(' ').length > 1) {
          this.last_name_errors.push('Last name must be one word only')
          alert('Last name must be one word only')
          return
        }
        if (!this.gender) {
          this.gender_errors.push('Select gender')
          alert('Select gender')
          return
        }

        this.added_contact = null
        this.added_age = null
        this.added_marital_status = null
        this.added_residence = null
        this.adding_member_detail = true
        this.groups_added_into = []

        axios.post(this.$BASE_URL + '/api/members/add-member/', {
          first_name: this.first_name,
          middle_name: this.middle_name,
          last_name: this.last_name,
          gender: this.gender,
          email: this.email
        }).then(response => {
          this.added_member.push(response.data)
          this.added_member_id = this.added_member[0].member.id
          this.addOtherDetails()

          var new_version = parseInt(localStorage.getItem('member_list_version')) + 1
          this.$store.dispatch('update_member_list_version', new_version)
          alert("Member added successfully")

          this.gender_male = false
          this.gender_female = false
          this.last_name = ''
          this.first_name = ''
          this.adding_member_detail = false
          this.add_button_text = "Update Details"
        }).catch(err => {
          this.add_member_error.push(err)
        })
      } else {
        this.addOtherDetails()
      }
    },
    addContact() {
      if (this.phone_number_OK.length > 0) {
        this.adding_member_detail = true
        axios.post(this.$BASE_URL + '/api/members/add-member-contact/', {
          member_id: this.added_member_id,
          postal_address: this.postal_address,
          phone: this.phone_number,
          contact: this.contact
        }).then(response => {
          this.added_contact = response.data
          this.adding_member_detail = false
          this.email = ''
          this.country_code = ''
          this.contact = ''
          this.postal_address = ''
          this.phone_number = ''
          this.phone_number_errors = []
          this.phone_number_OK = []
          alert("Contact added")
        }).catch(err => {
          alert(err)
          this.adding_member_detail = false
        })
      }
    },
    addDateOfBirth() {
      if (this.d_o_b.length > 0) {
        this.adding_member_detail = true
        axios.post(this.$BASE_URL + '/api/members/add-member-d_o_b/', {
          member_id: this.added_member_id,
          d_o_b: this.d_o_b
        }).then(response => {
          this.added_age = response.data
          this.adding_member_detail = false
          this.d_o_b = ''
          alert("Date of birth added")
        }).catch(err => {
          alert(err)
          this.adding_member_detail = false
        })
      }
    },
    addMaritalStatus() {
      if (this.marital_status.length > 0) {
        this.adding_member_detail = true
        axios.post(this.$BASE_URL + '/api/members/add-member-marital-status/', {
          member_id: this.added_member_id,
          status: this.marital_status
        }).then(response => {
          this.added_marital_status = response.data
          this.adding_member_detail = false
          this.marital_status = ''
          alert("Marital status added")
        }).catch(err => {
          alert(err)
          this.adding_member_detail = false
        })
      }
    },
    addResidence() {
      if (this.home_town.length > 0 || this.road.length > 0 || this.street.length > 0 || this.estate.length > 0 || this.description > 0) {
        axios.post(this.$BASE_URL + '/api/members/add-member-residence/', {
          member_id: this.added_member_id,
          town: this.home_town,
          road: this.road,
          street: this.street,
          description: this.description
        }).then(response => {
          this.added_residence = response.data
          alert("Residence added")
        }).catch(err => {
          alert(err)
        })
      }
    },
    addOtherDetails() {
      this.addContact()
      this.addDateOfBirth()
      this.addMaritalStatus()
      this.addResidence()
    },
    groupBy(array, key) {
      return array.reduce((result, item) => {
        (result[item[key]] = result[item[key]] || []).push(item)
        return result
      }, {})
    },
    getGroups() {
      axios.get(this.$BASE_URL + '/api/groups/church-group-list/')
        .then(response => {
          this.groups = { "response": response.data }
        })
        .catch(err => {
          console.error(err)
        })
    }
  }
}
</script>

<style>
</style>

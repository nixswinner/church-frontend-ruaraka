//updated vue 3 code


<template>
    <div>
        <nav aria-label="breadcrumb" class="continer">
            <ol class="breadcrumb">
                <li class="breadcrumb-item">
                    <span class="backButton">
                        <router-link style="text-decoration: none" :to="{name: 'Home'}">
                            Home
                        </router-link>
                    </span>
                </li>
                <li class="breadcrumb-item active" aria-current="page">church account</li>
            </ol>
        </nav>
        <!-- MAIN container -->
        <section class="continer">
            <div class="row">
                <div class="mb-5 col-sm-12 col-lg-3">
                    <!-- spacer div -->
                    <nav class="nav flex-column nav-pills" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                        <a
                            class="nav-link active list-group-item list-group-item-action border-0"
                            id="pill-detail-tab"
                            data-toggle="pill" href="#pill-dashboard" role="tab"
                            aria-controls="pill-dashboard" aria-selected="true">
                            <img class="church-is-menu" src="@/assets/icons/icons8-group-of-projects-filled-50.png">
                            dashboard
                        </a>
                        <a
                            class="nav-link list-group-item list-group-item-action border-0"
                            id="pill-user-accounts-tab" data-toggle="pill"
                            href="#pill-user-accounts" role="tab" aria-controls="pill-user-accounts"
                            aria-selected="false" @click="getPermissionGroups">
                            <img class="church-is-menu" src="@/assets/icons/icons8-contacts-208.png">
                            user accounts
                        </a>
                    </nav>
                </div>
                <!-- content div -->
                <div
                    class="tab-content col-sm-12 col-lg-9"
                    id="v-pills-tabContent"
                    v-if="client_detail_available">
                    <!-- DASHBOARD -->
                    <section
                        class="tab-pane fade show active"
                        id="pill-dashboard" role="tabpanel" aria-labelledby="pill-dashboard-tab">
                        <section class="row">
                            <div class="col-lg-6 col-sm-12">
                                <h3 class="font-weight-bold">{{ client_details[0].client.name }}</h3>
                                <h6 class="card-subtitle text-muted mb-2">
                                    church code
                                    <span class="badge badge-light text-info">
                                        <h5>{{ client_details[0].church_code }}</h5></span>
                                </h6>
                            </div>
                            <div class="col-lg-6 col-sm-12">
                                <button disabled type="button" class="btn btn-success">
                                    SMS credit
                                </button>
                                <p>mpesa paybill :
                                    <i v-if="sms_credentials.length" class="text-muted">{{ sms_credentials[0].at_mpesa_paybill }}</i>
                                </p>
                                <p>mpesa account number :
                                    <i v-if="sms_credentials.length" class="text-muted">{{ sms_credentials[0].at_mpesa_acc_no }}</i>
                                </p>
                            </div>
                        </section>
                        <!-- numbers in boxes -->
                        <section class="d-flex justify-content-center">
                            <div class="row col text-left mt-2">
                                <div class="mb-2 ml-3 text-center text-muted col-lg-2 col-sm-12 border border-secondary rounded">
                                    <h1 class="font-weight-bold">{{ client_details[0].number_of_members }}</h1>
                                    members
                                </div>
                                <div class="mb-2 ml-3 text-center text-muted col-lg-2 col-sm-12 border border-secondary rounded">
                                    <h1 class="font-weight-bold">{{ client_details[0].number_of_sms }}</h1>
                                    sms delivered this month
                                </div>
                                <div class="mb-2 ml-3 text-center text-muted col-lg-2 col-sm-12 border border-secondary rounded">
                                    <h1 class="font-weight-bold">{{ client_details[0].site_visitors.this_month }}</h1>
                                    website visits this month<br />
                                    <i>{{ client_details[0].site_visitors.last_month }} last month</i>
                                </div>
                            </div>
                        </section>

                        <!-- church statements -->
                        <section class="mt-5">
                            <h3 class="font-weight-bold text-muted">Website Management</h3>
                            <a :href="`http://` + client_details[0].domain_url" target="_blank">
                                {{ client_details[0].domain_url }}
                            </a>
                            <!-- church-statements -->
                            <section class="mt-5">
                                <h4>church statements</h4>
                                <h6>mission statement</h6>
                                <article class="text-muted">
                                    <textarea v-if="church_statements.length"
                                              rows="3" class="form-control mb-2" v-model="mission_statement">
                                    </textarea>
                                    <h5 class="text-muted text-center" v-if="!church_statements.length">
                                        <p>Oops!</p>
                                        <p>You have not added your church's mission statement</p>
                                        <button class="btn btn-outline-success" data-toggle="modal" data-target="#addVisionAndMisionStatement">
                                            + add mission statement
                                            <span v-if="updating"
                                                  class="spinner-border spinner-border-sm" role="status" aria-hidden="true">
                                            </span>
                                        </button>
                                    </h5>
                                    <div class="text-right" v-if="church_statements.length">
                                        <button class="btn btn-outline-success" v-on:click="editChurchStatements()">
                                            save
                                            <span v-if="updating"
                                                  class="spinner-border spinner-border-sm" role="status" aria-hidden="true">
                                            </span>
                                        </button>
                                    </div>
                                </article>

                                <h6>vision statement</h6>
                                <article class="border border-light text-muted">
                                    <textarea v-if="church_statements.length"
                                              rows="3" class="form-control mb-2" v-model="vision_statement">
                                    </textarea>
                                    <h5 class="text-muted text-center" v-else>
                                        <p>Oops!</p>
                                        <p>You have not added your church's vision statement</p>
                                        <button class="btn btn-outline-success" data-toggle="modal" data-target="#addVisionAndMisionStatement">
                                            + add vision statement
                                            <span v-if="updating"
                                                  class="spinner-border spinner-border-sm" role="status" aria-hidden="true">
                                            </span>
                                        </button>
                                    </h5>
                                    <div class="text-right" v-if="church_statements.length">
                                        <button class="btn btn-outline-success" v-on:click="editChurchStatements()">
                                            save
                                            <span v-if="updating"
                                                  class="spinner-border spinner-border-sm" role="status" aria-hidden="true">
                                            </span>
                                        </button>
                                    </div>
                                </article>
                            </section>
                            <!-- church about -->
                            <section>
                                <h4>About church</h4>
                                <article class="text-muted">
                                    <textarea v-if="church_about.length"
                                              rows="3" class="form-control mb-2" v-model="about_church">
                                    </textarea>
                                    <div class="text-right" v-if="church_about.length">
                                        <button class="btn btn-outline-success" v-on:click="editAbout()">
                                            save
                                            <span v-if="updating_about"
                                                  class="spinner-border spinner-border-sm" role="status" aria-hidden="true">
                                            </span>
                                        </button>
                                    </div>
                                    <h5 class="text-muted text-center" v-if="!church_about.length">
                                        <p>Oops!</p>
                                        <p>You have not added an about for your church</p>
                                        <button class="btn btn-outline-success" data-toggle="modal" data-target="#addChurchAbout">
                                            + add
                                            <span v-if="updating"
                                                  class="spinner-border spinner-border-sm" role="status" aria-hidden="true">
                                            </span>
                                        </button>
                                    </h5>
                                </article>
                            </section>
                            <!-- church core values -->
                            <section>
                                <h4>church core values</h4>
                                <article>
                                    <p v-if="church_core_values.length">
                                        <ul class="list-group list-group-flush text-muted">
                                            <li class="list-group-item" v-for="value in church_core_values" :key="value.id">
                                                {{ value.value }}
                                            </li>
                                        </ul>
                                    </p>
                                    <div class="text-right" v-if="church_core_values.length">
                                        <button class="btn btn-outline-success" data-toggle="modal" data-target="#addChurchCoreValue">
                                            + add
                                            <span v-if="updating"
                                                  class="spinner-border spinner-border-sm" role="status" aria-hidden="true">
                                            </span>
                                        </button>
                                    </div>
                                    <h5 class="text-muted text-center" v-if="!church_core_values.length">
                                        <p>Oops!</p>
                                        <p>You have not added your church's core values</p>
                                        <button class="btn btn-outline-success" data-toggle="modal" data-target="#addChurchCoreValue">
                                            + add
                                            <span v-if="updating"
                                                  class="spinner-border spinner-border-sm" role="status" aria-hidden="true">
                                            </span>
                                        </button>
                                    </h5>
                                </article>
                            </section>
                            <!-- church periodic theme -->
                            <section>
                                <h4>church periodic themes</h4>
                                <article>
                                    <p v-if="church_periodic_themes.length">
                                        <ul class="list-group list-group-flush text-muted">
                                            <li class="list-group-item" v-for="theme in church_periodic_themes" :key="theme.id">
                                                {{ theme.theme }}
                                                <p>start: {{ theme.start }} and end: {{ theme.end }}</p>
                                            </li>
                                        </ul>
                                    </p>
                                    <div class="text-right" v-if="church_periodic_themes.length">
                                        <button class="btn btn-outline-success" data-toggle="modal" data-target="#addThemeModal">
                                            + add
                                            <span v-if="updating"
                                                  class="spinner-border spinner-border-sm" role="status" aria-hidden="true">
                                            </span>
                                        </button>
                                    </div>
                                    <h5 class="text-muted text-center" v-if="!church_periodic_themes.length">
                                        <p>Oops!</p>
                                        <p>You have not added your church's Periodic Theme</p>
                                        <button class="btn btn-outline-success" data-toggle="modal" data-target="#addThemeModal">
                                            + add theme
                                            <span v-if="updating"
                                                  class="spinner-border spinner-border-sm" role="status" aria-hidden="true">
                                            </span>
                                        </button>
                                    </h5>
                                </article>
                            </section>
                        </section>
                    </section>

                    <!-- USER ACCOUNTS -->
                    <section
                        class="tab-pane fade"
                        id="pill-user-accounts" role="tabpanel" aria-labelledby="pill-user-accounts-tab">
                        <userAccounts />
                    </section>
                </div>
            </div>
        </section>
        <!-- MODALS container -->
        <section>
            <!-- mission and vision statements modal -->
            <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog"
                aria-labelledby="addVisionAndMisionStatement" aria-hidden="true"
                id="addVisionAndMisionStatement">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Add Mission and vision statement</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="form-group">
                                <label for="missionStatementsTextArea">Mission statement</label>
                                <textarea class="form-control"
                                          v-model="mission_statement"
                                          id="missionStatementsTextArea"
                                          rows="3"></textarea>
                            </div>
                            <div class="form-group">
                                <label for="visionStatementsTextArea">Vision statement</label>
                                <textarea class="form-control"
                                          v-model="vision_statement"
                                          id="visionStatementsTextArea"
                                          rows="3"></textarea>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-outline-success" v-on:click="addMissionAndVisionStatements()">
                                + add statements
                                <span v-if="adding_web_content"
                                      class="spinner-border spinner-border-sm" role="status" aria-hidden="true">
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- add church about modal -->
            <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog"
                 aria-labelledby="addChurchAbout" aria-hidden="true"
                 id="addChurchAbout">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Add about church</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="form-group">
                                <label for="aboutChurchTextArea">About church</label>
                                <textarea class="form-control"
                                          v-model="about_church"
                                          id="aboutChurchTextArea"
                                          rows="3"></textarea>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-outline-success" v-on:click="addAboutChurch()">
                                + add about
                                <span v-if="adding_web_content"
                                      class="spinner-border spinner-border-sm" role="status" aria-hidden="true">
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- add core value modal -->
            <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog"
                 aria-labelledby="addChurchCoreValue" aria-hidden="true"
                 id="addChurchCoreValue">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Add church core value</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="form-group">
                                <label for="coreValueInput">Value</label>
                                <input autofocus class="form-control" type="text" maxlength="20" v-model="core_value" id="coreValueInput">
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-outline-success" v-on:click="addCoreValue()">
                                + add value
                                <span v-if="adding_web_content"
                                      class="spinner-border spinner-border-sm" role="status" aria-hidden="true">
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <!-- add theme modal -->
            <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog"
                 aria-labelledby="addThemeModal" aria-hidden="true"
                 id="addThemeModal">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Add church theme</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="form-group">
                                <label class="font-weight-bold">Theme:</label>
                                <textarea class="form-control"
                                          v-model="theme"
                                          id="themeTextArea"
                                          rows="3"></textarea>
                                <label class="font-weight-bold">Description:</label>
                                <textarea class="form-control"
                                          v-model="description"
                                          id="descriptionTextArea"
                                          rows="3"></textarea>
                                <div class="row">
                                    <div class="col-6">
                                        <label class="font-weight-bold">Starts:</label>
                                        <input class="form-control" type="date" v-model="start">
                                    </div>
                                    <div class="col-6">
                                        <label class="font-weight-bold">Ends:</label>
                                        <input class="form-control" type="date" v-model="end">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-outline-success" v-on:click="addTheme()">
                                + add theme
                                <span v-if="adding_web_content"
                                      class="spinner-border spinner-border-sm" role="status" aria-hidden="true">
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>





<script>
import { defineComponent, ref, onMounted } from 'vue';
import axios from 'axios'; // Ensure Axios is used if not globally set
import userAccounts from '@/subcomponents/accounts/userAccounts';

export default defineComponent({
  name: 'myAccount',
  components: { userAccounts },
  setup() {
    const church_id = ref(localStorage.getItem('church_id'));
    const client_detail_available = ref(false);
    const client_details = ref(null);
    const church_about = ref(null);
    const church_statements = ref(null);
    const church_core_values = ref(null);
    const church_periodic_themes = ref(null);
    const adding_web_content = ref(false);
    const mission_statement = ref(null);
    const vision_statement = ref(null);
    const about_church = ref(null);
    const core_value = ref(null);
    const theme = ref(null);
    const description = ref(null);
    const start = ref(null);
    const end = ref(null);
    const updating = ref(false);
    const updating_about = ref(false);
    const sms_credentials = ref([]);

    const BASE_URL = 'YOUR_BASE_URL_HERE'; // Ensure this is set

    const getClientDetail = async () => {
      client_detail_available.value = true;
      try {
        const response = await axios.get(`${BASE_URL}/api/clients/client-detail/${church_id.value}/`);
        client_details.value = response.data;
      } catch (error) {
        console.error('Error fetching client details:', error);
      }
    };

    const getChurchSMSCredentials = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/clients/church-sms-credentials/${church_id.value}/`);
        sms_credentials.value = response.data;
      } catch (error) {
        console.error('Error fetching SMS credentials:', error);
      }
    };

    const getChurchStatements = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/clients/church-statements/${church_id.value}/`);
        church_statements.value = response.data;
        mission_statement.value = response.data[0]?.mission || '';
        vision_statement.value = response.data[0]?.vision || '';
      } catch (error) {
        console.error('Error fetching church statements:', error);
      }
    };

    const getChurchCoreValues = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/clients/church-core-values/${church_id.value}/`);
        church_core_values.value = response.data;
      } catch (error) {
        console.error('Error fetching core values:', error);
      }
    };

    const getChurchPeriodicTheme = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/clients/church-periodic-themes/${church_id.value}/`);
        church_periodic_themes.value = response.data;
      } catch (error) {
        console.error('Error fetching periodic themes:', error);
      }
    };

    const getChurchAbout = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/clients/church-about/${church_id.value}/`);
        church_about.value = response.data;
        about_church.value = response.data[0]?.about || '';
      } catch (error) {
        console.error('Error fetching church about:', error);
      }
    };

    const addMissionAndVisionStatements = async () => {
      adding_web_content.value = true;
      try {
        await axios.post(`${BASE_URL}/api/clients/add-church-mission-and-vision-statements/`, {
          church_id: church_id.value,
          mission: mission_statement.value,
          vision: vision_statement.value
        });
        getChurchStatements();
        alert('Church statements added successfully');
      } catch (error) {
        alert('Error: ' + error + ' Make sure you have filled both fields');
      } finally {
        adding_web_content.value = false;
      }
    };

    const addAboutChurch = async () => {
      adding_web_content.value = true;
      try {
        await axios.post(`${BASE_URL}/api/clients/add-church-about/`, {
          church_id: church_id.value,
          about: about_church.value
        });
        getChurchAbout();
        about_church.value = null;
        alert('About church was successfully added');
      } catch (error) {
        alert('Error: ' + error);
      } finally {
        adding_web_content.value = false;
      }
    };

    const addCoreValue = async () => {
      adding_web_content.value = true;
      try {
        await axios.post(`${BASE_URL}/api/clients/add-church-core-value/`, {
          church_id: church_id.value,
          value: core_value.value
        });
        getChurchCoreValues();
        core_value.value = null;
        alert('Value successfully added');
      } catch (error) {
        alert('Error: ' + error);
      } finally {
        adding_web_content.value = false;
      }
    };

    const addTheme = async () => {
      adding_web_content.value = true;
      try {
        await axios.post(`${BASE_URL}/api/clients/add-theme/`, {
          church_id: church_id.value,
          theme: theme.value,
          description: description.value,
          start: start.value,
          end: end.value
        });
        getChurchPeriodicTheme();
        theme.value = description.value = start.value = end.value = null;
        alert('Theme successfully added');
      } catch (error) {
        alert('Error: ' + error + ' Make sure to fill all fields');
      } finally {
        adding_web_content.value = false;
      }
    };

    const editChurchStatements = async () => {
      updating.value = true;
      try {
        await axios.patch(`${BASE_URL}/api/clients/update-church-statements/`, {
          church_id: church_id.value,
          mission: mission_statement.value,
          vision: vision_statement.value
        });
        getChurchStatements();
      } catch (error) {
        alert('Error: ' + error);
      } finally {
        updating.value = false;
      }
    };

    const editAbout = async () => {
      updating_about.value = true;
      try {
        await axios.patch(`${BASE_URL}/api/clients/update-about-church/`, {
          church_id: church_id.value,
          about: about_church.value
        });
        getChurchAbout();
      } catch (error) {
        alert('Error: ' + error);
      } finally {
        updating_about.value = false;
      }
    };

    // Run on component mount
    onMounted(() => {
      getClientDetail();
      getChurchSMSCredentials();
      getChurchStatements();
      getChurchCoreValues();
      getChurchPeriodicTheme();
      getChurchAbout();
    });

    return {
      church_id,
      client_detail_available,
      client_details,
      church_about,
      church_statements,
      church_core_values,
      church_periodic_themes,
      adding_web_content,
      mission_statement,
      vision_statement,
      about_church,
      core_value,
      theme,
      description,
      start,
      end,
      updating,
      updating_about,
      sms_credentials,
      getClientDetail,
      getChurchSMSCredentials,
      getChurchStatements,
      getChurchCoreValues,
      getChurchPeriodicTheme,
      getChurchAbout,
      addMissionAndVisionStatements,
      addAboutChurch,
      addCoreValue,
      addTheme,
      editChurchStatements,
      editAbout
    };
  }
});
</script>


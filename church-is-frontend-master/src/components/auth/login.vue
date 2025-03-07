<!-- <template>
  <div>
    <div class="continer">
        <div class="d-flex justify-content-center">
          <div  class="card w-400 border-0"
                style="background-color: ghostwhite; height: 80vh; min-width: 300px;">

            <div class="card-header text-center border-0">
              <img class="mr-0 " style="width: 50px ;height: auto" src="@/assets/app_logo1.png"
                  v-if="$host_name == 'my-domain' || $host_name == 'anvilchurch'">
              <img class="ml-4 " style="width: 60px ;height: auto ;border-radius: 5px" src="@/assets/methodist_logo.jpeg" alt="logo not found"
                    v-if="$host_name == 'methodistkenya' " >
              <p>admin login</p>
            </div>
            <div class="card-body">

              <form>
                <div>
                  <ul v-if="login_error.length">

                    <li v-for="error in login_error">
                      <small class="text-danger">{{ error }}</small>
                    </li>
                  </ul>

                  <ul v-if="login_info.length">
                    <li v-for="error in login_info" class="text-info">
                      <small>{{ error }}</small>
                    </li>
                  </ul>

                </div>
                <div class="form-group">
                  <label for="exampleInputEmail1">church code</label>
                  <input @keyup.enter="getToken()"
                         type="number" class="form-control"
                         placeholder="000" v-model="church_code">
                </div>
                <div class="form-group">
                  <label for="exampleInputEmail1">username</label>
                  <input @keyup.enter="getToken()"
                         type="text" class="form-control"
                         id="exampleInputEmail1" aria-describedby="emailHelp"
                         placeholder="Enter username" v-model="username">
                </div>
                <div class="form-group">
                  <label for="exampleInputPassword1">Password</label>
                  <input @keyup.enter="getToken()"
                         type="password" class="form-control"
                         id="exampleInputPassword1" placeholder="Password"
                         v-model="password">
                </div>
                <a  href=#
                    v-on:click="getToken()"
                    style="text-decoration: none">
                  <div class="mt-5 add-button">
                    <span>login</span>
                  </div>
                </a>
              </form>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
  import router from "../../router";
  export default {
    name: 'login',
    data() {
      return {
        church_code: null,
        church_code_set : false,
        username: null,
        password: null,
        login_error: [],
        login_info: []

      }
    },
    created(){
      this.church_code =  localStorage.getItem('church_id')
      this.church_code = this.church_code.padStart(3, '0')
      if (this.church_code != 'null'){
        this.church_code_set = true
      }
    },
    watch: {
      church_code:function(){
        this.login_info = []
        this.login_error = []
        if (this.church_code.toString().length == 3){
          var church_id = parseInt(this.church_code)
          this.$http.get(this.$DOMAIN.value + '/api/clients/client/' + church_id + '/')
            .then(response => {
              var data = response.data
              this.$BASE_URL.value = "https://"+ data[0].domain_url //+ ":8000"
              localStorage.setItem('base_url_value',this.$BASE_URL.value)
              localStorage.setItem('church_id', church_id )
              localStorage.setItem('church_details',JSON.stringify(response.data))
            })
            .catch((err) => {
              this.login_error.push("church code not set or invalid")
            })
        }
      }
    },
    methods: {
      //get access token
      getToken: function () {
        this.login_info = []
        this.login_error = []
        this.login_info.push("authenticating...")
        this.$http({
          method: 'post',
          url: this.$BASE_URL + '/api/token/',
          data: {
            username: this.username,
            password: this.password
          }
        }).then(response => {
            this.login_info = []
            this.login_error = []
            this.$session.start();
            this.$session.set('token', response.data.access)
            this.$session.set('username', this.username)
            //get logged in member data
            this.getLoggedInMemberData()
            router.push('/')

        }).catch((err) => {
            this.login_info = []
            this.login_error = []
            if(! err.response){
              this.login_error.push(err)
            }
            else{
              this.login_error.push("invalid credentials")
            }

        })
      },
      //get logged in member info
      getLoggedInMemberData: function(){
        this.$http({
          method:'get',
          url:this.$BASE_URL + `/api/members/member/${this.$session.get('username')}/`
        }).then(response => {
            this.$session.set('member_id', response.data[0].member.id)
            this.getPermisionLevel(response.data[0].member.id)
        }).catch((err) => {
            this.fetch_data_error.push(err)
        })
      },
      //get logged in member permision level
      getPermisionLevel: function(member_id){
        this.$http({
          method:'get',
          url: this.$BASE_URL + `/api/members/get-permision-level/${member_id}/`
        }).then((response)=>{
            var response_data = response.data
            this.$session.set('access_level',response_data.level)
        }).catch((err)=>{
            alert(err)
        })
      }
    }
  }
</script>


<style>
</style> -->


//updated vue 3 code




<template>
  <div class="continer">
    <div class="d-flex justify-content-center">
      <div class="card w-400 border-0" style="background-color: ghostwhite; height: 80vh; min-width: 300px;">

        <!-- Logo Selection -->
        <div class="card-header text-center border-0">
          <img class="mr-0" style="width: 50px; height: auto" src="@/assets/app_logo1.png" v-if="hostName === 'my-domain' || hostName === 'anvilchurch'">
          <img class="ml-4" style="width: 60px; height: auto; border-radius: 5px" src="@/assets/methodist_logo.jpeg" v-if="hostName === 'methodistkenya'" alt="logo not found">
          <p>admin login</p>
        </div>

        <div class="card-body">
          <form @submit.prevent="getToken">
            <div>
              <ul v-if="loginError.length">
                <li v-for="error in loginError" :key="error">
                  <small class="text-danger">{{ error }}</small>
                </li>
              </ul>

              <ul v-if="loginInfo.length">
                <li v-for="info in loginInfo" :key="info" class="text-info">
                  <small>{{ info }}</small>
                </li>
              </ul>
            </div>

            <!-- Church Code -->
            <div class="form-group">
              <label for="churchCode">church code</label>
              <input
                id="churchCode"
                type="number"
                class="form-control"
                placeholder="000"
                v-model="churchCode"
                @keyup.enter="getToken"
              >
            </div>

            <!-- Username -->
            <div class="form-group">
              <label for="username">username</label>
              <input
                id="username"
                type="text"
                class="form-control"
                placeholder="Enter username"
                v-model="username"
                @keyup.enter="getToken"
              >
            </div>

            <!-- Password -->
            <div class="form-group">
              <label for="password">Password</label>
              <input
                id="password"
                type="password"
                class="form-control"
                placeholder="Password"
                v-model="password"
                @keyup.enter="getToken"
              >
            </div>

            <!-- Login Button -->
            <a href="#" @click="getToken" style="text-decoration: none">
              <div class="mt-5 add-button">
                <span>login</span>
              </div>
            </a>
          </form>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'Login',
  setup() {
    const router = useRouter();

    // State
    const churchCode = ref(localStorage.getItem('church_id') || '');
    const username = ref('');
    const password = ref('');
    const loginError = ref([]);
    const loginInfo = ref([]);
    const baseURL = ref('');

    // Computed host name (Replace this with actual dynamic logic if needed)
    const hostName = window.location.hostname;

    // Watch for church code changes
    watch(churchCode, async (newCode) => {
      loginError.value = [];
      loginInfo.value = [];

      if (newCode && newCode.toString().length === 3) {
        try {
          const response = await fetch(`https://your-api.com/api/clients/client/${parseInt(newCode)}/`);
          const data = await response.json();

          baseURL.value = `https://${data[0].domain_url}`;
          localStorage.setItem('base_url_value', baseURL.value);
          localStorage.setItem('church_id', newCode);
          localStorage.setItem('church_details', JSON.stringify(data));
        } catch (error) {
          loginError.value.push("church code not set or invalid");
        }
      }
    });

    // Login Function
    const getToken = async () => {
      loginError.value = [];
      loginInfo.value = ["authenticating..."];

      try {
        const response = await fetch(`${baseURL.value}/api/token/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: username.value, password: password.value })
        });

        if (!response.ok) throw new Error("invalid credentials");

        const data = await response.json();
        loginInfo.value = [];

        // Store session (replace with Vuex/Pinia if needed)
        localStorage.setItem('token', data.access);
        localStorage.setItem('username', username.value);

        // Fetch user details
        await getLoggedInMemberData();
        router.push('/');
      } catch (error) {
        loginInfo.value = [];
        loginError.value.push(error.message);
      }
    };

    // Fetch Logged-in Member Data
    const getLoggedInMemberData = async () => {
      try {
        const response = await fetch(`${baseURL.value}/api/members/member/${username.value}/`);
        const data = await response.json();

        localStorage.setItem('member_id', data[0].member.id);
        await getPermissionLevel(data[0].member.id);
      } catch (error) {
        loginError.value.push(error.message);
      }
    };

    // Get User Permission Level
    const getPermissionLevel = async (memberId) => {
      try {
        const response = await fetch(`${baseURL.value}/api/members/get-permission-level/${memberId}/`);
        const data = await response.json();

        localStorage.setItem('access_level', data.level);
      } catch (error) {
        alert(error);
      }
    };

    // Lifecycle Hook
    onMounted(() => {
      if (churchCode.value && churchCode.value !== 'null') {
        churchCode.value = churchCode.value.padStart(3, '0');
      }
    });

    return {
      churchCode,
      username,
      password,
      loginError,
      loginInfo,
      getToken,
      hostName
    };
  }
};
</script>

<style>
/* Add your styles here */
</style>


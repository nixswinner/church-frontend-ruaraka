<!-- updated vue 3 code -->
<!--  -->
<template>
  <div>
    <section class="navbar navbar-expand-lg navbar-light sticky-top bg-white" v-if="checkLoggedIn()">
      <button class="btn btn-light ml-3" type="button" @click="openNav()">
        <i class="fas fa-bars"></i>
      </button>
      <!-- select logo -->
      <img class="ml-4" style="width: 150px; height: auto" src="@/assets/text_logo.png" alt="logo not found"
           v-if="$host_name === 'my-domain' || $host_name === 'anvilchurch'">
      <img class="ml-4" style="width: 200px; height: auto; border-radius: 5px"
           src="@/assets/methodist_text_logo.png" alt="logo not found"
           v-if="$host_name === 'methodistkenya'">
      <div class="mt-2 col-sm-12 col-lg-8">
        <GeneralSearch />
      </div>
    </section>

    <nav>
      <div id="anvil-side-nav" class="sidenav shadow-lg bg-white rounded">
        <div class="row">
          <a href="javascript:void(0)" class="closebtn text-secondary" @click="closeNav()">&times;</a>
          <h3 class="ml-4 mr-2 d-flex flex-wrap font-weight-bold" id="church-name-heading">church</h3>
          <h5 class="ml-1 dropdown-item">{{ username }}</h5>
          <router-link class="ml-1 dropdown-item" :to="{ name: 'credentialsReset' }">
            <span @click="closeNav()">
              <i class="far fa-edit"></i> change credentials
            </span>
          </router-link>
          <a href="#" class="ml-1 dropdown-item" @click="logOut(); closeNav()">
            <i class="fas fa-sign-out-alt"></i> log out
          </a>
        </div>
        <hr>

        <!-- members nav on mobile -->
        <router-link class="nav-link" :to="{ name: 'memberList' }">
          <span @click="doAJAX(); closeNav()">
            <i class="text-dark far fa-user"></i> members
          </span>
        </router-link>

        <!-- groups side nav -->
        <router-link class="nav-link" :to="{ name: 'groupsLanding' }">
          <span @click="doAJAX(); closeNav()">
            <i class="text-dark fas fa-users"></i> groups
          </span>
        </router-link>

        <!-- events side nav -->
        <router-link class="nav-link" :to="{ name: 'events' }">
          <span @click="doAJAX(); closeNav()">
            <i class="text-dark fas fa-calendar-alt"></i> events
          </span>
        </router-link>

        <!-- finance side nav -->
        <router-link class="nav-link" :to="{ name: 'generalFinance' }">
          <span @click="doAJAX(); closeNav()">
            <i class="text-dark fas fa-money-bill-alt"></i> finances
          </span>
        </router-link>
        <hr>

        <!-- more side nav -->
        <router-link class="nav-link" :to="{ name: 'services' }">
          <span @click="doAJAX(); closeNav()">
            <i class="text-dark fas fa-church"></i> services
          </span>
        </router-link>
        <hr>

        <router-link class="nav-link" :to="{ name: 'smsAnalytics' }">
          <span @click="doAJAX(); closeNav()">
            <i class="text-dark fas fa-sms"></i> sms outbox
          </span>
        </router-link>

        <router-link class="nav-link" :to="{ name: 'news' }">
          <span @click="doAJAX(); closeNav()">
            <i class="text-dark far fa-newspaper"></i> news & announcements
          </span>
        </router-link>
        <hr>

        <router-link class="nav-link" :to="{ name: 'myAccount' }">
          <span @click="doAJAX(); closeNav()">
            <i class="text-dark fas fa-cogs"></i> account & website
          </span>
        </router-link>
        <hr>
      </div>
    </nav>

    <!-- nav frost overlay -->
    <div id="nav-frost-overlay" class="d-none nav-frost-overlay"></div>

    <!-- loader overlay -->
    <div class="vld-parent">
      <Loading :active="isLoading"
               :can-cancel="true"
               @cancel="onCancel"
               :is-full-page="fullPage">
      </Loading>
    </div>

    <!-- the entire app lives here -->
    <section id="main-app">
      <router-view />
    </section>
  </div>
</template>


<script>
import { ref, computed, onMounted, onBeforeMount } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Loading from "vue-loading-overlay";
import "vue-loading-overlay/dist/vue-loading.css";
import generalsearch from "@/subcomponents/generalsearch.vue";

export default {
  name: "App",
  components: {
    Loading,
    generalsearch,
  },
  setup() {
    const store = useStore();
    const router = useRouter();

    const fullPage = ref(true);
    const client_detail_available = ref(false);
    const church_detail = ref(JSON.parse(localStorage.getItem("church_details")));
    const anvil_side_nav = ref(null);
    const main_app = ref(null);
    const nav_frost_overlay = ref(null);

    onBeforeMount(() => {
      // Clear local storage except these
      const church_id = localStorage.getItem("church_id");
      const church_details = localStorage.getItem("church_details");
      const base_url_value = localStorage.getItem("base_url_value");
      const default_message = localStorage.getItem("default_message");

      localStorage.clear();

      if (church_id !== "null") {
        localStorage.setItem("church_id", church_id);
      }
      if (church_details !== "null") {
        localStorage.setItem("church_details", church_details);
      }
      if (base_url_value !== "null") {
        localStorage.setItem("base_url_value", base_url_value);
      }
      if (default_message !== "null") {
        localStorage.setItem("default_message", default_message);
      }

      if (!sessionStorage.getItem("token")) {
        router.push("/login");
      } else {
        store.dispatch("update_logged_in_member", sessionStorage.getItem("username"));
      }
    });

    onMounted(() => {
      anvil_side_nav.value = document.getElementById("anvil-side-nav");
      main_app.value = document.getElementById("main-app");
      nav_frost_overlay.value = document.getElementById("nav-frost-overlay");

      if (church_detail.value) {
        const church_name_heading = document.getElementById("church-name-heading");
        church_name_heading.innerHTML = church_detail.value[0].name;
      }
    });

    const username = computed({
      get: () => store.getters.logged_in_member,
      set: (value) => store.commit("logged_in_member", value),
    });

    const isLoading = computed({
      get: () => store.getters.isLoading,
      set: (value) => store.commit("isLoading", value),
    });

    const checkLoggedIn = () => {
      if (!sessionStorage.getItem("token")) {
        router.push("/login");
        return false;
      }
      store.dispatch("update_logged_in_member", sessionStorage.getItem("username"));
      return true;
    };

    const logOut = () => {
      sessionStorage.clear();
      router.push("/login");
    };

    const onCancel = () => {
      console.log("User cancelled the loader.");
    };

    const doAJAX = () => {
      isLoading.value = true;
    };

    const openNav = () => {
      anvil_side_nav.value.style.width = "300px";
      main_app.value.style.marginLeft = "100px";
      nav_frost_overlay.value.classList.add("bg-frost");
      nav_frost_overlay.value.classList.remove("d-none");
    };

    const closeNav = () => {
      anvil_side_nav.value.style.width = "0";
      main_app.value.style.marginLeft = "0";
      nav_frost_overlay.value.classList.remove("bg-frost");
      nav_frost_overlay.value.classList.add("d-none");
    };

    return {
      fullPage,
      client_detail_available,
      church_detail,
      username,
      isLoading,
      anvil_side_nav,
      main_app,
      nav_frost_overlay,
      checkLoggedIn,
      logOut,
      onCancel,
      doAJAX,
      openNav,
      closeNav,
    };
  },
};
</script>

<style lang="scss">
@import "./assets/styles/church-is.scss";
@import "../node_modules/bootstrap/scss/bootstrap.scss";
</style>

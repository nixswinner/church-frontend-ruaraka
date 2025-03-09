<template>
  <div id="app" class="bg-blue">
    <section v-if="isLoggedIn" class="navbar navbar-expand-lg navbar-light sticky-top bg-white">
      <img class="ml-4" style="width: 150px; height: auto" src="./assets/text_logo.png"
           alt="logo not found"
           v-if="['my-domain', 'anvilchurch'].includes(hostName)"/>
    </section>

    <router-view/>
  </div>
</template>


<script>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import store from "@/store";

export default {
  setup() {
    const router = useRouter();
    const isLoggedIn = ref(!!localStorage.getItem("access_token"));
    const hostName = computed(() => store.getters.host_name);
    const churchDetail = ref([]);

    const logout = () => {
      // Retain only essential items
      Object.keys(localStorage).forEach((key) => {
        if (!["church_id", "church_details", "base_url_value", "default_message"].includes(key)) {
          localStorage.removeItem(key);
        }
      });

      router.push("/");
      isLoggedIn.value = false;
    };

    onMounted(() => {
      const storedDetails = localStorage.getItem("church_details");
      churchDetail.value = storedDetails ? JSON.parse(storedDetails) : [];

      if (churchDetail.value?.length > 0) {
        const churchNameHeading = document.getElementById("church-name-heading");
        if (churchNameHeading) {
          churchNameHeading.innerHTML = churchDetail.value[0].name;
        }
      }
    });

    return {
      isLoggedIn,
      hostName,
      churchDetail,
      logout
    };
  }
};
</script>

<style lang="scss">
@import "../node_modules/bootstrap/scss/bootstrap.scss";
</style>


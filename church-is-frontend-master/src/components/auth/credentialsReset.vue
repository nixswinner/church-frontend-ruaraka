<!-- updated vue 3 code -->

<template>
    <div>
        <div class="container">
            <div class="d-flex justify-content-center">
                <div class="card w-400 border-0"
                     style="background-color: ghostwhite; height: 80vh; min-width: 300px;">
                    <div class="card-header text-center border-0">
                        <img class="mr-0 " style="width: 50px; height: auto" src="@/assets/app_logo1.png"
                            v-if="$host_name === 'my-domain' || $host_name === 'anvilchurch'">
                        <img class="ml-4 " style="width: 100px; height: auto; border-radius: 5px" src="@/assets/methodist_logo.jpeg" alt="logo not found"
                            v-if="$host_name === 'methodistkenya'">
                        <small class="d-flex justify-content-center">change credentials for</small>
                        <p>
                            {{ username }}
                        </p>
                    </div>
                    <div class="card-body">
                        <div class="d-flex justify-content-center text-muted">
                            <small id="change_password_button"
                                @click="changing_password = true"
                                style="cursor: pointer">
                                change password
                            </small>
                            <span class="ml-2 mr-2">|</span>
                            <small id="change_username_button"
                                @click="changing_password = false"
                                class="text-primary"
                                style="cursor: pointer">
                                change username
                            </small>
                        </div>
                        <!-- if changing password -->
                        <form v-if="changing_password">
                            <div class="mt-4 mb-5 form-group">
                                <label for="oldPassword">Old password</label>
                                <input
                                    type="password" class="form-control"
                                    placeholder="your old password"
                                    v-model="password">
                            </div>
                            <div class="form-group">
                                <label for="newPassword">New password</label>
                                <input
                                    type="password" class="form-control"
                                    placeholder="your new password"
                                    v-model="new_password">
                                <!-- password errors-->
                                <ul v-if="password_errors.length">
                                    <li v-for="error in password_errors" :key="error" class="text-danger">
                                        <small>{{ error }}</small>
                                    </li>
                                </ul>
                            </div>
                            <div class="form-group">
                                <label for="confirmPassword">Confirm new password</label>
                                <input
                                    type="password" class="form-control"
                                    placeholder="confirm new password"
                                    v-model="new_password_confirmation">
                            </div>
                            <button v-if="username_errors.length === 0
                                    && password
                                    && new_password
                                    && new_password_confirmation
                                    && new_password === new_password_confirmation"
                                class="mt-5 btn btn-block btn-success"
                                @click.prevent="changePassword">
                                change password
                            </button>
                            <button v-else
                                class="mt-5 btn btn-block btn-success"
                                disabled>
                                change password
                            </button>
                        </form>
                        <!-- if changing username -->
                        <form v-if="!changing_password">
                            <div class="mt-4 mb-5 form-group">
                                <label for="password">Password</label>
                                <input
                                    type="password" class="form-control"
                                    placeholder="your password"
                                    v-model="password">
                            </div>
                            <div class="form-group">
                                <label for="newUsername">New username</label>
                                <input
                                    type="text" class="form-control"
                                    placeholder="your new username"
                                    v-model="new_username">
                                <!-- username errors-->
                                <ul v-if="username_errors.length">
                                    <li v-for="error in username_errors" :key="error" class="text-danger">
                                        <small>{{ error }}</small>
                                    </li>
                                </ul>
                            </div>
                            <div class="form-group">
                                <label for="confirmUsername">Confirm new username</label>
                                <input
                                    type="text" class="form-control"
                                    placeholder="confirm your new username"
                                    v-model="new_username_confirmation">
                            </div>
                            <button v-if="username_errors.length === 0
                                    && password
                                    && new_username
                                    && new_username_confirmation
                                    && new_username === new_username_confirmation"
                                class="mt-5 btn btn-block btn-success"
                                @click.prevent="changeUsername">
                                change username
                            </button>
                            <button v-else
                                class="mt-5 btn btn-block btn-success"
                                disabled>
                                change username
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, reactive, watch, onMounted } from "vue";
import router from "../../router";

export default {
  name: "credentialsReset",
  setup() {
    const username = ref(window.$session.get("username"));
    const changing_password = ref(true);
    const old_password = ref(null);
    const new_password = ref(null);
    const new_password_confirmation = ref(null);
    const password_errors = ref([]);
    const password = ref(null);
    const new_username = ref(null);
    const new_username_confirmation = ref(null);
    const username_errors = ref([]);
    let debouncing_timeout = null;

    // Watchers
    watch(changing_password, () => {
      if (changing_password.value) {
        document.getElementById("change_username_button")?.classList.add("text-primary");
        document.getElementById("change_password_button")?.classList.remove("text-primary");
      } else {
        document.getElementById("change_password_button")?.classList.add("text-primary");
        document.getElementById("change_username_button")?.classList.remove("text-primary");
      }
    });

    watch(new_username, () => {
      clearTimeout(debouncing_timeout);
      debouncing_timeout = setTimeout(() => {
        username_errors.value = [];
        if (new_username.value.length === 0) {
          new_username.value = null;
          return;
        }
        if (new_username.value.length < 5) {
          username_errors.value.push("too short");
        }
        if (new_username.value.includes(" ")) {
          username_errors.value.push("remove spaces");
        }
        if (new_username.value.length >= 5 && !new_username.value.includes(" ")) {
          checkIfUsernameIsAvailable();
        }
      }, 500);
    });

    watch(new_username_confirmation, () => {
      clearTimeout(debouncing_timeout);
      debouncing_timeout = setTimeout(() => {
        username_errors.value = [];
        if (username_errors.value.length === 0 && new_username.value !== new_username_confirmation.value) {
          username_errors.value.push("confirmation did not match username");
        }
      }, 500);
    });

    watch(new_password, () => {
      clearTimeout(debouncing_timeout);
      debouncing_timeout = setTimeout(() => {
        password_errors.value = [];
        if (new_password.value.length === 0) {
          new_password.value = null;
          return;
        }
        if (new_password.value.length < 5) {
          password_errors.value.push("too short");
        }
        if (new_password.value.includes(" ")) {
          password_errors.value.push("remove spaces");
        }
      }, 500);
    });

    watch(new_password_confirmation, () => {
      clearTimeout(debouncing_timeout);
      debouncing_timeout = setTimeout(() => {
        password_errors.value = [];
        if (password_errors.value.length === 0 && new_password.value !== new_password_confirmation.value) {
          password_errors.value.push("confirmation did not match password");
        }
      }, 500);
    });

    // Methods
    const checkIfUsernameIsAvailable = () => {
      window.$http({
        method: "post",
        url: window.$BASE_URL + `/api/members/check-if-username-is-taken/`,
        data: {
          username: new_username.value,
        },
      })
        .then(() => {
          username_errors.value = [];
        })
        .catch(() => {
          username_errors.value.push("username taken");
        });
    };

    const changeUsername = () => {
      window.$http({
        method: "post",
        url: window.$BASE_URL + `/api/members/change-credentials/`,
        data: {
          old_password: password.value,
          new_password: null,
          old_username: username.value,
          new_username: new_username.value,
        },
      })
        .then(() => {
          alert("username changed successfully");
          router.push("/login");
        })
        .catch(() => {
          alert("could not verify you. enter correct password");
        });
    };

    const changePassword = () => {
      window.$http({
        method: "post",
        url: window.$BASE_URL + `/api/members/change-credentials/`,
        data: {
          old_password: password.value,
          new_password: new_password.value,
          old_username: username.value,
          new_username: null,
        },
      })
        .then(() => {
          alert("password changed successfully");
          router.push("/login");
        })
        .catch(() => {
          alert("could not verify you. your old password was incorrect");
        });
    };

    return {
      username,
      changing_password,
      old_password,
      new_password,
      new_password_confirmation,
      password_errors,
      password,
      new_username,
      new_username_confirmation,
      username_errors,
      changeUsername,
      changePassword,
    };
  },
};
</script>

<style>
</style>

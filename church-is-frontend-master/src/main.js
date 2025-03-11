// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
// import Vue from 'vue'
// import App from './App'
// import router from './router'
// import 'bootstrap'
// import 'bootstrap/dist/css/bootstrap.min.css'
// import axios from 'axios';
// import VueLodash from 'vue-lodash'
// import VueSession from 'vue-session'
// import Vuex from 'vuex'
// import { store } from './store'

// //momentjs
// import moment from 'moment'
// Vue.prototype.$moment = moment

// //guill vue
// import VueQuillEditor from 'vue-quill-editor'
// // require styles
// import 'quill/dist/quill.core.css'
// import 'quill/dist/quill.snow.css'
// import 'quill/dist/quill.bubble.css'

// import './helpers.js'

// Vue.use(Vuex)
// Vue.use(VueLodash, { name: 'lodash' })
// Vue.use(VueSession)
// Vue.use(VueQuillEditor, /* { default global options } */) //component <quill-editor/>

// Vue.config.productionTip = false
// //vuex
// Vue.prototype.$store =  store
// //axios
// Vue.prototype.$http = axios

// //helpers
// Vue.prototype.$humanizeDate = function(date_time){
//   return this.$moment((new Date(date_time))).format("DD/MMM/YY")
// },

// Vue.prototype.$fileDownload = require('js-file-download');

// //DOMAINS
// // var current_host = 'https://admin.methodistkenya.org'
// var current_host = window.location.hostname //un comment this in production
// // var current_host = 'admin.anvil.site'//for dev env local use only, comment out in production

// Vue.prototype.$host_name = current_host.split('.')[1]

// var name = current_host.split('.')[1]
// var tld = current_host.split('.')[2]
// var api_server = `https://${name}.${tld}` // + ":8000"

// Vue.prototype.$DOMAIN = { value : api_server }
// Vue.prototype.$BASE_URL = { value :localStorage.getItem('base_url_value'),toString:function(){return this.value}}

// /* eslint-disable no-new */
// new Vue({
//   el: '#app',
//   router,
//   components: { App },
//   template: '<App/>'
// })


// updated vue3 code


import { createApp } from 'vue';
import App from './App.vue';
import router from './router/index.js';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import _ from 'lodash'; // VueLodash is no longer needed
import { createStore } from 'vuex';
import { store } from './store';

// Moment.js
import moment from 'moment';

// Quill Editor (Vue 3 compatible version)
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import '@vueup/vue-quill/dist/vue-quill.bubble.css';
import '@vueup/vue-quill/dist/vue-quill.core.css';

import './helpers.js';

// Create Vue app instance
const app = createApp(App);

// Vuex (no need for Vue.use in Vue 3)
const vuexStore = createStore(store);
app.use(vuexStore);

// Global properties (Replacing Vue.prototype)
app.config.globalProperties.$moment = moment;
app.config.globalProperties.$http = axios;
app.config.globalProperties.$lodash = _;

// File download
import fileDownload from 'js-file-download';
app.config.globalProperties.$fileDownload = fileDownload;

// Humanize Date Helper
app.config.globalProperties.$humanizeDate = (date_time) => {
  return moment(new Date(date_time)).format("DD/MMM/YY");
};

// DOMAIN Configuration
const current_host = window.location.hostname; // Use in production
const name = current_host.split('.')[1];
const tld = current_host.split('.')[2];
const api_server = `https://${name}.${tld}`;

app.config.globalProperties.$DOMAIN = { value: api_server };
app.config.globalProperties.$BASE_URL = {
  value: localStorage.getItem('base_url_value'),
  toString: function () {
    return this.value;
  }
};

// Register Quill Editor globally
app.component('QuillEditor', QuillEditor);

// Use Router
app.use(router);

// Mount the Vue app
app.mount('#app');


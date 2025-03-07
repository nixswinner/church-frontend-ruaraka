// import Vue from 'vue'
// import Vuex from 'vuex'

// Vue.use(Vuex)

// export const store = new Vuex.Store({
// state: {

//     isLoading: false,
//     logged_in_member: '',
//     member_list_version: 0,
//     group_list_version: 0,
//     tithe_list_version: 0,
//     income_type_list_version: 0,
//     offering_list_version: 0,
//     expenditure_list_version: 0,
//     project_list_version: 0,
// },
// mutations: {
//     isLoading(state, payload) {
//         state.isLoading = payload
//     },
//     logged_in_member(state, payload) {
//         state.logged_in_member = payload
//     },
//     member_list_version(state, payload) {
//         state.member_list_version = payload
//     },
//     group_list_version(state, payload) {
//         state.group_list_version = payload
//     },
//     tithe_list_version(state, payload) {
//         state.tithe_list_version = payload
//     },
//     income_type_list_version(state,payload) {
//         state.income_type_list_version = payload
//     },
//     offering_list_version(state,payload) {
//         state.offering_list_version = payload
//     },
//     expenditure_list_version(state,payload) {
//         state.expenditure_list_version = payload
//     },
//     project_list_version(state,payload) {
//         state.project_list_version = payload
//     }
// },
// actions: {
//     update_isLoading (context, payload){
//         context.commit('isLoading', payload)
//     },
//     update_logged_in_member (context, payload) {
//         context.commit('logged_in_member', payload)
//     },
//     update_member_list_version (context, payload) {
//       context.commit('member_list_version', payload)
//     },
//     update_group_list_version (context, payload) {
//         context.commit('group_list_version', payload)
//     },
//     update_tithe_list_version (context, payload) {
//         context.commit('tithe_list_version', payload)
//     },
//     update_income_type_list_version (context, payload) {
//         context.commit('income_type_list_version', payload)
//     },
//     update_offering_list_version (context,payload) {
//         context.commit('offering_list_version', payload)
//     },
//     update_expenditure_list_version(context,payload) {
//         context.commit('expenditure_list_version',payload)
//     },
//     update_project_list_version(context,payload) {
//         context.commit('project_list_version',payload)
//     }
// },
// getters: {
//     isLoading (state) {
//         return state.isLoading
//     },
//     logged_in_member (state) {
//         return state.logged_in_member
//     },
//     member_list_version (state) {
//         return state.member_list_version
//     },
//     group_list_version (state) {
//         return state.group_list_version
//     },
//     tithe_list_version (state) {
//         return state.tithe_list_version
//     },
//     income_type_list_version (state) {
//         return state.income_type_list_version
//     },
//     offering_list_version (state) {
//         return state.offering_list_version
//     },
//     expenditure_list_version (state) {
//         return state.expenditure_list_version
//     },
//     project_list_version (state) {
//         return state.project_list_version
//     }
// }
// })


//
// updated vue 3 code


import { createStore } from 'vuex';

export const store = createStore({
  state() {
    return {
      isLoading: false,
      logged_in_member: '',
      member_list_version: 0,
      group_list_version: 0,
      tithe_list_version: 0,
      income_type_list_version: 0,
      offering_list_version: 0,
      expenditure_list_version: 0,
      project_list_version: 0
    };
  },
  mutations: {
    setIsLoading(state, payload) {
      state.isLoading = payload;
    },
    setLoggedInMember(state, payload) {
      state.logged_in_member = payload;
    },
    setMemberListVersion(state, payload) {
      state.member_list_version = payload;
    },
    setGroupListVersion(state, payload) {
      state.group_list_version = payload;
    },
    setTitheListVersion(state, payload) {
      state.tithe_list_version = payload;
    },
    setIncomeTypeListVersion(state, payload) {
      state.income_type_list_version = payload;
    },
    setOfferingListVersion(state, payload) {
      state.offering_list_version = payload;
    },
    setExpenditureListVersion(state, payload) {
      state.expenditure_list_version = payload;
    },
    setProjectListVersion(state, payload) {
      state.project_list_version = payload;
    }
  },
  actions: {
    updateIsLoading({ commit }, payload) {
      commit('setIsLoading', payload);
    },
    updateLoggedInMember({ commit }, payload) {
      commit('setLoggedInMember', payload);
    },
    updateMemberListVersion({ commit }, payload) {
      commit('setMemberListVersion', payload);
    },
    updateGroupListVersion({ commit }, payload) {
      commit('setGroupListVersion', payload);
    },
    updateTitheListVersion({ commit }, payload) {
      commit('setTitheListVersion', payload);
    },
    updateIncomeTypeListVersion({ commit }, payload) {
      commit('setIncomeTypeListVersion', payload);
    },
    updateOfferingListVersion({ commit }, payload) {
      commit('setOfferingListVersion', payload);
    },
    updateExpenditureListVersion({ commit }, payload) {
      commit('setExpenditureListVersion', payload);
    },
    updateProjectListVersion({ commit }, payload) {
      commit('setProjectListVersion', payload);
    }
  },
  getters: {
    isLoading: (state) => state.isLoading,
    loggedInMember: (state) => state.logged_in_member,
    memberListVersion: (state) => state.member_list_version,
    groupListVersion: (state) => state.group_list_version,
    titheListVersion: (state) => state.tithe_list_version,
    incomeTypeListVersion: (state) => state.income_type_list_version,
    offeringListVersion: (state) => state.offering_list_version,
    expenditureListVersion: (state) => state.expenditure_list_version,
    projectListVersion: (state) => state.project_list_version
  }
});


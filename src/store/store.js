import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    beforePage: 'Main'
  , userInfo: {
      token: '',
      userId: '',
    },
    loading: false
  },
  // 동기 처리로 state 값을 처리할 경우
  actions: {
  },
  // 비동기 처리로 state 값을 처리할 경우
  mutations: {
    changeloading(state, flag) {
      state.loading = flag
    }
  , setBeforePage(state, pageName){
      state.beforePage = pageName
    }
  }
})

import Vue from 'vue'
import Vuex from 'vuex'
import auth from "@/store/modules/auth";
import user from './modules/user'
import common from './modules/common'
import tags from './modules/tags'
import logs from './modules/logs'
import getters from './getters'

Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    user,
    auth,
    common,
    logs,
    tags
  },
  getters,
})

export default store

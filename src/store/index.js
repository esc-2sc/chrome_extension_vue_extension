import Vue from 'vue';
import Vuex from 'vuex';

import * as getters from './getters';
import mutations from './mutations';
import * as actions from './actions';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    foo: 'bar',
    urlOption: {
      base: '&calType=1&enplcCd=G001',
      entryDt: null,
      emplNo: null,
      enplcCd: null,
      url: null,
    },
  },
  getters,
  mutations,
  actions,
});

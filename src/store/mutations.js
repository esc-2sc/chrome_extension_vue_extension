import * as types from './mutation-types';

export default {
  [types.UPDATE_FOO](state, payload) {
    state.foo = payload;
  },
  [types.UPDATE_URL_OPTION](state, {entryDt, emplNo, enplcCd, url}) {
    state.urlOption.entryDt = entryDt;
    state.urlOption.emplNo = emplNo;
    state.urlOption.enplcCd = enplcCd;
    state.urlOption.url = url;
  },
};

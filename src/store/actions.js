import * as types from './mutation-types';

export const setFoo = ({ commit }, payload) => {
  commit(types.UPDATE_FOO, payload);
};
export const setUrlOption = ({ commit }, payload) => {
  commit(types.UPDATE_URL_OPTION, payload);
};
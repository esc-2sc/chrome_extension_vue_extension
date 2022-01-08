import store from './store';
global.browser = require('webextension-polyfill');

console.log(`Hello ${store.getters.foo}!`);
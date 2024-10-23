import Vue from 'vue';
import Vuex from 'vuex';
import organizations from './modules/organizations';
import organization from './modules/organization';
import user from './modules/users';
import accounts from './modules/accounts';
import transactions from './modules/transactions';
import categories from './modules/categories';
import bankList from './modules/bankList';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    organizations,
    organization,
    user,
    accounts,
    transactions,
    categories,
    bankList
  },
  plugins: [createPersistedState()],
});

//import axios from 'axios';
import http from '../../services/http.js';

const state = {
    accounts: [],
    error: null
};

const mutations = {
    SET_ACCOUNTS(state, accounts) {
        state.accounts = accounts;
    },
    SET_ERROR(state, error) {
        state.error = error;
    },
    ADD_ACCOUNT(state, account) {
        state.accounts.push(account);
    },
    UPDATE_ACCOUNT(state, updatedAccount) {
        const index = state.accounts.findIndex(account => account.id === updatedAccount.id);
        if (index !== -1) {
            state.accounts.splice(index, 1, updatedAccount);
        }
    },
    DELETE_ACCOUNT(state, accountId) {
        state.accounts = state.accounts.filter(account => account.id !== accountId);
    }
};

const actions = {
    fetchAccounts({ commit }, userId) {
        http.get(`/accounts`, { params: { user_id: userId } })
            .then(response => {
                commit('SET_ACCOUNTS', response.data);
            })
            .catch(error => {
                console.error('取得エラー', error);
                commit('SET_ERROR', 'アカウントの取得に失敗しました。');
            });
    },
    createAccount({ commit }, account) {
        return http.post('accounts', account)
            .then(response => {
                commit('ADD_ACCOUNT', response.data);
            })
            .catch(error => {
                console.error('作成エラー', error);
                commit('SET_ERROR', 'アカウントの作成に失敗しました。');
            });
    },
    updateAccount({ commit }, account) {
        return http.put(`accounts/${account.id}`, account)
            .then(() => {
                commit('UPDATE_ACCOUNT', account);
            })
            .catch(error => {
                console.error('更新エラー', error);
                commit('SET_ERROR', 'アカウントの作成に失敗しました。');
            });
    },
    deleteAccount({ commit }, accountId) {
        return http.delete(`accounts/${accountId}`)
            .then(() => {
                commit('DELETE_ACCOUNT', accountId);
            })
            .catch(error => {
                console.error('削除エラー', error);
                commit('SET_ERROR', 'アカウントの作成に失敗しました。');
            });
    }
};

const getters = {
    accounts: state => state.accounts,
    error: state => state.error
};

export default {
    state,
    mutations,
    actions,
    getters
};

import http from '../../services/http.js';

const state = {
    accounts: [],
    error: null,
    bankList: []
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
    },
    SET_BANK_LIST(state, bankList) {
        state.bankList = bankList;
    }
};

const actions = {
    fetchAccounts({ commit }, userId) {
        const token = localStorage.getItem('token');
        http.get(`/accounts`, {
            params: { user_id: userId },
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            commit('SET_ACCOUNTS', response.data);
        })
        .catch(error => {
            console.error('取得エラー', error);
            commit('SET_ERROR', 'アカウントの取得に失敗しました。');
        });
    },
    createAccount({ commit }, account) {
        const token = localStorage.getItem('token');
        return http.post('/accounts', account, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            commit('ADD_ACCOUNT', response.data);
        })
        .catch(error => {
            console.error('作成エラー', error);
            commit('SET_ERROR', 'アカウントの作成に失敗しました。');
        });
    },
    updateAccount({ commit }, account) {
        const token = localStorage.getItem('token');
        return http.put(`/accounts/${account.id}`, account, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            commit('UPDATE_ACCOUNT', account);
        })
        .catch(error => {
            console.error('更新エラー', error);
            commit('SET_ERROR', 'アカウントの更新に失敗しました。');
        });
    },
    deleteAccount({ commit }, accountId) {
        const token = localStorage.getItem('token');
        return http.delete(`/accounts/${accountId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            commit('DELETE_ACCOUNT', accountId);
        })
        .catch(error => {
            console.error('削除エラー', error);
            commit('SET_ERROR', 'アカウントの削除に失敗しました。');
        });
    },
    fetchBankList({ commit }) {
        const token = localStorage.getItem('token');
        return http.get('/bank_lists', {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(response => {
            commit('SET_BANK_LIST', response.data);
        })
        .catch(error => {
            console.error('バンクリスト取得エラー', error);
            commit('SET_ERROR', 'バンクリストの取得に失敗しました。');
        });
    }
};

const getters = {
    accounts: state => state.accounts,
    error: state => state.error,
    bankList: state => state.bankList
};

export default {
    state,
    mutations,
    actions,
    getters
};

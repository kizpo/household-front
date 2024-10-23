import http from '../../services/http.js';

const state = {
    bankList: [],
    error: null
};

const mutations = {
    SET_BANK_LIST(state, bankList) {
        state.bankList = bankList;
    },
    SET_ERROR(state, error) {
        state.error = error;
    }
};

const actions = {
    fetchBankList({ commit }) {
        return http.get('/bank_lists')
            .then(response => {
                commit('SET_BANK_LIST', response.data);
            })
            .catch(error => {
                console.error('銀行リストの取得エラー', error);
                commit('SET_ERROR', '銀行リストの取得に失敗しました。');
            });
    }
};

const getters = {
    bankList: state => state.bankList,
    error: state => state.error
};

export default {
    state,
    mutations,
    actions,
    getters
};

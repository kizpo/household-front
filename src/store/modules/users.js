//import axios from 'axios';
import http from '../../services/http.js';

const state = {
    users: [],
    error: null
};

const mutations = {
    setUsers(state, users) {
        state.users = users;
    },
    setUserId(state, userId) {
        state.userId = userId;
    },
    setError(state, error) {
        state.error = error;
    }
};

const actions = {
    fetchUsers({ commit }) {
        http.get('/users')
            .then(response => {
                commit('setUsers', response.data);
            })
            .catch(error => {
                console.error('There was an error!', error);
                commit('setError', 'ユーザーの取得に失敗しました。');
            });
    }
};

const getters = {
    users: state => state.users,
    error: state => state.error
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};

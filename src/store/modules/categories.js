//import axios from 'axios';
import http from '../../services/http.js';

const state = {
    categories: [],
    error: null,
    userId: localStorage.getItem('user_id') || ''
};

const mutations = {
    SET_CATEGORIES(state, categories) {
        state.categories = categories;
    },
    SET_ERROR(state, error) {
        state.error = error;
    },
    CLEAR_ERROR(state) {
        state.error = null;
    },
    ADD_CATEGORY(state, category) {
        state.categories.push(category);
    },
    UPDATE_CATEGORY(state, updatedCategory) {
        const index = state.categories.findIndex(category => category.id === updatedCategory.id);
        if (index !== -1) {
            state.categories.splice(index, 1, updatedCategory);
        }
    },
    DELETE_CATEGORY(state, categoryId) {
        state.categories = state.categories.filter(category => category.id !== categoryId);
    }
};

const actions = {
    fetchCategories({ commit }) {
        const userId = localStorage.getItem('user_id');
        if (!userId) { // !state.userId??
            commit('SET_ERROR', 'ユーザーIDが見つかりません。');
            return;
        }
        commit('CLEAR_ERROR');
        http.get('/categories', {
            params: { user_id: userId }
        })
        .then(response => {
            commit('SET_CATEGORIES', response.data);
        })
        .catch(error => {
            console.error('取得エラー', error);
            commit('SET_ERROR', 'カテゴリの取得に失敗しました。');
        });
    },
    createCategory({ commit }, category) {
        http.post('/categories', category)
            .then(response => {
                commit('ADD_CATEGORY', response.data);
            })
            .catch(error => {
                console.error('作成エラー', error);
                commit('SET_ERROR', 'カテゴリの作成に失敗しました。');
            });
    },
    updateCategory({ commit }, category) {
        http.put(`/categories/${category.id}`, {
            name: category.name
        })
        .then(() => {
            commit('UPDATE_CATEGORY', category);
        })
        .catch(error => {
            console.error('更新エラー', error);
            commit('SET_ERROR', 'カテゴリの更新に失敗しました。');
        });
    },
    deleteCategory({ commit }, categoryId) {
        http.delete(`/categories/${categoryId}`)
            .then(() => {
                commit('DELETE_CATEGORY', categoryId);
            })
            .catch(error => {
                console.error('削除エラー', error);
                commit('SET_ERROR', 'カテゴリの佐久jpに失敗しました。');
            });
    }
};

const getters = {
    categories: state => state.categories,
    error: state => state.error,
};

export default {
    state,
    mutations,
    actions,
    getters
};

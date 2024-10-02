//import axios from 'axios';
import http from '../../services/http.js';

const state = {
    transactions: [],
    categories: [],
    error: null,
};

const mutations = {
    SET_TRANSACTIONS(state, transactions) {
        state.transactions = transactions;
    },
    SET_CATEGORIES(state, categories) {
        state.categories = categories;
    },
    SET_ERROR(state, error) {
        state.error = error;
    },
    ADD_TRANSACTION(state, transaction) {
        state.transactions.push(transaction);
    },
    UPDATE_TRANSACTION(state, updatedTransaction) {
        const index = state.transactions.findIndex(t => t.id === updatedTransaction.id);
        if (index !== -1) {
            state.transactions.splice(index, 1, updatedTransaction);
        }
    },
    DELETE_TRANSACTION(state, transactionId) {
        state.transactions = state.transactions.filter(t => t.id !== transactionId);
    },
};

const actions = {
    fetchTransactions({ commit }, { userId, accountId }) {
        return http.get('/transactions', {
            params: { user_id: userId, account_id: accountId }
        })
        .then(response => {
            commit('SET_TRANSACTIONS', response.data);
        })
        .catch(error => {
            console.error('取得エラー', error);
            commit('SET_ERROR', '取引の取得に失敗しました。');
        });
    },
    fetchCategories({ commit }) {
        const userId = localStorage.getItem('user_id');
        return http.get('/categories', {
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
    createTransaction({ commit }, transaction) {
        return http.post('/transactions', transaction)
        .then(response => {
            commit('ADD_TRANSACTION', response.data);
        })
        .catch(error => {
            console.error('作成エラー', error);
            commit('SET_ERROR', '取引の作成に失敗しました。');
        });
    },
    updateTransaction({ commit }, transaction) {
        console.log("更新するトランザクション:", transaction);
        return http.put(`/transactions/${transaction.id}`, transaction)
            .then(response => {
                commit('UPDATE_TRANSACTION', response.data);
            })
            .catch(error => {
                console.error('更新エラー', error);
                commit('SET_ERROR', '取引の更新に失敗しました。');
            });
    },
    deleteTransaction({ commit }, transactionId) {
        return http.delete(`/transactions/${transactionId}`)
        .then(() => {
            commit('DELETE_TRANSACTION', transactionId);
        })
        .catch(error => {
            console.error('削除エラー', error);
            commit('SET_ERROR', '取引の削除に失敗しました。');
        });
    },
};

const getters = {
    transactionsWithCategoryNames: (state) => {
        return state.transactions.map(transaction => {
            const category = state.categories.find(cat => cat.id === transaction.category_id);
            return {
                ...transaction,
                category_name: category ? category.name : '未分類'
            };
        });
    },
    categoryOptions: (state) => {
        return state.categories.map(category => ({
            value: category.id,
            text: category.name,
        }));
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};

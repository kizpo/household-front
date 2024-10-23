import http from '../../services/http.js';

const state = {
    organization: null,
};

const mutations = {
    SET_ORGANIZATION(state, organization) {
        state.organization = organization;
    },
};

const actions = {
    fetchOrganization({ commit }) {
        const userId = localStorage.getItem('user_id');
        if (!userId) {
            console.error('User ID not found in local storage');
            return;
        }

        // APIを使ってユーザーの組織IDを取得
        return http.get(`/users/${userId}`)
            .then(userResponse => {
                const organizationId = userResponse.data.organization_id;

                if (!organizationId) {
                    console.error('Organization ID not found for user');
                    return;
                }

                // 組織IDを使って組織情報を取得
                return http.get(`/organizations/${organizationId}`);
            })
            .then(orgResponse => {
                commit('SET_ORGANIZATION', orgResponse.data);
            })
            .catch(error => {
                console.error('Error fetching organization:', error);
            });
    },
};

const getters = {
    organization: state => state.organization,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};

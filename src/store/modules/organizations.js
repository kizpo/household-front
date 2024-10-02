import axios from 'axios';

const state = {
organizations: [],
organization: null,
};

const mutations = {
SET_ORGANIZATIONS(state, organizations) {
    state.organizations = organizations;
},
SET_ORGANIZATION(state, organization) {
    state.organization = organization;
},
ADD_ORGANIZATION(state, organization) {
    state.organizations.push(organization);
},
UPDATE_ORGANIZATION(state, updatedOrganization) {
    const index = state.organizations.findIndex(org => org.id === updatedOrganization.id);
    if (index !== -1) {
    state.organizations[index] = updatedOrganization;
    }
},
DELETE_ORGANIZATION(state, id) {
    state.organizations = state.organizations.filter(org => org.id !== id);
},
};

const actions = {
async fetchOrganizations({ commit }) {
    try {
    const response = await axios.get('http://localhost:3000/api/v1/organizations');
    commit('SET_ORGANIZATIONS', response.data);
    } catch (error) {
    console.error('There was an error!', error);
    }
},
async createOrganization({ commit }, organization) {
    try {
    const response = await axios.post('http://localhost:3000/api/v1/organizations', organization);
    commit('ADD_ORGANIZATION', response.data);
    } catch (error) {
    console.error('There was an error!', error);
    }
},
async fetchOrganization({ commit }, id) {
    try {
    const response = await axios.get(`http://localhost:3000/api/v1/organizations/${id}`);
    commit('SET_ORGANIZATION', response.data);
    } catch (error) {
    console.error('There was an error!', error);
    }
},
async updateOrganization({ commit }, { id, organization }) {
    try {
    const response = await axios.put(`http://localhost:3000/api/v1/organizations/${id}`, organization);
    commit('UPDATE_ORGANIZATION', response.data);
    } catch (error) {
    console.error('There was an error!', error);
    }
},
async deleteOrganization({ commit }, id) {
    try {
    await axios.delete(`http://localhost:3000/api/v1/organizations/${id}`);
    commit('DELETE_ORGANIZATION', id);
    } catch (error) {
    console.error('There was an error!', error);
    }
},
};

const getters = {
organizations: state => state.organizations,
organization: state => state.organization,
};

export default {
namespaced: true,
state,
mutations,
actions,
getters, 
};

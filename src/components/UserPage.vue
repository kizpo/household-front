<template>
    <div>
        <h1>User Page</h1>
        <b-table :items="users" :fields="fields"></b-table>
        <div v-if="error">{{ error }}</div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    computed: {
        ...mapState('user', ['users', 'error']),
        fields() {
            return [
                { key: 'id', label: 'ID' },
                { key: 'name', label: 'Name' },
                { key: 'email', label: 'Email' },
                { key: 'organization_id', label: 'ORGANIZATIONID' }
            ];
        }
    },
    created() {
        this.fetchUsers();
    },
    methods: {
        ...mapActions('user', ['fetchUsers'])
    }
};
</script>

<style scoped>

</style>

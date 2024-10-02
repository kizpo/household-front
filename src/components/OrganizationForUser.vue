<template>
    <div class="container">
        <div v-if="organization">
            <br>
            <br>
            <br>
            <br>
            <br>
            <h2><strong>組織名:</strong> {{ organization.name }}</h2>
            <br>
            <br>
            <h2><strong>所在地:</strong> {{ organization.location }}</h2>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    computed: {
        ...mapGetters('organization', ['organization']),
    },
    created() {
        this.fetchOrganization();
    },
    methods: {
        fetchOrganization() {
            this.$store.dispatch('organization/fetchOrganization')
                .catch(error => {
                    console.error('Error fetching organization:', error);
                });
        },
    }
};
</script>

<style scoped>

</style>

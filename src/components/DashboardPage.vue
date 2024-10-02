<template>
    <div class="dashboard">
        <h1>こんにちは、{{ username }}さん</h1>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            username: ''
        };
    },
    created() {
        this.fetchUsername();
    },
    methods: {
        async fetchUsername() {
            const userId = localStorage.getItem('user_id');
            if (!userId) {
                console.error('User ID not found in local storage');
                return;
            }

            try {
                const response = await axios.get(`http://localhost:3000/api/v1/users/${userId}`);
                this.username = response.data.name;
            } catch (error) {
                console.error('Error fetching user name:', error);
            }
        }
    }
};
</script>

<style scoped>
</style>

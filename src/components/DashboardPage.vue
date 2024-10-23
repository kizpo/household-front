<template>
    <div class="dashboard">
        <h1>こんにちは、{{ username }}さん</h1>
    </div>
</template>

<script>
//import axios from 'axios';
import http from '../services/http.js';

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
        fetchUsername() {
            const userId = localStorage.getItem('user_id');
            //const token = localStorage.getItem('token'); // トークンを取得

            if (!userId) {
                console.error('User ID not found in local storage');
                return;
            }

            // ヘッダーにトークンを追加
            http.get(`/users/${userId}`, {
                //headers: {
                //    Authorization: `Bearer ${token}` // トークンをヘッダーに追加
                //}
            })
            .then(response => {
                this.username = response.data.name;
            })
            .catch(error => {
                console.error('Error fetching user name:', error);
            });
        }
    }
};
</script>

<style scoped>
</style>

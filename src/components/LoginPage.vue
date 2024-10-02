<template>
    <div class="container">
        <br><br><h1>ログイン</h1><br><br>
        <form @submit.prevent="login">
            <div class="mb-3">
                <label for="email" class="form-label">メールアドレス</label>
                <input
                    type="email"
                    class="form-control"
                    id="email"
                    v-model="email"
                    required
                />
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">パスワード</label>
                <input
                    type="password"
                    class="form-control"
                    id="password"
                    v-model="password"
                    required
                />
            </div>
            <button type="submit" class="btn btn-primary">ログイン</button>
        </form>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            email: '',
            password: '',
        };
    },
    methods: {
        async login() {
            try {
                const response = await axios.post('http://localhost:3000/api/v1/login', {
                    email: this.email,
                    password: this.password,
                });

                const token = response.data.jwt;
                console.log('Token received:', token);

                //トークンからuser_idを取得
                const userId = this.getUserIdFromToken(token);
                console.log('User ID:', userId);

                //トークンとuser_idをlocalStorageに保存
                localStorage.setItem('token', token);
                localStorage.setItem('user_id', userId);

                console.log('token and user_id saved to localStorage:', localStorage.getItem('token'), localStorage.getItem('user_id'));

                //ログイン後/dashboardに遷移
                this.$router.push('/dashboard');
                console.log('Logged in successfully, redirecting to dashboard');
            } catch (error) {
                console.error('Login error:', error.response?.data || error.message);
                alert('ログインに失敗しました。もう一度入力してください。');
            }
        },

        //トークンからuser_idを取得
        getUserIdFromToken(token) {
            //トークンを.で分割
            const parts = token.split('.');
            if (parts.length !== 3) {
                throw new Error('Invalid token');
            }

            //ペイロード部分をデコード
            const payload = atob(parts[1]);
            const data = JSON.parse(payload);

            //user_idを取得
            return data.user_id;
        }
    },
};
</script>

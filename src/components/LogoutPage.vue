<template>
    <div class="logout-page">
        <br><br><br><br><br><br><br><br><br><br>
        <button @click="logout" class="btn btn-danger btn-lg">ログアウト</button>
    </div>
</template>

<script>
    export default {
        name: 'LogoutPage',
        methods: {
            logout() {
                //localStorageからデータを削除
                localStorage.removeItem('vuex');
                localStorage.removeItem('user_id');
                localStorage.removeItem('token');
                this.$router.push('/');
            }
        }
    }
</script>

<style>

</style>

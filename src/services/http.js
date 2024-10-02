import axios from 'axios';
import router from '../router';

const http = axios.create({
    baseURL: `http://localhost:3000/api/v1`
});

function logout() {
    localStorage.removeItem('vuex');
    localStorage.removeItem('user_id');
    localStorage.removeItem('token');
    router.push('/');
}

http.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        //alert(token)
        config.headers.Authorization = `Bearer ${token}`;
    } else {
        alert("認証エラー:もう一度ログインしてください。");
        logout();
        return Promise.reject(new Error("トークンが存在しません。"));
    }
    return config;
}, function (error) {
    if (error.response && error.response.status === 401) {
        alert("認証エラー: ログインが必要です。");
        logout();
    }
    return Promise.reject(error);
});

export default http;

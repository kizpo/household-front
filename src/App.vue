<template>
  <div id="app">
    <nav v-if="$route.path !== '/'" class="navbar navbar-expand-lg navbar-dark" style="background-color: #007bff; padding: 1rem 0.75rem;">
      <a class="navbar-brand" href="#">家計簿アプリ</a>
      <div class="collapse navbar-collapse">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link to="/organizationsuser" class="nav-link">組織</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/accounts" class="nav-link">口座一覧</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/categories" class="nav-link">カテゴリ一覧</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/logout" class="nav-link">ログアウト</router-link>
          </li>
        </ul>
      </div>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.navbar-nav .nav-link {
  color: white;
}

@import 'bootstrap/dist/css/bootstrap.css';
@import 'bootstrap-vue/dist/bootstrap-vue.css';
</style>

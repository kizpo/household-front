import Vue from 'vue'
import VueRouter from 'vue-router'
/*import HomeView from '../views/HomeView.vue'*/
import LoginPage from '@/components/LoginPage.vue';
import UserPage from '@/components/UserPage.vue';
import OrganizationPage from '@/components/OrganizationPage.vue'; // テスト用
import AccountPage from '@/components/AccountPage.vue';
import CategoryPage from '@/components/CategoryPage.vue';
import TransactionPage from '@/components/TransactionPage.vue';
import DashboardPage from '@/components/DashboardPage.vue';
import OrganizationForUser from '@/components/OrganizationForUser.vue'; // User用
import LogoutPage from '@/components/LogoutPage.vue';
/*import AccountInput from '@/components/AccountInput.vue';*/

Vue.use(VueRouter)

Vue.use(VueRouter);

export default new VueRouter({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'LoginPage',
            component: LoginPage
        },
        {
            path: '/logout',
            name: 'LogoutPage',
            component: LogoutPage
        },
        {
            path: '/users',
            name: 'UserPage',
            component: UserPage
        },
        {
            path: '/organizations',// test
            name: 'OrganizationPage',
            component: OrganizationPage
        },
        {
            path: '/organizationsuser',
            name: 'OrganizationForUser',
            component: OrganizationForUser
        },
        {
            path: '/accounts',
            name: 'AccountPage',
            component: AccountPage
        },
        {
            path: '/categories',
            name: 'CategoryPage',
            component: CategoryPage
        },
        {
            path: '/transactions/:userId/:accountId',
            name: 'TransactionPage',
            component: TransactionPage,
            props: true
        },
        {
            path: '/transactions',
            name: 'TransactionPage',
            component: TransactionPage
        },
        {
            path: '/dashboard',
            name: 'DashboardPage',
            component: DashboardPage
        }
    ]
});

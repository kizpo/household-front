<template>
    <div>
        <br><br><h1>口座一覧</h1><br><br>
        <!-- 新規作成ボタン -->
        <b-button @click="showCreateModal" variant="success">新規作成</b-button>

        <!-- アカウントのテーブル表示 -->
        <b-table v-if="accounts.length" :items="accounts" :fields="fields">
            <!-- nameクリックで遷移 -->
            <template #cell(name)="data">
                <span @click="viewTransactions(data.item)" style="cursor: pointer; color: blue;">
                    {{ data.item.name }}
                </span>
            </template>

            <template #cell(created_at)="data">
                {{ formatDate(data.item.created_at) }}
            </template>

            <template #cell(updated_at)="data">
                {{ formatDate(data.item.updated_at) }}
            </template>

            <!-- actionsカラムの操作ボタン -->
            <template #cell(actions)="data">
                <b-button @click="viewTransactions(data.item)" variant="primary">詳細</b-button>
                <b-button @click="showUpdateModal(data.item)" variant="warning">更新</b-button>
                <b-button @click="showDeleteModal(data.item)" variant="danger">削除</b-button>
            </template>
        </b-table>

        <!-- 新規作成モーダル -->
        <b-modal v-model="isCreateModalVisible" title="アカウントの作成" hide-footer>
            <b-form @submit.prevent="submitCreateAccount">
                <b-form-group label="口座名">
                    <b-form-select v-model="newAccount.name" :options="bankListOptions" required></b-form-select>
                </b-form-group>
                <input type="hidden" v-model="newAccount.user_id" />
                <b-button type="submit" variant="primary">作成</b-button>
                <b-button @click="isCreateModalVisible = false" variant="secondary">キャンセル</b-button>
            </b-form>
        </b-modal>

        <!-- 更新モーダル -->
        <b-modal v-model="isUpdateModalVisible" title="アカウントの更新" hide-footer>
            <b-form @submit.prevent="submitUpdateAccount">
                <b-form-group label="口座ID">
                    <b-form-input v-model="selectedAccount.id" type="number" disabled></b-form-input>
                </b-form-group>
                <b-form-group label="口座名">
                    <b-form-input v-model="selectedAccount.name" required></b-form-input>
                </b-form-group>
                <b-form-group label="残高（income - expense）">
                    <b-form-input v-model="selectedAccount.balance" type="number" disabled></b-form-input>
                </b-form-group>
                <b-button type="submit" variant="primary">更新</b-button>
                <b-button @click="isUpdateModalVisible = false" variant="secondary">キャンセル</b-button>
            </b-form>
        </b-modal>

        <!-- 削除モーダル -->
        <b-modal v-model="isDeleteModalVisible" title="アカウントの削除" hide-footer>
            <b-form @submit.prevent="submitDeleteAccount">
                <b-form-group label="口座ID">
                    <b-form-input v-model="selectedAccount.id" type="number" disabled></b-form-input>
                </b-form-group>
                <b-form-group label="口座名">
                    <b-form-input v-model="selectedAccount.name" disabled></b-form-input>
                </b-form-group>
                <b-button type="submit" variant="danger">削除</b-button>
                <b-button @click="isDeleteModalVisible = false" variant="secondary">キャンセル</b-button>
            </b-form>
        </b-modal>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import moment from 'moment';

export default {
    data() {
        return {
            isCreateModalVisible: false,
            isUpdateModalVisible: false,
            isDeleteModalVisible: false,
            newAccount: {
                name: '',
                balance: 0,
                user_id: null
            },
            selectedAccount: {
                id: null,
                name: '',
                balance: 0
            },
            fields: [
                { key: 'name', label: '口座名' },
                { key: 'balance', label: '残高' },
                { key: 'created_at', label: '作成日時' },
                { key: 'updated_at', label: '更新日時' },
                { key: 'actions', label: '操作' }
            ]
        };
    },
    computed: {
        ...mapGetters([
            'accounts',
            'error',
            'bankList'
        ]),
        bankListOptions() {
            return this.bankList.map(bank => {
                return { value: bank.name, text: bank.name };
            });
        }
    },
    created() {
        this.userId = localStorage.getItem('user_id');
        if (this.userId) {
            this.fetchAccounts(this.userId);
            this.fetchBankList();
        } else {
            console.error('ユーザーIDがローカルストレージに見つかりません。');
        }
    },
    methods: {
        ...mapActions([
            'fetchAccounts',
            'createAccount',
            'updateAccount',
            'deleteAccount',
            'fetchBankList',
        ]),
        formatDate(date) {
            return moment(date).format('YYYY-MM-DD');
        },
        showCreateModal() {
            this.newAccount.user_id = this.userId;
            this.isCreateModalVisible = true;
        },
        submitCreateAccount() {
            this.createAccount(this.newAccount).then(() => {
                this.isCreateModalVisible = false;
                this.newAccount = { name: '', balance: 0, user_id: null };
            });
        },
        showUpdateModal(account) {
            this.selectedAccount = { ...account };
            this.isUpdateModalVisible = true;
        },
        submitUpdateAccount() {
            this.updateAccount(this.selectedAccount).then(() => {
                this.isUpdateModalVisible = false;
                this.selectedAccount = { id: null, name: '', balance: 0 };
            });
        },
        showDeleteModal(account) {
            this.selectedAccount = { ...account };
            this.isDeleteModalVisible = true;
        },
        submitDeleteAccount() {
            this.deleteAccount(this.selectedAccount.id).then(() => {
                this.isDeleteModalVisible = false;
                this.selectedAccount = { id: null, name: '', balance: 0 };
            });
        },
        viewTransactions(account) {
            const userId = localStorage.getItem('user_id');
            if (!userId) {
                console.error('user_idが見つかりません');
                return;
            }
            this.$router.push({
                name: 'TransactionPage',
                params: { userId: Number(userId), accountId: account.id }
            });
        },
    }
};
</script>

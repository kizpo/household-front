<template>
    <div>
        <br><br><h1>カテゴリ一覧</h1><br><br>
        <b-button @click="showCreateModal" variant="success">新規作成</b-button>
        <b-table v-if="categories.length" :items="categories" :fields="fields">
            <template #cell(actions)="data">
                <b-button @click="showUpdateModal(data.item)" variant="warning">更新</b-button>
                <b-button @click="showDeleteModal(data.item)" variant="danger">削除</b-button>
            </template>

            <template #cell(created_at)="data">
                {{ formatDate(data.item.created_at) }}
            </template>

            <template #cell(updated_at)="data">
                {{ formatDate(data.item.updated_at) }}
            </template>
        </b-table>

        <b-alert v-if="error" variant="danger">{{ error }}</b-alert>



        <!-- 新規作成モーダル -->
        <b-modal v-model="isCreateModalVisible" title="カテゴリの作成" hide-footer>
            <b-form @submit.prevent="submitCreateCategory">
                <b-form-group label="カテゴリ名">
                    <b-form-input v-model="newCategory.name" required></b-form-input>
                </b-form-group>
                <input type="hidden" v-model="newCategory.user_id" />
                <b-button type="submit" variant="primary">作成</b-button>
                <b-button @click="isCreateModalVisible = false" variant="secondary">キャンセル</b-button>
            </b-form>
        </b-modal>

        <!-- 更新モーダル -->
        <b-modal v-model="isUpdateModalVisible" title="カテゴリの更新" hide-footer>
            <b-form @submit.prevent="submitUpdateCategory">
                <b-form-group label="カテゴリID">
                    <b-form-input v-model="selectedCategory.id" type="number" disabled></b-form-input>
                </b-form-group>
                <b-form-group label="カテゴリ名">
                    <b-form-input v-model="selectedCategory.name" required></b-form-input>
                </b-form-group>
                <b-button type="submit" variant="primary">更新</b-button>
                <b-button @click="isUpdateModalVisible = false" variant="secondary">キャンセル</b-button>
            </b-form>
        </b-modal>

        <!-- 削除モーダル -->
        <b-modal v-model="isDeleteModalVisible" title="カテゴリの削除" hide-footer>
            <b-form @submit.prevent="submitDeleteCategory">
                <b-form-group label="カテゴリID">
                    <b-form-input v-model="selectedCategory.id" type="number" disabled></b-form-input>
                </b-form-group>
                <b-form-group label="カテゴリ名">
                    <b-form-input v-model="selectedCategory.name" disabled></b-form-input>
                </b-form-group>
                <b-button type="submit" variant="danger">削除</b-button>
                <b-button @click="isDeleteModalVisible = false" variant="secondary">キャンセル</b-button>
            </b-form>
        </b-modal>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import moment from 'moment';

export default {
    data() {
        return {
            userId: '',
            newCategory: {
                name: '',
                user_id: null
            },
            selectedCategory: {
                id: null,
                name: ''
            },
            isCreateModalVisible: false,
            isUpdateModalVisible: false,
            isDeleteModalVisible: false,
            fields: [
                //{ key: 'id', label: 'ID' },
                { key: 'name', label: '名前' },
                { key: 'created_at', label: '作成日時' },
                { key: 'updated_at', label: '更新日時' },
                { key: 'actions', label: '操作' }
            ]
        };
    },
    computed: {
        ...mapGetters(['categories', 'error'])
    },
    created() {
        this.userId = localStorage.getItem('user_id');
        if (this.userId) {
            this.fetchCategories();
        } else {
            this.error = 'ユーザーIDがローカルストレージに見つかりません。';
        }
    },
    methods: {
        ...mapActions([
            'fetchCategories',
            'createCategory',
            'updateCategory',
            'deleteCategory'
        ]),
        formatDate(date) {
            return moment(date).format('YYYY-MM-DD');
        },
        showCreateModal() {
            this.newCategory.user_id = this.userId;
            this.isCreateModalVisible = true;
        },
        submitCreateCategory() {
            this.createCategory(this.newCategory).then(() => {
                this.isCreateModalVisible = false;
                this.newCategory = { name: '', user_id: null };
                this.fetchCategories();
            });
        },
        showUpdateModal(category) {
            this.selectedCategory = { ...category };
            this.isUpdateModalVisible = true;
        },
        submitUpdateCategory() {
            this.updateCategory(this.selectedCategory).then(() => {
                this.isUpdateModalVisible = false;
                this.selectedCategory = { id: null, name: '' };
                this.fetchCategories();
            });
        },
        showDeleteModal(category) {
            this.selectedCategory = { ...category };
            this.isDeleteModalVisible = true;
        },
        submitDeleteCategory() {
            this.deleteCategory(this.selectedCategory.id).then(() => {
                this.isDeleteModalVisible = false;
                this.selectedCategory = { id: null, name: '' };
                this.fetchCategories();
            });
        }
    }
};
</script>

<style scoped>
</style>

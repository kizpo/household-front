<template>
    <div>
        <br><h1>取引一覧</h1><br>

        <b-button variant="success" @click="showCreateModal">新規作成</b-button>

        <!-- 新規作成更新モーダル -->
        <b-modal v-model="isCUModalVisible" :title="isCreate ? '取引の作成' : '取引の更新'" hide-footer>
            <b-form @submit.prevent="isCreate ? submitCreateTransaction() : submitUpdateTransaction()">
                <b-form-group label="取引名">
                    <b-form-input v-model="transaction.name" required></b-form-input>
                </b-form-group>
                <b-form-group label="収入">
                    <b-form-input v-model="transaction.income" type="number"></b-form-input>
                </b-form-group>
                <b-form-group label="支出">
                    <b-form-input v-model="transaction.expense" type="number"></b-form-input>
                </b-form-group>
                <b-form-group label="日付">
                    <b-form-input v-model="transaction.date" type="date"></b-form-input>
                </b-form-group>
                <b-form-group label="カテゴリ">
                    <b-form-select v-model="transaction.category_id" :options="categoryOptions" required></b-form-select>
                </b-form-group>

                <div v-if="isCreate">
                    <strong>作成後の残高: {{ calculatedTotal }}</strong>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <strong>現在の残高: {{ currentBalance }}</strong>
                </div>

                <b-button type="submit" variant="primary">{{ isCreate ? '作成' : '更新' }}</b-button>
                <b-button @click="isCUModalVisible = false" variant="secondary">キャンセル</b-button>
            </b-form>
        </b-modal>

        <!-- 削除モーダル -->
        <b-modal v-model="isDeleteModalVisible" title="取引の削除" hide-footer>
            <b-form @submit.prevent="submitDeleteTransaction">
                <b-form-group label="取引ID">
                    <b-form-input v-model="transaction.id" type="number" disabled></b-form-input>
                </b-form-group>

                <b-button type="submit" variant="danger">削除</b-button>
                <b-button @click="isDeleteModalVisible = false" variant="secondary">キャンセル</b-button>
            </b-form>
        </b-modal>

        <!-- ApexChart -->
        <div class="charts-arrangement">
            <div>
                <apexchart
                    width="500"
                    type="area"
                    :options="chartOptionsOfBalance"
                    :series="series">
                </apexchart>
            </div>

            <div>
                <apexchart
                    width="400"
                    type="donut"
                    :options="chartOptionsOfIncome"
                    :series="seriesOfIncome">
                </apexchart>
            </div>

            <div>
                <apexchart
                    width="400"
                    type="donut"
                    :options="chartOptionsOfExpense"
                    :series="seriesOfExpense">
                </apexchart>
            </div>
        </div>


        <!-- 取引テーブル -->
        <b-table v-if="transactionsWithCategoryNames.length" :items="transactionsWithCategoryNames" :fields="fields">
            <template #cell(category_name)="data">
                {{ data.item.category_name }}
            </template>
            <template #cell(actions)="data">
                <b-button variant="warning" @click="showUpdateModal(data.item)">更新</b-button>
                <b-button variant="danger" @click="showDeleteModal(data.item)">削除</b-button>
            </template>
        </b-table>

        <b-alert v-if="error" variant="danger">{{ error }}</b-alert>
    </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import VueApexCharts from "vue-apexcharts";

export default {
    components: {
        apexchart: VueApexCharts
    },
    props: {
        userId: {
            type: Number,
            required: true
        },
        accountId: {
            type: Number,
            required: true
        }
    },
    data() {
        return {
            //isCreateModalVisible: false,
            //isUpdateModalVisible: false,
            isDeleteModalVisible: false,
            isCUModalVisible: false,
            transaction: {
                id: null,
                name: '',
                income: 0,
                expense: 0,
                date: '',
                account_id: this.accountId,
                category_id: null,
                user_id: this.userId
            },
            series: [],
            seriesOfIncome: [],
            seriesOfExpense: [],
            error: null,
            fields: [
                //{ key: 'id', label: 'ID' },
                { key: 'name', label: '取引名' },
                { key: 'income', label: '収入' },
                { key: 'expense', label: '支出' },
                { key: 'date', label: '取引日' },
                { key: 'category_name', label: 'カテゴリ' },
                { key: 'actions', label: '操作' }
            ],
            chartOptionsOfBalance: {
                chart: {
                    type: 'area',
                    height: 300,
                    zoom: {
                        enabled: false
                    }
                },
                stroke: {
                    curve: 'straight'
                },
                title: {
                    text: '残高推移',
                    align: 'center'
                },
                xaxis: {
                    categories: []
                },
                yaxis: {
                    title: {
                        text: '残高 (円)'
                    }
                }
            },
            chartOptionsOfIncome: {
                chart: {
                    type: 'donut'
                },
                labels: [],
                title: {
                    text: 'カテゴリ別収入割合',
                    align: 'center'
                },
                legend: {
                    position: 'bottom'
                },
                responsive: [{
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 300
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }]
            },
            chartOptionsOfExpense: {
                chart: {
                    type: 'donut'
                },
                labels: [],
                title: {
                    text: 'カテゴリ別支出割合',
                    align: 'center'
                },
                legend: {
                    position: 'bottom'
                },
                responsive: [{
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 300
                        },
                        legend: {
                            position: 'bottom'
                        }
                    }
                }]
            },
        };
    },
    computed: {
        ...mapGetters('transactions', [
            'transactionsWithCategoryNames',
            'categoryOptions'
        ]),
        calculatedTotal() {
            const income = Number(this.transaction.income) || 0;
            const expense = Number(this.transaction.expense) || 0;
            return this.currentBalance + income - expense;
        },
        currentBalance() {
            return this.transactionsWithCategoryNames.reduce((acc, transaction) => {
                return acc + transaction.income - transaction.expense;
            }, 0);
        }
    },
    mounted() {
        this.fetchData();
    },
    watch: {
        transactionsWithCategoryNames: {
            handler: function () {
                this.updateChart();
                this.updateChartOfIncome();
                this.updateChartOfExpense();
            },
        immediate: true
        },
    },
    methods: {
        ...mapActions('transactions', [
            'fetchTransactions',
            'fetchCategories',
            'createTransaction',
            'updateTransaction',
            'deleteTransaction'
        ]),
        fetchData() {
            this.fetchTransactions({ userId: this.userId, accountId: this.accountId })
                .then(() => {
                    //this.updateChart();
                });
            this.fetchCategories(this.userId);
        },
        showCreateModal() {
            this.isCreate = true;
            this.resetTransactionForm();
            this.isCUModalVisible = true;
            //this.isCreateModalVisible = true;
        },
        showUpdateModal(transaction) {
            this.isCreate = false;
            this.transaction = {
                id: transaction.id,
                name: transaction.name,
                income: transaction.income,
                expense: transaction.expense,
                date: transaction.date,
                account_id: this.accountId,
                category_id: transaction.category_id,
                user_id: this.userId
            };
            this.isCUModalVisible = true;
            //this.isUpdateModalVisible = true;
        },
        showDeleteModal(transaction) {
            this.transaction.id = transaction.id;
            this.isDeleteModalVisible = true;
        },
        resetTransactionForm() {
            this.transaction = {
                id: null,
                name: '',
                income: 0,
                expense: 0,
                date: '',
                account_id: this.accountId,
                category_id: null,
                user_id: this.userId
            };
        },
        updateChart() {
            const dailyTotals = this.transactionsWithCategoryNames.reduce((acc, transaction) => {
                const date = transaction.date;
                if (!acc[date]) {
                    acc[date] = { income: 0, expense: 0 };
                }
                acc[date].income += transaction.income;
                acc[date].expense += transaction.expense;
                return acc;
            }, {});

            const dates = Object.keys(dailyTotals).sort();
            let cumulativeBalance = 0;
            const balances = dates.map(date => {
                const dailyIncome = dailyTotals[date].income;
                const dailyExpense = dailyTotals[date].expense;
                cumulativeBalance += dailyIncome - dailyExpense;
                return cumulativeBalance;
            });

            this.series = [
                {
                    name: '残高',
                    data: balances
                }
            ];
            this.chartOptionsOfBalance = {
                ...this.chartOptionsOfBalance,
                xaxis: {
                    categories: dates
                }
            };
        },
        updateChartOfIncome() {
            const categoryIncomeTotals = this.transactionsWithCategoryNames.reduce((acc, transaction) => {
                if (transaction.income > 0) {
                    const categoryName = transaction.category_name;
                    if (!acc[categoryName]) {
                        acc[categoryName] = 0;
                    }
                    acc[categoryName] += transaction.income;
                }
                //console.log('acc:', acc);
                return acc;
            }, {});
            this.seriesOfIncome = Object.values(categoryIncomeTotals);
            this.chartOptionsOfIncome = {
                ...this.chartOptionsOfIncome,
                labels: Object.keys(categoryIncomeTotals)
            };
        },
        updateChartOfExpense() {
            const categoryIncomeTotals = this.transactionsWithCategoryNames.reduce((acc, transaction) => {
                if (transaction.expense > 0) {
                    const categoryName = transaction.category_name;
                    if (!acc[categoryName]) {
                        acc[categoryName] = 0;
                    }
                    acc[categoryName] += transaction.expense;
                }
                return acc;
            }, {});
            this.seriesOfExpense = Object.values(categoryIncomeTotals);
            this.chartOptionsOfExpense = {
                ...this.chartOptionsOfExpense,
                labels: Object.keys(categoryIncomeTotals)
            };
        },
        submitCreateTransaction() {
            this.createTransaction(this.transaction)
                .then(() => {
                    this.isCUModalVisible = false;
                    //this.isCreateModalVisible = false;
                    this.resetTransactionForm();
                    //this.fetchData();
                })
                .catch(error => {
                    this.error = error.message;
                });
        },
        submitUpdateTransaction() {
            this.updateTransaction(this.transaction)
                .then(() => {
                    this.isCUModalVisible = false;
                    //this.isUpdateModalVisible = false;
                    //this.fetchData();
                })
                .catch(error => {
                    this.error = error.message;
                });
        },
        submitDeleteTransaction() {
            this.deleteTransaction(this.transaction.id)
                .then(() => {
                    this.isDeleteModalVisible = false;
                    //this.fetchData();
                })
                .catch(error => {
                    this.error = error.message;
                });
        }
    }
};
</script>

<style scoped>
.charts-arrangement {
    display: flex;
    justify-content: center;
    width: 100%;
}
</style>

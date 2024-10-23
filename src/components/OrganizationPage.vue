<template>
  <div>
    <h1>Organization Page</h1>

    <!-- 表の表示 -->
    <b-table :items="organizations" :fields="fields"></b-table>

    <!-- CRUD 操作フォーム -->
    <b-tabs v-model="activeTab" pills>
      <b-tab title="Create">
        <b-form @submit.prevent="createOrganization">
          <b-form-group label="Name">
            <b-form-input v-model="createName" required></b-form-input>
          </b-form-group>

          <b-form-group label="Location">
            <b-form-input v-model="createLocation" required></b-form-input>
          </b-form-group>

          <b-button type="submit" variant="primary">Create</b-button>
        </b-form>
      </b-tab>

      <b-tab title="Read">
        <b-form @submit.prevent="fetchOrganization">
          <b-form-group label="ID">
            <b-form-input v-model="readId" type="number" required></b-form-input>
          </b-form-group>

          <b-button type="submit" variant="primary">Read</b-button>
        </b-form>

        <div v-if="organization">
          <h2><br><br>参照結果<br></h2>
          <p><strong>Name:</strong> {{ organization.name }}</p>
          <p><strong>Location:</strong> {{ organization.location }}</p>
        </div>
      </b-tab>

      <b-tab title="Update">
        <b-form @submit.prevent="updateOrganization">
          <b-form-group label="ID">
            <b-form-input v-model="updateId" type="number" required></b-form-input>
          </b-form-group>

          <b-form-group label="New Name">
            <b-form-input v-model="updateName" required></b-form-input>
          </b-form-group>

          <b-form-group label="New Location">
            <b-form-input v-model="updateLocation" required></b-form-input>
          </b-form-group>

          <b-button type="submit" variant="primary">Update</b-button>
        </b-form>
      </b-tab>

      <b-tab title="Delete">
        <b-form @submit.prevent="deleteOrganization">
          <b-form-group label="ID">
            <b-form-input v-model="deleteId" type="number" required></b-form-input>
          </b-form-group>

          <b-button type="submit" variant="primary">Delete</b-button>
        </b-form>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  data() {
    return {
      fields: [
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Name' },
        { key: 'location', label: 'Location' }
      ],
      activeTab: 0,
      createName: '',
      createLocation: '',
      readId: '',
      organization: null,
      updateId: '',
      updateName: '',
      updateLocation: '',
      deleteId: ''
    };
  },
  computed: {
    ...mapGetters('organizations', ['organizations'])
  },
  created() {
    this.fetchOrganizations();
  },
  methods: {
    ...mapActions('organizations', [
      'fetchOrganizations',
      'createOrganization',
      'fetchOrganization',
      'updateOrganization',
      'deleteOrganization'
    ]),
    fetchOrganizations() {
      this.$store.dispatch('organizations/fetchOrganizations');
    },
    createOrganization() {
      this.$store.dispatch('organizations/createOrganization', {
        name: this.createName,
        location: this.createLocation
      }).then(() => {
        this.createName = '';
        this.createLocation = '';
        this.fetchOrganizations();
        alert('データの作成に成功しました');
      }).catch(error => {
        console.error('There was an error!', error);
        alert('エラーが発生しました');
      });
    },
    fetchOrganization() {
      this.$store.dispatch('organizations/fetchOrganization', this.readId)
        .then(() => {
          this.organization = this.$store.getters['organizations/organization'];
        })
        .catch(error => {
          console.error('There was an error!', error);
          alert('データが見つかりません');
        });
    },
    updateOrganization() {
      this.$store.dispatch('organizations/updateOrganization', {
        id: this.updateId,
        organization: {
          name: this.updateName,
          location: this.updateLocation
        }
      }).then(() => {
        this.updateId = '';
        this.updateName = '';
        this.updateLocation = '';
        this.fetchOrganizations();
        alert('データの更新に成功しました');
      }).catch(error => {
        console.error('There was an error!', error);
        alert('エラーが発生しました');
      });
    },
    deleteOrganization() {
      this.$store.dispatch('organizations/deleteOrganization', this.deleteId)
        .then(() => {
          this.deleteId = '';
          this.fetchOrganizations();
          alert('データの削除に成功しました');
        })
        .catch(error => {
          console.error('There was an error!', error);
          alert('エラーが発生しました');
        });
    }
  }
};
</script>

<style scoped>
/* スタイルを必要に応じて追加 */
</style>

<template>
<div>
<h1>Top Page</h1>
    <b-table :items="people" :fields="fields"></b-table>
</div>
</template>

<script>
import axios from 'axios';

export default {
data() {
    return {
    people: [],
    fields: [
        { key: 'name', label: 'Name' },
        { key: 'age', label: 'Age' },
        { key: 'address', label: 'Address' }
    ]
    };
},
created() {
    this.fetchPeople();
},
methods: {
    fetchPeople() {
    axios.get('http://localhost:3000/api/v1/people')
        .then(response => {
        this.people = response.data;
        })
        .catch(error => {
        console.error('There was an error!', error);
        });
    }
}
};
</script>

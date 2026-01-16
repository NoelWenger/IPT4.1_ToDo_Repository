<template>
  <div class="login-container">
    <div class="login-card">
      <h2>Mini-ToDo</h2>
      <input v-model="firstName" placeholder="Vorname" />
      <input v-model="lastName" placeholder="Nachname" />
      <button @click="handleLogin" class="btn-primary">Login!</button>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import api from '@/api';

const emit = defineEmits(['login-success']);
const firstName = ref('');
const lastName = ref('');

const handleLogin = async () => {
  const user = await api.loginUser(firstName.value, lastName.value);
  if (user) {
    emit('login-success', user);
  } else {
    alert("Benutzer nicht gefunden!");
  }
};
</script>

<style scoped>
.login-container {
  height: 80vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login-card {
  text-align: center;
}
.login-card input {
  display: block;
  margin: 10px auto;
  padding: 15px;
  border-radius: 25px;
  border: 1px solid #ccc;
  background-color: var(--sage-green);
  width: 200px;
  text-align: center;
}
.btn-primary {
  padding: 15px 40px;
  border-radius: 25px;
  border: none;
  background-color: var(--sage-green);
  cursor: pointer;
  font-weight: bold;
}
</style>
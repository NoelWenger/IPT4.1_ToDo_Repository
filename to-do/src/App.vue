<template>
  <div id="app">
    <header v-if="$route.path !== '/'" class="main-header">
      <div class="header-content">
        <h1>Mini-ToDo</h1>
        <div class="user-info">
          <span>User: {{ currentUser?.first_name }}</span>
          <button @click="logout" class="logout-btn">Logout</button>
        </div>
      </div>
    </header>
    <main>
      <router-view @login-success="setUser"></router-view>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const currentUser = ref(JSON.parse(localStorage.getItem('user')));

const setUser = (user) => {
  currentUser.value = user;
  localStorage.setItem('user', JSON.stringify(user));
  router.push('/dashboard');
};

const logout = () => {
  currentUser.value = null;
  localStorage.removeItem('user');
  router.push('/');
};
</script>

<style>
:root {
  --sage-green: #90af94;
  --dark-green: #6b846e;
  --white: #ffffff;
}

body {
  font-family: Arial, sans-serif;
  margin: 0;
  background-color: #f4f7f5;
}

.main-header {
  background-color: var(--sage-green);
  padding: 1rem 2rem;
  color: black;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1000px;
  margin: 0 auto;
}

.logout-btn {
  background: none;
  border: none;
  font-weight: bold;
  cursor: pointer;
  margin-left: 20px;
}
</style>
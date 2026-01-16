<template>
  <div id="app">
    <router-view @login-success="setUser"></router-view>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const setUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
  router.push('/dashboard');
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
  background-color: #f4f7f5;
  font-family: 'Segoe UI', Arial, sans-serif;
}
</style>
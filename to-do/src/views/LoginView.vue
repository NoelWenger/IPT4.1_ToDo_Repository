<script setup>
import { ref } from 'vue';
import api from '@/api';

const emit = defineEmits(['login-success']);
const firstName = ref('');
const lastName = ref('');
const isRegisterMode = ref(false);

const handleAction = async () => {
  if (!firstName.value || !lastName.value) return alert("Felder ausfüllen!");

  try {
    if (isRegisterMode.value) {
      const newUser = await api.createUser(firstName.value, lastName.value);
      emit('login-success', newUser);
    } else {
      const user = await api.loginUser(firstName.value, lastName.value);
      if (user) emit('login-success', user);
      else alert("Benutzer nicht gefunden!");
    }
  } catch (e) { alert("Fehler beim Login/Register"); }
};
</script>

<template>
  <div class="login-container">
    <div class="login-card">
      <h2>{{ isRegisterMode ? 'Konto erstellen' : 'Mini-ToDo Login' }}</h2>
      <input v-model="firstName" placeholder="Vorname" class="login-input" />
      <input v-model="lastName" placeholder="Nachname" class="login-input" />

      <button @click="handleAction" class="btn-primary">
        {{ isRegisterMode ? 'Registrieren' : 'Login!' }}
      </button>

      <p class="toggle-link" @click="isRegisterMode = !isRegisterMode">
        {{ isRegisterMode ? 'Doch lieber einloggen?' : 'Noch kein Konto? Hier registrieren' }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-container { height: 100vh; display: flex; justify-content: center; align-items: center; background: #e8eee9; }
.login-card { background: white; padding: 40px; border-radius: 20px; text-align: center; width: 300px; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
.login-input { display: block; width: 100%; margin: 10px 0; padding: 12px; border-radius: 25px; border: 1px solid #ccc; background: #8fb99c; color: white; text-align: center; box-sizing: border-box; }
.login-input::placeholder { color: rgba(255,255,255,0.7); }
.btn-primary { background: #6b846e; color: white; border: none; padding: 12px 30px; border-radius: 25px; cursor: pointer; font-weight: bold; width: 100%; margin-top: 10px; }
.toggle-link { margin-top: 15px; font-size: 0.8rem; cursor: pointer; text-decoration: underline; color: #666; }
</style>
<template>
  <div class="form-container">
    <h2>Neue Aufgabe/Bearbeiten</h2>
    <div class="form-card">
      <input v-model="newTask.title" placeholder="Titel" />

      ```
      <select v-model="newTask.category_id">
        <option v-for="c in categories" :key="c.category_id" :value="c.category_id">
          {{ c.name }}
        </option>
      </select>

      <textarea v-model="newTask.description" placeholder="Beschreibung"></textarea>

      <input type="date" v-model="newTask.due_date" />

      <select v-model="newTask.priority">
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <button @click="saveTask" class="submit-btn">Hinzufügen!</button>
    </div>

    ```

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/api';

const router = useRouter();
const categories = ref([]);
const newTask = ref({
  title: '',
  description: '',
  due_date: '',
  category_id: null,
  priority: 'medium',
  users_id: JSON.parse(localStorage.getItem('user'))?.users_id
});

onMounted(async () => {
  categories.value = await api.getCategories();
});

const saveTask = async () => {
  await api.createTask(newTask.value);
  await router.push('/dashboard');
};
</script>

<style scoped>
.form-container { text-align: center; margin-top: 40px; }
.form-card { background-color: var(--sage-green); display: inline-block; padding: 40px; border-radius: 20px; width: 400px; }
.form-card input, .form-card select, .form-card textarea {
  width: 100%; margin-bottom: 15px; padding: 10px; border-radius: 5px; border: none;
}
.submit-btn { background: white; padding: 10px 30px; border-radius: 10px; border: none; font-weight: bold; cursor: pointer; }
</style>
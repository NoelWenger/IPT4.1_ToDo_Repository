<script setup>
import { ref, onMounted } from "vue";
import api from "@/api/api";

const tasks = ref([]);

onMounted(async () => {
  try {
    const response = await api.get("/task");
    tasks.value = response.data;
  } catch (error) {
    console.error("Fehler beim Laden der Tasks:", error);
  }
});
</script>

<template>
  <h1>Aufgaben</h1>

  <table border="1" cellpadding="8">
    <thead>
    <tr>
      <th>ID</th>
      <th>Titel</th>
      <th>Beschreibung</th>
      <th>Priorität</th>
      <th>Fällig am</th>
      <th>Erledigt</th>
    </tr>
    </thead>

    <tbody>
    <tr v-for="task in tasks" :key="task.task_id">
      <td>{{ task.task_id }}</td>
      <td>{{ task.title }}</td>
      <td>{{ task.description }}</td>
      <td>{{ task.priority }}</td>
      <td>{{ task.due_date }}</td>
      <td>{{ task.done ? "✅" : "❌" }}</td>
    </tr>
    </tbody>
  </table>
</template>

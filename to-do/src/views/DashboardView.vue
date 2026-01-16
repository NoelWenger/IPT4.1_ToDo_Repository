<script setup>
import { ref, onMounted } from "vue";
import api from "@/api.js";
import { useRouter } from "vue-router";

const router = useRouter();
const tasks = ref([]);
const user = ref({ first_name: "", last_name: "" }); // eingeloggter User

// Tasks und User laden
onMounted(async () => {
  // 1️⃣ User aus localStorage abrufen
  const storedUser = localStorage.getItem("user");
  if (!storedUser) {
    await router.push("/login"); // kein User -> Login erzwingen
    return;
  }
  user.value = JSON.parse(storedUser);

  // 2️⃣ Tasks laden
  try {
    tasks.value = await api.getTasks();
  } catch (error) {
    console.error("Fehler beim Laden der Tasks:", error);
  }
});

// 3️⃣ Logout-Funktion
const logout = () => {
  localStorage.removeItem("user");// User löschen
  tasks.value = [];
  router.push("/login");           // zurück zum Login
};
</script>



<template>
  <div class="task-page">

    <!-- Header -->
    <header class="header">
      <span>Mini-ToDo</span>
      <div class="header-right">
        <!-- eingeloggter Benutzer -->
        <span>{{ user.first_name }} {{ user.last_name }}</span>
        <!-- Logout -->
        <span @click="logout" class="logout-btn">Logout</span>
      </div>
    </header>


    <!-- Content -->
    <div class="content">

      <!-- Add Button -->
      <button class="add-task">+ Aufgabe</button>

      <!-- Filter Box -->
      <div class="filters">
        <span>Status [ offen + ]</span>
        <span>Priorität [ alle + ]</span>
        <span>Kategorie [ alle + ]</span>
        <span>User ⬛</span>
      </div>

      <!-- Task List -->
      <div class="task-list">
        <div
            v-for="task in tasks"
            :key="task.task_id"
            class="task-item"
        >
          <input type="checkbox" :checked="task.done" />

          <div class="title">
            {{ task.title }}
          </div>

          <div class="due-date">
            {{ task.due_date }}
          </div>

          <div
              class="priority"
              :class="task.priority"
          ></div>

          <button class="expand">+</button>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
.task-page {
  font-family: Arial, sans-serif;
}

.header {
  background: #8fb99c;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  font-weight: bold;
}

.header-right span {
  margin-left: 20px;
}

.content {
  padding: 30px;
}

.add-task {
  background: #8fb99c;
  border: none;
  padding: 15px 25px;
  border-radius: 15px;
  cursor: pointer;
}

.filters {
  background: #8fb99c;
  margin: 20px 0;
  padding: 20px;
  display: flex;
  gap: 30px;
  border-radius: 15px;
}

.task-list {
  background: #8fb99c;
  padding: 20px;
  border-radius: 15px;
}

.task-item {
  display: grid;
  grid-template-columns: 40px 1fr 150px 40px 40px;
  align-items: center;
  padding: 10px 0;
}

.priority {
  width: 30px;
  height: 30px;
  border-radius: 5px;
}

/* Priorität aus DB */
.priority.high {
  background: red;
}

.priority.medium {
  background: gold;
}

.priority.low {
  background: green;
}

.expand {
  border: none;
  background: transparent;
  font-size: 20px;
  cursor: pointer;
}
</style>
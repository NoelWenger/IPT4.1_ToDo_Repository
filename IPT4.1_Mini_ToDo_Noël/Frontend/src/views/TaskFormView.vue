<template>
  <div class="app-wrapper">
    <header class="glass-header">
      <div class="header-container">
        <button @click="router.push('/dashboard')" class="btn-back">
          <span class="icon">←</span>
          <span class="text">Zurück</span>
        </button>
        <span class="page-title">{{ isEditMode ? 'Aufgabe bearbeiten' : 'Neue Aufgabe' }}</span>
        <div class="spacer"></div>
      </div>
    </header>

    <main class="main-content">
      <div class="form-container">
        <div class="form-card">

          <div class="form-group">
            <label>Titel der Aufgabe</label>
            <input v-model="task.title" placeholder="Was ist zu tun?" class="input-field" />
          </div>

          <div class="form-group">
            <label>Kategorie</label>
            <div class="category-row">
              <select v-if="!isNewCat" v-model="task.category_id" class="input-field select">
                <option :value="null">Kategorie wählen</option>
                <option v-for="c in categories" :key="c.category_id" :value="c.category_id">
                  {{ c.name }}
                </option>
              </select>
              <input v-else v-model="newCatName" placeholder="Neue Kategorie..." class="input-field" />
              <button @click="isNewCat = !isNewCat" class="plus-btn" type="button">
                {{ isNewCat ? '✕' : '+' }}
              </button>
            </div>
          </div>

          <div class="form-group">
            <label>Beschreibung (optional)</label>
            <textarea v-model="task.description" placeholder="Details hinzufügen..." class="input-field textarea"></textarea>
          </div>

          <div class="grid-row">
            <div class="form-group">
              <label>Fällig am</label>
              <input type="date" v-model="task.due_date" class="input-field" />
            </div>

            <div class="form-group">
              <label>Priorität</label>
              <select v-model="task.priority" class="input-field">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <button @click="save" class="submit-btn">
            {{ isEditMode ? 'Änderungen speichern' : 'Aufgabe hinzufügen' }}
          </button>

        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '@/api';

const router = useRouter();
const route = useRoute();

const categories = ref([]);
const isNewCat = ref(false);
const newCatName = ref("");
const isEditMode = ref(false);

const task = ref({
  title: '',
  description: '',
  due_date: new Date().toISOString().split('T')[0],
  priority: 'medium',
  category_id: null,
  users_id: null
});

onMounted(async () => {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) return router.push("/");
  const u = JSON.parse(storedUser);
  task.value.users_id = u.users_id;

  try {
    categories.value = await api.getCategories();
  } catch (e) {
    console.error("Fehler beim Laden der Kategorien", e);
  }

  if (route.params.id) {
    isEditMode.value = true;
    try {
      const existing = await api.getTaskById(route.params.id);
      if (existing) task.value = existing;
    } catch (e) {
      console.error("Fehler beim Laden der Aufgabe", e);
    }
  }
});

const save = async () => {
  if (!task.value.title) return alert("Bitte gib einen Titel ein!");

  try {
    if (isNewCat.value && newCatName.value.trim()) {
      const nc = await api.createCategory(newCatName.value.trim());
      task.value.category_id = nc.category_id;
    }

    if (isEditMode.value) {
      await api.updateTask(route.params.id, task.value);
    } else {
      await api.createTask(task.value);
    }
    router.push('/dashboard');
  } catch (e) {
    alert("Speichern fehlgeschlagen. Prüfe die Verbindung.");
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');

.app-wrapper {
  font-family: 'Inter', sans-serif;
  background-color: #f8faf9;
  min-height: 100vh;
  color: #2d3748;
}

.glass-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(143, 185, 156, 0.9);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.3);
  padding: 10px 0;
}

.header-container {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.page-title { font-weight: 700; font-size: 1.1rem; color: #1a202c; }

.btn-back {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: #1a202c;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-back:hover {
  background: rgba(255, 255, 255, 0.4);
  transform: translateX(-3px);
}

.spacer { width: 90px; }

/* --- Formular Card --- */
.form-container {
  display: flex;
  justify-content: center;
  padding: 40px 20px;
}

.form-card {
  background: white;
  padding: 40px;
  border-radius: 24px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  border: 1px solid #edf2f0;
}

.form-group { margin-bottom: 22px; }
.form-group label {
  display: block;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  color: #a0aec0;
  margin-bottom: 8px;
  letter-spacing: 0.5px;
}

.input-field {
  width: 100%;
  padding: 12px 15px;
  border-radius: 12px;
  border: 1.5px solid #edf2f7;
  background: #f8fafc;
  font-size: 1rem;
  outline: none;
  box-sizing: border-box;
  transition: 0.2s;
  font-family: inherit;
}

.input-field:focus {
  border-color: #8fb99c;
  background: white;
  box-shadow: 0 0 0 4px rgba(143, 185, 156, 0.1);
}

.category-row { display: flex; gap: 10px; }
.plus-btn {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  border: none;
  background: #ebf4ef;
  color: #6b846e;
  cursor: pointer;
  font-size: 1.2rem;
  font-weight: bold;
  transition: 0.2s;
}
.plus-btn:hover { background: #dcece4; }

.grid-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

.textarea { min-height: 100px; resize: none; }

.submit-btn {
  width: 100%;
  padding: 16px;
  border-radius: 14px;
  border: none;
  background: #6b846e;
  color: white;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 15px;
  box-shadow: 0 4px 12px rgba(107, 132, 110, 0.3);
  transition: all 0.3s ease;
}

.submit-btn:hover {
  background: #5a6f5c;
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(107, 132, 110, 0.4);
}

.submit-btn:active { transform: translateY(0); }
</style>
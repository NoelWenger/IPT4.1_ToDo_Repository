<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router'; // useRoute hinzugefügt
import api from '@/api';

const router = useRouter();
const route = useRoute(); // Um auf die ID in der URL zuzugreifen

const categories = ref([]);
const isNewCat = ref(false);
const newCatName = ref("");

// Das reaktive Objekt für die Aufgabe
const task = ref({
  title: '',
  description: '',
  due_date: new Date().toISOString().split('T')[0],
  priority: 'medium',
  category_id: null,
  users_id: null
});

// Prüfen, ob wir im Bearbeitungsmodus sind
const isEditMode = ref(false);

onMounted(async () => {
  const u = JSON.parse(localStorage.getItem('user'));
  if (!u) return router.push("/");
  task.value.users_id = u.users_id;

  // Kategorien laden
  categories.value = await api.getCategories();

  // BEARBEITUNGS-LOGIK:
  if (route.params.id) {
    isEditMode.value = true;
    try {
      const existingTask = await api.getTaskById(route.params.id);
      if (existingTask) {
        task.value = existingTask;
      }
    } catch (e) {
      console.error("Fehler beim Laden der Aufgabe", e);
    }
  }
});

const save = async () => {
  if (!task.value.title) return alert("Titel fehlt!");

  // Neue Kategorie erstellen, falls gewünscht
  if (isNewCat.value && newCatName.value) {
    const nc = await api.createCategory(newCatName.value);
    task.value.category_id = nc.category_id;
  }

  try {
    if (isEditMode.value) {
      // Vorhandene Aufgabe aktualisieren
      await api.updateTask(route.params.id, task.value);
    } else {
      // Neue Aufgabe erstellen
      await api.createTask(task.value);
    }
    router.push('/dashboard');
  } catch (e) {
    alert("Fehler beim Speichern!");
  }
};
</script>

<template>
  <div class="form-page">
    <header class="header">
      <span @click="router.push('/dashboard')" style="cursor:pointer">← Zurück</span>
      <!-- Dynamischer Titel -->
      <span>{{ isEditMode ? 'Aufgabe bearbeiten' : 'Neue Aufgabe' }}</span>
      <span></span>
    </header>

    <div class="form-container">
      <div class="form-card">
        <input v-model="task.title" placeholder="Titel der Aufgabe" class="input-field" />

        <div class="category-row">
          <select v-if="!isNewCat" v-model="task.category_id" class="input-field select">
            <option :value="null">Kategorie wählen</option>
            <option v-for="c in categories" :key="c.category_id" :value="c.category_id">{{ c.name }}</option>
          </select>
          <input v-else v-model="newCatName" placeholder="Kategoriename..." class="input-field" />
          <button @click="isNewCat = !isNewCat" class="plus-btn">{{ isNewCat ? 'X' : '+' }}</button>
        </div>

        <textarea v-model="task.description" placeholder="Beschreibung..." class="input-field texarea"></textarea>
        <input type="date" v-model="task.due_date" class="input-field" />

        <select v-model="task.priority" class="input-field">
          <option value="low">Priorität: Low</option>
          <option value="medium">Priorität: Medium</option>
          <option value="high">Priorität: High</option>
        </select>

        <!-- Dynamischer Button-Text -->
        <button @click="save" class="submit-btn">
          {{ isEditMode ? 'Änderungen speichern' : 'Hinzufügen!' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Deine bestehenden Styles bleiben gleich */
.header { background: #8fb99c; padding: 20px; display: flex; justify-content: space-between; font-weight: bold; }
.form-container { display: flex; justify-content: center; padding-top: 50px; }
.form-card { background: #8fb99c; padding: 30px; border-radius: 20px; width: 350px; }
.input-field { width: 100%; padding: 12px; margin-bottom: 15px; border-radius: 10px; border: none; box-sizing: border-box; }
.category-row { display: flex; gap: 10px; }
.plus-btn { height: 40px; width: 40px; border-radius: 10px; border: none; background: #6b846e; color: white; cursor: pointer; font-weight: bold; }
.submit-btn { width: 100%; padding: 15px; border-radius: 10px; border: none; background: white; font-weight: bold; cursor: pointer; margin-top: 10px; }
</style>
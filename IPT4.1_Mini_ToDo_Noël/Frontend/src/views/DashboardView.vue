<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import api from "@/api.js";

const router = useRouter();
const tasks = ref([]);
const categories = ref([]);
const user = ref({ first_name: "", last_name: "", users_id: null });

const expandedTaskId = ref(null);

const filterStatus = ref('offen');
const filterPriority = ref('alle');
const filterCategory = ref('alle');
const filterOnlyMine = ref(false);
const sortOrder = ref('asc');

onMounted(async () => {
  const stored = localStorage.getItem("user");
  if (!stored) return router.push("/");
  user.value = JSON.parse(stored);
  loadData();
});

const loadData = async () => {
  try {
    const [tasksRes, catsRes] = await Promise.all([
      api.getTasks(),
      api.getCategories()
    ]);
    tasks.value = tasksRes;
    categories.value = catsRes;
  } catch (error) {
    console.error("Fehler beim Laden", error);
  }
};

const filteredTasks = computed(() => {
  let result = [...tasks.value];

  if (filterStatus.value === 'offen') result = result.filter(t => !t.done);
  else if (filterStatus.value === 'erledigt') result = result.filter(t => t.done);

  if (filterPriority.value !== 'alle') {
    result = result.filter(t => t.priority === filterPriority.value);
  }

  if (filterCategory.value !== 'alle') {
    result = result.filter(t => t.category_id === parseInt(filterCategory.value));
  }

  if (filterOnlyMine.value) {
    result = result.filter(t => t.users_id === user.value.users_id);
  }

  result.sort((a, b) => {
    const dateA = new Date(a.due_date);
    const dateB = new Date(b.due_date);
    return sortOrder.value === 'asc' ? dateA - dateB : dateB - dateA;
  });

  return result;
});

const toggleExpand = (id) => {
  expandedTaskId.value = expandedTaskId.value === id ? null : id;
};

const deleteTask = async (id) => {
  if (confirm("Möchtest du diese Aufgabe wirklich löschen?")) {
    await api.deleteTask(id);
    await loadData();
    expandedTaskId.value = null;
  }
};

const toggleStatus = async (task) => {
  task.done = !task.done;
  await api.updateTaskStatus(task.task_id, task.done);
};

const logout = () => {
  localStorage.removeItem("user");
  router.push("/");
};

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString('de-CH', { day: '2-digit', month: 'short' });
};

const isOverdue = (dateStr) => {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date().setHours(0,0,0,0);
};
</script>

<template>
  <div class="app-wrapper">
    <header class="glass-header">
      <div class="header-container">
        <div class="logo">
          <span class="logo-icon">✓</span>
          <span class="logo-text">Mini-ToDo</span>
        </div>
        <div class="header-right">
          <div class="user-badge">
            <div class="user-avatar">{{ user.first_name?.charAt(0) }}</div>
            <span class="user-name">{{ user.first_name }} {{ user.last_name }}</span>
          </div>
          <button @click="logout" class="btn-logout">Logout</button>
        </div>
      </div>
    </header>

    <main class="main-content">
      <div class="action-bar">
        <button class="btn-add" @click="router.push('/add-task')">
          <span class="plus-icon">+</span> Neue Aufgabe
        </button>
      </div>

      <section class="filter-card">
        <div class="filter-grid">
          <div class="filter-group">
            <label>Status</label>
            <select v-model="filterStatus">
              <option value="alle">Alle</option>
              <option value="offen">Offen</option>
              <option value="erledigt">Erledigt</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Priorität</label>
            <select v-model="filterPriority">
              <option value="alle">Alle</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Kategorie</label>
            <select v-model="filterCategory">
              <option value="alle">Alle Kategorien</option>
              <option v-for="c in categories" :key="c.category_id" :value="c.category_id">
                {{ c.name }}
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label>Fällig am</label>
            <select v-model="sortOrder">
              <option value="asc">Bald fällig ↑</option>
              <option value="desc">Später fällig ↓</option>
            </select>
          </div>

          <div class="filter-group checkbox-group">
            <label>{{ user.first_name }}</label>
            <label class="switch">
              <input type="checkbox" v-model="filterOnlyMine">
              <span class="slider round"></span>
            </label>
          </div>
        </div>
      </section>

      <div class="task-container">
        <div v-for="task in filteredTasks" :key="task.task_id"
             class="task-card" :class="{ 'is-expanded': expandedTaskId === task.task_id, 'is-done': task.done }">

          <div class="task-main-row" @click="toggleExpand(task.task_id)">
            <div class="task-left">
              <input type="checkbox" :checked="task.done" @change.stop="toggleStatus(task)" class="custom-checkbox" />
              <span class="task-title">{{ task.title }}</span>
            </div>

            <div class="task-right">
              <span class="task-date" :class="{ 'overdue': isOverdue(task.due_date) && !task.done }">
                {{ formatDate(task.due_date) }}
              </span>
              <div class="priority-indicator" :class="task.priority"></div>
              <span class="chevron" :class="{ 'rotated': expandedTaskId === task.task_id }">▼</span>
            </div>
          </div>

          <transition name="expand">
            <div v-if="expandedTaskId === task.task_id" class="task-details">
              <div class="details-inner">
                <div class="detail-box">
                  <span class="detail-label">Kategorie</span>
                  <span class="detail-value">{{ task.category?.name || 'Allgemein' }}</span>
                  <span class="detail-label" style="margin-top: 10px">Von</span>
                  <span class="detail-value">{{ task.users?.first_name }}</span>
                </div>
                <div class="detail-box">
                  <span class="detail-label">Beschreibung</span>
                  <p class="detail-desc">{{ task.description || 'Keine Beschreibung vorhanden.' }}</p>
                </div>
                <div class="detail-box actions">
                  <button class="btn-edit" @click="router.push('/edit-task/' + task.task_id)">Bearbeiten</button>
                  <button class="btn-delete" @click="deleteTask(task.task_id)">Löschen</button>
                </div>
              </div>
            </div>
          </transition>
        </div>

        <div v-if="filteredTasks.length === 0" class="empty-state">
          <p>Keine passenden Aufgaben gefunden. ☕</p>
        </div>
      </div>
    </main>
  </div>
</template>

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

.logo { display: flex; align-items: center; gap: 10px; }
.logo-icon { background: white; color: #6b846e; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; border-radius: 8px; font-weight: bold; }
.logo-text { font-weight: 700; font-size: 1.2rem; color: #1a202c; }

.header-right { display: flex; align-items: center; }

.user-badge {
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255,255,255,0.2);
  padding: 5px 15px 5px 5px;
  border-radius: 20px;
}
.user-avatar { width: 30px; height: 30px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #6b846e; }
.user-name { font-weight: 600; font-size: 0.9rem; }

.btn-logout {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: #1a202c;
  padding: 6px 15px;
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: 15px;
}

.btn-logout:hover {
  background: rgba(255, 255, 255, 0.4);
  border-color: rgba(255, 255, 255, 0.6);
  transform: translateY(-1px);
}

.main-content { max-width: 900px; margin: 40px auto; padding: 0 20px; }

.btn-add {
  background: #6b846e; color: white; border: none; padding: 12px 24px; border-radius: 12px;
  font-weight: 600; cursor: pointer; margin-bottom: 25px;
  box-shadow: 0 4px 12px rgba(107, 132, 110, 0.2);
}

.filter-card {
  background: white; border-radius: 18px; padding: 25px; margin-bottom: 30px;
  box-shadow: 0 2px 15px rgba(0,0,0,0.04);
}
.filter-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 20px; }
.filter-group label { display: block; font-size: 0.65rem; font-weight: 700; color: #a0aec0; text-transform: uppercase; margin-bottom: 8px; }
.filter-group select {
  width: 100%; border: 1.5px solid #edf2f7; background: #f8fafc; padding: 10px; border-radius: 10px; outline: none; font-weight: 600;
}

/* Switch Style */
.switch { position: relative; display: inline-block; width: 44px; height: 24px; }
.switch input { opacity: 0; width: 0; height: 0; }
.slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #cbd5e0; transition: .4s; border-radius: 34px; }
.slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .4s; border-radius: 50%; }
input:checked + .slider { background-color: #8fb99c; }
input:checked + .slider:before { transform: translateX(20px); }

.task-container { display: flex; flex-direction: column; gap: 12px; }
.task-card { background: white; border-radius: 14px; border: 1px solid #edf2f0; cursor: pointer; overflow: hidden; transition: 0.2s; }
.task-card:hover { border-color: #8fb99c; transform: translateX(4px); }

.task-main-row { display: flex; justify-content: space-between; align-items: center; padding: 18px 24px; }
.task-left { display: flex; align-items: center; gap: 15px; }
.task-title { font-weight: 600; font-size: 1.05rem; }
.is-done .task-title { text-decoration: line-through; color: #a0aec0; }

.task-right { display: flex; align-items: center; gap: 20px; }
.task-date { font-size: 0.85rem; font-weight: 600; color: #718096; }
.task-date.overdue { color: #e53e3e; }

.priority-indicator { width: 12px; height: 12px; border-radius: 50%; }
.priority-indicator.high { background: #fc8181; box-shadow: 0 0 8px rgba(252, 129, 129, 0.4); }
.priority-indicator.medium { background: #fbd38d; }
.priority-indicator.low { background: #9ae6b4; }

.chevron { font-size: 0.7rem; opacity: 0.3; transition: 0.3s; }
.rotated { transform: rotate(180deg); }

.task-details { background: #fafcfb; border-top: 1px solid #edf2f0; }
.details-inner { padding: 20px 24px; display: grid; grid-template-columns: 1fr 2fr 150px; gap: 30px; }
.detail-label { display: block; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; color: #a0aec0; }
.detail-value { font-weight: 600; font-size: 0.9rem; }
.detail-desc { font-size: 0.9rem; color: #718096; margin: 0; line-height: 1.5; }

.actions { display: flex; flex-direction: column; gap: 10px; }
.btn-edit { background: #ebf4ef; color: #4a5d4c; border: none; padding: 8px; border-radius: 8px; cursor: pointer; font-weight: 600; }
.btn-delete { background: #fff5f5; color: #c53030; border: none; padding: 8px; border-radius: 8px; cursor: pointer; font-weight: 600; }

.custom-checkbox { width: 20px; height: 20px; accent-color: #8fb99c; cursor: pointer; }
.empty-state { text-align: center; padding: 40px; color: #a0aec0; font-style: italic; }

.expand-enter-active, .expand-leave-active { transition: all 0.3s ease; max-height: 400px; }
.expand-enter-from, .expand-leave-to { max-height: 0; opacity: 0; }
</style>
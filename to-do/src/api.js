const API_URL = "http://127.0.0.1:3000";

const api = {
    // Benutzer suchen (Login)
    async loginUser(firstName, lastName) {
        const res = await fetch(`${API_URL}/users?first_name=eq.${firstName}&last_name=eq.${lastName}`);
        if (!res.ok) return null;
        const users = await res.json();
        return users[0] || null;
    },

    // Neuen Benutzer erstellen
    async createUser(firstName, lastName) {
        const res = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
            body: JSON.stringify({ first_name: firstName, last_name: lastName })
        });
        const data = await res.json();
        return data[0];
    },

    // Aufgaben laden
    async getTasks() {
        const res = await fetch(`${API_URL}/task?select=*,category(name),users(first_name,last_name)&order=due_date.asc`);
        return res.json();
    },

    // Neue Aufgabe erstellen
    async createTask(task) {
        return fetch(`${API_URL}/task`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        });
    },

    // Status einer Aufgabe ändern (Erledigt/Offen)
    async updateTaskStatus(taskId, isDone) {
        return fetch(`${API_URL}/task?task_id=eq.${taskId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ done: isDone })
        });
    },

    // Kategorien laden
    async getCategories() {
        const res = await fetch(`${API_URL}/category?order=name.asc`);
        return res.json();
    },

    // Neue Kategorie erstellen
    async createCategory(name) {
        const res = await fetch(`${API_URL}/category`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
            body: JSON.stringify({ name: name })
        });
        const data = await res.json();
        return data[0];
    },

    // In src/api.js hinzufügen:
    async deleteTask(taskId) {
        return fetch(`${API_URL}/task?task_id=eq.${taskId}`, {
            method: 'DELETE'
        });
    },

    // In src/api.js hinzufügen:

// Eine einzelne Aufgabe anhand der ID laden
    async getTaskById(taskId) {
        const res = await fetch(`${API_URL}/task?task_id=eq.${taskId}`);
        const data = await res.json();
        return data[0];
    },

// Eine bestehende Aufgabe aktualisieren (PATCH)
    async updateTask(taskId, taskData) {
        // Wir entfernen IDs und Relationen aus den Daten, die nicht geupdatet werden dürfen
        const { task_id, users, category, ...cleanData } = taskData;

        return fetch(`${API_URL}/task?task_id=eq.${taskId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cleanData)
        });
    },
};

export default api;
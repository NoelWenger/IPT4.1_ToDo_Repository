const API_URL = "http://127.0.0.1:3000";

const api = {
    async loginUser(firstName, lastName) {
        const res = await fetch(`${API_URL}/users?first_name=eq.${firstName}&last_name=eq.${lastName}`);
        if (!res.ok) return null;
        const users = await res.json();
        return users[0] || null;
    },

    async createUser(firstName, lastName) {
        const res = await fetch(`${API_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
            body: JSON.stringify({ first_name: firstName, last_name: lastName })
        });
        const data = await res.json();
        return data[0];
    },

    async getTasks() {
        const res = await fetch(`${API_URL}/task?select=*,category(name),users(first_name,last_name)&order=due_date.asc`);
        return res.json();
    },

    async createTask(task) {
        return fetch(`${API_URL}/task`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(task)
        });
    },

    async updateTaskStatus(taskId, isDone) {
        return fetch(`${API_URL}/task?task_id=eq.${taskId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ done: isDone })
        });
    },

    async getCategories() {
        const res = await fetch(`${API_URL}/category?order=name.asc`);
        return res.json();
    },

    async createCategory(name) {
        const res = await fetch(`${API_URL}/category`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
            body: JSON.stringify({ name: name })
        });
        const data = await res.json();
        return data[0];
    },

    async deleteTask(taskId) {
        return fetch(`${API_URL}/task?task_id=eq.${taskId}`, {
            method: 'DELETE'
        });
    },

    async getTaskById(taskId) {
        const res = await fetch(`${API_URL}/task?task_id=eq.${taskId}`);
        const data = await res.json();
        return data[0];
    },

    async updateTask(taskId, taskData) {
        const { task_id, users, category, ...cleanData } = taskData;
        return fetch(`${API_URL}/task?task_id=eq.${taskId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cleanData)
        });
    },
};

export default api;
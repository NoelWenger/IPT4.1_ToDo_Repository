const API_URL = "[http://127.0.0.1:3000](http://127.0.0.1:3000/)";

const api = {
    async getTasks() {
        const res = await fetch(`${API_URL}/task?select=*,category(name),users(first_name,last_name)`);
        return res.json();
    },
    async getCategories() {
        const res = await fetch(`${API_URL}/category`);
        return res.json();
    },
    async getUsers() {
        const res = await fetch(`${API_URL}/users`);
        return res.json();
    },
    async createTask(task) {
        return fetch(`${API_URL}/task`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
            body: JSON.stringify(task)
        });
    },
    async loginUser(firstName, lastName) {
        const url = `${API_URL}/users?first_name=eq.${firstName}&last_name=eq.${lastName}`;
        console.log("Rufe URL auf:", url); // Debug-Info

        const res = await fetch(url);

        if (!res.ok) {
            const errorText = await res.text(); // Falls Fehler, als Text lesen
            console.error("Kritischer API Fehler:", errorText);
            alert("Datenbank-Fehler: " + errorText);
            return null;
        }

// Erst wenn alles okay ist, versuchen wir JSON zu parsen
        const users = await res.json();
        return users[0] || null;
    }
};

// Das hier ist wichtig:
export default api;
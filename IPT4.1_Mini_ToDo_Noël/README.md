# Mini-ToDo Manager - Noel Wenger

## Projektbeschreibung
Mein Projekt ist ein moderner To-Do Manager, mit dem verschiedene Benutzer ihre Aufgaben einfach verwalten, Kategorien zuordnen und Prioritäten setzen können. Die Anwendung bietet eine übersichtliche Oberfläche mit Filterfunktionen und einer detaillierten Aufgabenansicht.

### Datenbank-Struktur
Die Datenbank basiert auf PostgreSQL und nutzt folgende Struktur:

*   **Users**: Speichert die Benutzer (Vorname, Nachname).
*   **Category**: Beinhaltet Kategorien wie „Schule“, „Arbeit“ oder „Privat“ zur Organisation.
*   **Task**: Die Haupttabelle für Aufgaben (Titel, Beschreibung, Fälligkeitsdatum, Status) mit Verknüpfungen zu Usern und Kategorien.
*   **Priority (Type)**: Ein definierter ENUM-Typ für die Wichtigkeit der Aufgaben (Low, Medium, High).

### Verwendete Technologien
- **Frontend**: Vue.js 3 mit Vite und Vue Router
- **API**: PostgREST (automatische REST-Schnittstelle zur Datenbank)
- **Datenbank**: PostgreSQL 17
- **Infrastruktur**: Docker & Docker Compose

---

## Startanleitung

1. Backend starten:
   Öffne ein Terminal im Hauptordner und gib ein:
   docker-compose up -d

2. Datenbank initialisieren:
   Führe das SQL-Skript 'datenbank.sql' in der Datenbank aus (z.B. via WebStorm Database Tab).

3. Frontend starten:
   Gehe in den Ordner 'frontend' und gib folgende Befehle ein:
   npm install
   npm run dev

Die App ist dann unter http://localhost:5173 erreichbar.

## Test-User für Login:
Vorname: Noel
Nachname: Wenger
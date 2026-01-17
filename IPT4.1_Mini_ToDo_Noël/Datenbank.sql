-- Datenbank komplett aufräumen, falls schon etwas existiert
DROP TABLE IF EXISTS task CASCADE;
DROP TABLE IF EXISTS category CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TYPE IF EXISTS priority_level CASCADE;

-- 1. ENUM Typ für Prioritäten
CREATE TYPE priority_level AS ENUM ('low', 'medium', 'high');

-- 2. Tabellen erstellen
CREATE TABLE users (
                       users_id SERIAL PRIMARY KEY,
                       first_name TEXT NOT NULL,
                       last_name TEXT NOT NULL
);

CREATE TABLE category (
                          category_id SERIAL PRIMARY KEY,
                          name TEXT NOT NULL
);

CREATE TABLE task (
                      task_id SERIAL PRIMARY KEY,
                      title TEXT NOT NULL,
                      description TEXT,
                      done BOOLEAN DEFAULT false,
                      due_date DATE NOT NULL,
                      priority priority_level,
                      users_id INT REFERENCES users(users_id),
                      category_id INT REFERENCES category(category_id)
);

-- 3. Testdaten einfügen
-- User (ID 1)
INSERT INTO users (users_id, first_name, last_name) VALUES (1, 'Noel', 'Wenger');

-- Kategorien (ID 1, 2, 3)
INSERT INTO category (category_id, name) VALUES
                                             (1, 'Schule'),
                                             (2, 'Privat'),
                                             (3, 'Arbeit');

-- Aufgaben für Noel
INSERT INTO task (title, description, done, due_date, priority, users_id, category_id) VALUES
                                                                                           ('Mathe HA', 'Übungen Seite 45 im Buch lösen.', false, '2026-01-20', 'high', 1, 1),
                                                                                           ('Einkaufen', 'Milch, Eier und Brot nicht vergessen.', true, '2026-01-15', 'low', 1, 2),
                                                                                           ('Projekt-Meeting', 'Besprechung der neuen Web-App.', false, '2026-01-25', 'medium', 1, 3),
                                                                                           ('Zimmer aufräumen', 'Wäsche waschen und Boden saugen.', false, '2026-02-01', 'low', 1, 2);

-- ID-Zähler korrigieren (damit neue Einträge nach den Testdaten bei 4, 2 etc. weitermachen)
SELECT setval('users_users_id_seq', (SELECT MAX(users_id) FROM users));
SELECT setval('category_category_id_seq', (SELECT MAX(category_id) FROM category));
SELECT setval('task_task_id_seq', (SELECT MAX(task_id) FROM task));

-- 4. Berechtigungen für PostgREST
GRANT USAGE ON SCHEMA public TO noel;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO noel;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO noel;
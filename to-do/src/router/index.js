import { createRouter, createWebHistory } from "vue-router";
import TaskView from "@/views/TaskView.vue";

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/tasks",
            name: "tasks",
            component: TaskView
        }
    ]
});

export default router;

import { defineStore } from 'pinia';
import { getTasks, createTask, updateTask, deleteTask, reorderTasks } from '../services/mockApi';

export const useTaskStore = defineStore('task', {
    state: () => ({
        tasks: [],
        loading: false,
        error: null,
        filters: {
            status: 'all',
            priority: 'all',
            tags: [],
            search: '',
        },
        sortBy: 'dueDate', // 'dueDate' | 'priority' | 'createdAt'
    }),

    getters: {
        filteredTasks: (state) => {
            let filtered = [...state.tasks];

            // Filter by status
            if(state.filters.status !== 'all') {
                filtered = filtered.filter((task) => task.status === state.filters.status);
            }

            // Filter by priority
            if(state.filters.priority !== 'all') {
                filtered = filtered.filter((task) => task.priority === state.filters.priority);
            }

            // Filter by tags
            if(state.filters.tags.length > 0) {
                filtered = filtered.filter((task) =>
                    state.filters.tags.some((tag) => task.tags.includes(tag))
                );
            }

            // Filter by search
            if(state.filters.search) {
                const search = state.filters.search.toLowerCase();
                filtered = filtered.filter(
                    (task) =>
                        task.title.toLowerCase().includes(search) ||
                        task.description.toLowerCase().includes(search)
                );
            }

            return filtered;
        },

        sortedTasks: (state) => {
            const tasks = state.filteredTasks;

            const sorted = [...tasks].sort((a, b) => {
                if(state.sortBy === 'dueDate') {
                    return new Date(a.dueDate) - new Date(b.dueDate);
                } else if(state.sortBy === 'priority') {
                    const priorityOrder = { High: 3, Medium: 2, Low: 1 };
                    return priorityOrder[b.priority] - priorityOrder[a.priority];
                } else if(state.sortBy === 'createdAt') {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                }
                return 0;
            });

            return sorted;
        },

        tasksByStatus: (state) => {
            const grouped = {
                'To Do': [],
                'In Progress': [],
                'Done': [],
            };

            state.tasks.forEach((task) => {
                if(grouped[task.status]) {
                    grouped[task.status].push(task);
                }
            });

            return grouped;
        },
    },

    actions: {
        async fetchTasks() {
            this.loading = true;
            this.error = null;

            try {
                this.tasks = await getTasks();
            } catch(err) {
                this.error = err.message;
                throw err;
            } finally {
                this.loading = false;
            }
        },

        async addTask(taskData) {
            this.loading = true;
            this.error = null;

            try {
                const newTask = await createTask(taskData);
                this.tasks.push(newTask);
                return newTask;
            } catch(err) {
                this.error = err.message;
                throw err;
            } finally {
                this.loading = false;
            }
        },

        async editTask(id, updates) {
            this.loading = true;
            this.error = null;

            try {
                const updatedTask = await updateTask(id, updates);
                const index = this.tasks.findIndex((t) => t.id === id);
                if(index !== -1) {
                    this.tasks[index] = updatedTask;
                }
                return updatedTask;
            } catch(err) {
                this.error = err.message;
                throw err;
            } finally {
                this.loading = false;
            }
        },

        async removeTask(id) {
            this.loading = true;
            this.error = null;

            try {
                await deleteTask(id);
                this.tasks = this.tasks.filter((t) => t.id !== id);
            } catch(err) {
                this.error = err.message;
                throw err;
            } finally {
                this.loading = false;
            }
        },

        async reorder(taskIds) {
            try {
                await reorderTasks(taskIds);
                // Update local state to match new order
                const reordered = taskIds.map((id) => this.tasks.find((t) => t.id === id)).filter(Boolean);
                this.tasks = reordered;
            } catch(err) {
                this.error = err.message;
                throw err;
            }
        },

        setFilter(filterType, value) {
            this.filters[filterType] = value;
        },

        clearFilters() {
            this.filters = {
                status: 'all',
                priority: 'all',
                tags: [],
                search: '',
            };
        },

        setSortBy(sortBy) {
            this.sortBy = sortBy;
        },
    },
});

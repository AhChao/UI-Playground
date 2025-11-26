import { defineStore } from 'pinia';

export const useUiStore = defineStore('ui', {
    state: () => ({
        toasts: [],
        isModalOpen: false,
        isDrawerOpen: false,
        activeTask: null,
        modalMode: null, // 'create' | 'edit'
        locale: 'zh-TW', // Default to Traditional Chinese
    }),

    actions: {
        setLocale(locale) {
            this.locale = locale;
        },

        addToast(toast) {
            const id = Date.now() + Math.random();
            const newToast = {
                id,
                type: toast.type || 'info', // 'success' | 'error' | 'warning' | 'info'
                message: toast.message,
                duration: toast.duration || 3000,
            };

            this.toasts.push(newToast);

            // Auto-remove after duration
            setTimeout(() => {
                this.removeToast(id);
            }, newToast.duration);

            return id;
        },

        removeToast(id) {
            this.toasts = this.toasts.filter((t) => t.id !== id);
        },

        openModal(mode = 'create', task = null) {
            this.isModalOpen = true;
            this.modalMode = mode;
            if(mode === 'edit' && task) {
                this.activeTask = task;
            }
        },

        closeModal() {
            this.isModalOpen = false;
            this.modalMode = null;
            this.activeTask = null;
        },

        openDrawer(task) {
            this.isDrawerOpen = true;
            this.activeTask = task;
        },

        closeDrawer() {
            this.isDrawerOpen = false;
            this.activeTask = null;
        },
    },
});

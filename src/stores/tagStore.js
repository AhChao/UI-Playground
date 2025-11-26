import { defineStore } from 'pinia';
import { getTags, createTag, deleteTag } from '../services/mockApi';

export const useTagStore = defineStore('tag', {
    state: () => ({
        tags: [],
        loading: false,
        error: null,
    }),

    actions: {
        async fetchTags() {
            this.loading = true;
            this.error = null;

            try {
                this.tags = await getTags();
            } catch(err) {
                this.error = err.message;
                throw err;
            } finally {
                this.loading = false;
            }
        },

        async addTag(tagName) {
            this.loading = true;
            this.error = null;

            try {
                const newTag = await createTag(tagName);
                this.tags.push(newTag);
                return newTag;
            } catch(err) {
                this.error = err.message;
                throw err;
            } finally {
                this.loading = false;
            }
        },

        async removeTag(tagName) {
            this.loading = true;
            this.error = null;

            try {
                await deleteTag(tagName);
                this.tags = this.tags.filter((t) => t !== tagName);
            } catch(err) {
                this.error = err.message;
                throw err;
            } finally {
                this.loading = false;
            }
        },
    },
});

<template>
  <Modal :is-open="isOpen" :title="modalTitle" @close="handleClose">
    <form @submit.prevent="handleSubmit" class="task-form">
      <div class="form-group">
        <label for="task-title">{{ t('modal.titleLabel') }} <span class="required">*</span></label>
        <input
          id="task-title"
          v-model="formData.title"
          type="text"
          :placeholder="t('modal.titlePlaceholder')"
          :class="{ error: errors.title }"
          required
        />
        <span v-if="errors.title" class="error-message">{{ errors.title }}</span>
      </div>
      
      <div class="form-group">
        <label for="task-description">{{ t('modal.descLabel') }}</label>
        <textarea
          id="task-description"
          v-model="formData.description"
          :placeholder="t('modal.descPlaceholder')"
          rows="4"
          :class="{ error: errors.description }"
        ></textarea>
        <span v-if="errors.description" class="error-message">{{ errors.description }}</span>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label for="task-priority">{{ t('modal.priorityLabel') }}</label>
          <select id="task-priority" v-model="formData.priority">
            <option value="Low">{{ t('priority.low') }}</option>
            <option value="Medium">{{ t('priority.medium') }}</option>
            <option value="High">{{ t('priority.high') }}</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="task-status">{{ t('modal.statusLabel') }}</label>
          <select id="task-status" v-model="formData.status">
            <option value="To Do">{{ t('status.todo') }}</option>
            <option value="In Progress">{{ t('status.inprogress') }}</option>
            <option value="Done">{{ t('status.done') }}</option>
          </select>
        </div>
      </div>
      
      <div class="form-group">
        <label for="task-due-date">{{ t('modal.dueDateLabel') }}</label>
        <input
          id="task-due-date"
          v-model="formData.dueDate"
          type="date"
        />
      </div>
      
      <div class="form-group">
        <label>{{ t('modal.tagsLabel') }}</label>
        <div class="tag-input-container">
          <div class="selected-tags">
            <span v-for="tag in formData.tags" :key="tag" class="selected-tag">
              {{ tag }}
              <button type="button" @click="removeTag(tag)" class="tag-remove">×</button>
            </span>
          </div>
          <input
            v-model="tagInput"
            type="text"
            :placeholder="t('modal.tagsPlaceholder')"
            @keydown.enter.prevent="addTag"
            @input="handleTagInput"
            class="tag-input"
          />
        </div>
        <div v-if="filteredTags.length > 0" class="tag-suggestions">
          <button
            v-for="tag in filteredTags"
            :key="tag"
            type="button"
            @click="selectTag(tag)"
            class="tag-suggestion"
          >
            {{ tag }}
          </button>
        </div>
      </div>
      
      <div class="form-actions">
        <Button variant="ghost" type="button" @click="handleClose">{{ t('modal.cancel') }}</Button>
        <Button variant="primary" type="submit" :loading="loading">
          {{ mode === 'create' ? t('modal.create') : t('modal.save') }}
        </Button>
      </div>
    </form>
  </Modal>
</template>

<script>
import { ref, computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import Modal from '../ui/Modal.vue';
import Button from '../ui/Button.vue';
import { useTagStore } from '../../stores/tagStore';
import { useI18n } from '../../composables/useI18n';

export default {
  name: 'TaskModal',
  components: {
    Modal,
    Button,
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    mode: {
      type: String,
      default: 'create', // 'create' | 'edit'
    },
    task: {
      type: Object,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['close', 'submit'],
  setup(props, { emit }) {
    const tagStore = useTagStore();
    const { tags } = storeToRefs(tagStore);
    const { t } = useI18n();
    
    const formData = ref({
      title: '',
      description: '',
      priority: 'Medium',
      status: 'To Do',
      dueDate: '',
      tags: [],
    });
    
    const errors = ref({});
    const tagInput = ref('');
    
    const modalTitle = computed(() => {
      return props.mode === 'create' ? t('modal.createTitle') : t('modal.editTitle');
    });
    
    const filteredTags = computed(() => {
      if (!tagInput.value) return [];
      const input = tagInput.value.toLowerCase();
      return tags.value
        .filter((tag) => tag.toLowerCase().includes(input) && !formData.value.tags.includes(tag))
        .slice(0, 5);
    });
    
    watch(
      () => props.task,
      (newTask) => {
        if (newTask && props.mode === 'edit') {
          formData.value = {
            title: newTask.title,
            description: newTask.description || '',
            priority: newTask.priority,
            status: newTask.status,
            dueDate: newTask.dueDate ? newTask.dueDate.split('T')[0] : '',
            tags: [...newTask.tags],
          };
        }
      },
      { immediate: true }
    );
    
    watch(
      () => props.isOpen,
      (isOpen) => {
        if (isOpen && props.mode === 'create') {
          formData.value = {
            title: '',
            description: '',
            priority: 'Medium',
            status: 'To Do',
            dueDate: '',
            tags: [],
          };
          errors.value = {};
        }
      }
    );
    
    const validate = () => {
      errors.value = {};
      
      if (!formData.value.title.trim()) {
        errors.value.title = t('modal.error.titleRequired');
      }
      
      if (formData.value.description.length > 500) {
        errors.value.description = t('modal.error.descLength');
      }
      
      return Object.keys(errors.value).length === 0;
    };
    
    const handleSubmit = () => {
      if (!validate()) return;
      
      const submitData = {
        ...formData.value,
        dueDate: formData.value.dueDate ? new Date(formData.value.dueDate).toISOString() : new Date().toISOString(),
      };
      
      emit('submit', submitData);
    };
    
    const handleClose = () => {
      emit('close');
    };
    
    const addTag = () => {
      const tag = tagInput.value.trim();
      if (tag && !formData.value.tags.includes(tag)) {
        formData.value.tags.push(tag);
        tagInput.value = '';
      }
    };
    
    const removeTag = (tag) => {
      formData.value.tags = formData.value.tags.filter((t) => t !== tag);
    };
    
    const selectTag = (tag) => {
      if (!formData.value.tags.includes(tag)) {
        formData.value.tags.push(tag);
        tagInput.value = '';
      }
    };
    
    const handleTagInput = () => {
      // Trigger reactivity for filtered tags
    };
    
    return {
      formData,
      errors,
      tagInput,
      modalTitle,
      filteredTags,
      handleSubmit,
      handleClose,
      addTag,
      removeTag,
      selectTag,
      handleTagInput,
      t,
    };
  },
};
</script>

<style scoped>
.task-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.form-group label {
  font-size: var(--text-sm);
  font-weight: 500;
  color: var(--color-text-primary);
}

.required {
  color: var(--color-error);
}

.form-group input,
.form-group textarea,
.form-group select {
  padding: var(--space-sm) var(--space-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-size: var(--text-sm);
  font-family: inherit;
  transition: all var(--transition-fast);
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--color-primary);
  background: var(--color-bg-overlay);
}

.form-group input.error,
.form-group textarea.error {
  border-color: var(--color-error);
}

.error-message {
  font-size: var(--text-xs);
  color: var(--color-error);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-md);
}

.tag-input-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  padding: var(--space-sm);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
}

.tag-input-container:focus-within {
  border-color: var(--color-primary);
  background: var(--color-bg-overlay);
}

.selected-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.selected-tag {
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: 4px 8px;
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
}

.tag-remove {
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 18px;
  line-height: 1;
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background var(--transition-fast);
}

.tag-remove:hover {
  background: rgba(255, 255, 255, 0.2);
}

.tag-input {
  background: transparent;
  border: none;
  color: var(--color-text-primary);
  font-size: var(--text-sm);
  padding: 0;
}

.tag-input:focus {
  outline: none;
}

.tag-suggestions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
  margin-top: var(--space-xs);
}

.tag-suggestion {
  padding: 4px 10px;
  background: var(--color-bg-overlay);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  font-size: var(--text-xs);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.tag-suggestion:hover {
  background: var(--color-surface);
  border-color: var(--color-primary);
  color: var(--color-text-primary);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-md);
  padding-top: var(--space-md);
  border-top: 1px solid var(--color-border);
}
</style>

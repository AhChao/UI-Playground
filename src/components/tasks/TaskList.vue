<template>
  <div class="task-list">
    <div v-if="loading" class="task-list-loading">
      <div class="spinner"></div>
      <p>{{ t('list.loading') }}</p>
    </div>
    
    <div v-else-if="tasks.length === 0" class="task-list-empty">
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
        <path d="M32 8V56M8 32H56" stroke="currentColor" stroke-width="4" stroke-linecap="round"/>
      </svg>
      <h3>{{ t('list.empty.title') }}</h3>
      <p>{{ t('list.empty.subtitle') }}</p>
    </div>
    
    <draggable
      v-else
      v-model="localTasks"
      :animation="200"
      handle=".task-handle"
      ghost-class="task-ghost"
      @end="handleDragEnd"
      item-key="id"
    >
      <template #item="{ element }">
        <TaskItem :task="element" @click="handleTaskClick" />
      </template>
    </draggable>
  </div>
</template>

<script>
import { ref, watch } from 'vue';
import draggable from 'vuedraggable';
import TaskItem from './TaskItem.vue';
import { useI18n } from '../../composables/useI18n';

export default {
  name: 'TaskList',
  components: {
    draggable,
    TaskItem,
  },
  props: {
    tasks: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['task-click', 'reorder'],
  setup(props, { emit }) {
    const { t } = useI18n();
    const localTasks = ref([...props.tasks]);
    
    watch(
      () => props.tasks,
      (newTasks) => {
        localTasks.value = [...newTasks];
      },
      { deep: true }
    );
    
    const handleDragEnd = () => {
      const taskIds = localTasks.value.map((t) => t.id);
      emit('reorder', taskIds);
    };
    
    const handleTaskClick = (task) => {
      emit('task-click', task);
    };
    
    return {
      localTasks,
      handleDragEnd,
      handleTaskClick,
      t,
    };
  },
};
</script>

<style scoped>
.task-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.task-list-loading,
.task-list-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-2xl);
  text-align: center;
  color: var(--color-text-secondary);
}

.task-list-loading .spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: var(--space-md);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.task-list-empty svg {
  color: var(--color-border);
  margin-bottom: var(--space-md);
}

.task-list-empty h3 {
  color: var(--color-text-primary);
  margin-bottom: var(--space-sm);
}

.task-list-empty p {
  color: var(--color-text-tertiary);
  margin: 0;
}

.task-ghost {
  opacity: 0.5;
  background: var(--color-primary);
}
</style>

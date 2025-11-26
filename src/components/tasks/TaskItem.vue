<template>
  <div :class="['task-item', `priority-${task.priority.toLowerCase()}`]" @click="$emit('click', task)">
    <div class="task-handle">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M3 6H13M3 10H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </div>
    
    <div class="task-content">
      <div class="task-header">
        <h4 class="task-title">{{ task.title }}</h4>
        <span :class="['task-priority', `priority-${task.priority.toLowerCase()}`]">
          {{ t(`priority.${task.priority.toLowerCase()}`) }}
        </span>
      </div>
      
      <p v-if="task.description" class="task-description">{{ truncatedDescription }}</p>
      
      <div class="task-meta">
        <div class="task-tags">
          <span v-for="tag in task.tags" :key="tag" class="task-tag">{{ tag }}</span>
        </div>
        <div class="task-due-date" :class="{ overdue: isOverdue }">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 3.5V7L9 9M13 7C13 10.3137 10.3137 13 7 13C3.68629 13 1 10.3137 1 7C1 3.68629 3.68629 1 7 1C10.3137 1 13 3.68629 13 7Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
          {{ formattedDueDate }}
        </div>
      </div>
    </div>
    
    <div class="task-status">
      <span :class="['status-badge', `status-${task.status.toLowerCase().replace(' ', '-')}`]">
        {{ t(`status.${task.status.toLowerCase().replace(' ', '')}`) }}
      </span>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useI18n } from '../../composables/useI18n';

export default {
  name: 'TaskItem',
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
  emits: ['click'],
  setup(props) {
    const { t, locale } = useI18n();

    const truncatedDescription = computed(() => {
      if (!props.task.description) return '';
      return props.task.description.length > 100
        ? props.task.description.substring(0, 100) + '...'
        : props.task.description;
    });

    const formattedDueDate = computed(() => {
      const date = new Date(props.task.dueDate);
      const now = new Date();
      const diffTime = date - now;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) return t('task.overdue');
      if (diffDays === 0) return t('task.today');
      if (diffDays === 1) return t('task.tomorrow');
      if (diffDays < 7) return `${diffDays} ${t('task.days')}`;
      
      const dateLocale = locale.value === 'zh-TW' ? 'zh-TW' : 'en-US';
      return date.toLocaleDateString(dateLocale, { month: 'short', day: 'numeric' });
    });

    const isOverdue = computed(() => {
      return new Date(props.task.dueDate) < new Date() && props.task.status !== 'Done';
    });

    return {
      t,
      truncatedDescription,
      formattedDueDate,
      isOverdue,
    };
  },
};
</script>

<style scoped>
.task-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  padding: var(--space-md);
  background: var(--color-bg-elevated);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  position: relative;
  overflow: hidden;
}

.task-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--color-border);
  transition: background var(--transition-fast);
}

.task-item.priority-high::before {
  background: var(--color-error);
}

.task-item.priority-medium::before {
  background: var(--color-warning);
}

.task-item.priority-low::before {
  background: var(--color-info);
}

.task-item:hover {
  background: var(--color-bg-overlay);
  border-color: var(--color-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.task-handle {
  color: var(--color-text-tertiary);
  cursor: grab;
  padding: var(--space-xs);
  margin-top: 2px;
}

.task-handle:active {
  cursor: grabbing;
}

.task-content {
  flex: 1;
  min-width: 0;
}

.task-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  margin-bottom: var(--space-xs);
}

.task-title {
  font-size: var(--text-base);
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.task-priority {
  font-size: var(--text-xs);
  font-weight: 600;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex-shrink: 0;
}

.task-priority.priority-high {
  background: hsla(0, 84%, 60%, 0.15);
  color: var(--color-error);
}

.task-priority.priority-medium {
  background: hsla(38, 92%, 50%, 0.15);
  color: var(--color-warning);
}

.task-priority.priority-low {
  background: hsla(199, 89%, 48%, 0.15);
  color: var(--color-info);
}

.task-description {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  margin: 0 0 var(--space-sm) 0;
  line-height: 1.5;
}

.task-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
  flex-wrap: wrap;
}

.task-tags {
  display: flex;
  gap: var(--space-xs);
  flex-wrap: wrap;
}

.task-tag {
  font-size: var(--text-xs);
  padding: 2px 8px;
  background: var(--color-surface);
  color: var(--color-text-secondary);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
}

.task-due-date {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-size: var(--text-xs);
  color: var(--color-text-tertiary);
}

.task-due-date.overdue {
  color: var(--color-error);
  font-weight: 600;
}

.task-status {
  flex-shrink: 0;
}

.status-badge {
  font-size: var(--text-xs);
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  font-weight: 500;
}

.status-badge.status-to-do {
  background: hsla(199, 89%, 48%, 0.15);
  color: var(--color-info);
}

.status-badge.status-in-progress {
  background: hsla(38, 92%, 50%, 0.15);
  color: var(--color-warning);
}

.status-badge.status-done {
  background: hsla(142, 71%, 45%, 0.15);
  color: var(--color-success);
}
</style>

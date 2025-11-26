<template>
  <Transition name="drawer">
    <div v-if="isOpen" class="drawer-overlay" @click="$emit('close')">
      <div class="drawer-container" @click.stop>
        <div class="drawer-header">
          <h3>Task Details</h3>
          <button class="drawer-close" @click="$emit('close')" aria-label="Close drawer">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        
        <div v-if="task" class="drawer-body">
          <div class="task-detail-section">
            <h4 class="task-detail-title">{{ task.title }}</h4>
            <div class="task-detail-meta">
              <span :class="['priority-badge', `priority-${task.priority.toLowerCase()}`]">
                {{ task.priority }}
              </span>
              <span :class="['status-badge', `status-${task.status.toLowerCase().replace(' ', '-')}`]">
                {{ task.status }}
              </span>
            </div>
          </div>
          
          <div class="task-detail-section">
            <label>Description</label>
            <p class="task-description">{{ task.description || 'No description provided' }}</p>
          </div>
          
          <div class="task-detail-section">
            <label>Due Date</label>
            <p>{{ formattedDueDate }}</p>
          </div>
          
          <div class="task-detail-section">
            <label>Tags</label>
            <div class="task-tags">
              <span v-for="tag in task.tags" :key="tag" class="task-tag">{{ tag }}</span>
              <span v-if="task.tags.length === 0" class="no-tags">No tags</span>
            </div>
          </div>
          
          <div class="task-detail-section">
            <label>Activity Log</label>
            <div class="activity-log">
              <div v-for="(activity, index) in task.activityLog" :key="index" class="activity-item">
                <div class="activity-dot"></div>
                <div class="activity-content">
                  <p class="activity-action">{{ activity.action }}</p>
                  <p class="activity-time">{{ formatTimestamp(activity.timestamp) }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="drawer-actions">
            <Button variant="secondary" @click="handleEdit">Edit Task</Button>
            <Button variant="danger" @click="handleDelete" :disabled="!canDelete">
              Delete Task
            </Button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script>
import { computed } from 'vue';
import Button from '../ui/Button.vue';
import { apiState } from '../../services/mockApi';

export default {
  name: 'TaskDrawer',
  components: {
    Button,
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    task: {
      type: Object,
      default: null,
    },
  },
  emits: ['close', 'edit', 'delete'],
  setup(props, { emit }) {
    const formattedDueDate = computed(() => {
      if (!props.task?.dueDate) return 'No due date';
      const date = new Date(props.task.dueDate);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    });
    
    const canDelete = computed(() => apiState.permissions.deleteTask);
    
    const formatTimestamp = (timestamp) => {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
      if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
      if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
      
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };
    
    const handleEdit = () => {
      emit('edit', props.task);
    };
    
    const handleDelete = () => {
      if (canDelete.value) {
        emit('delete', props.task.id);
      }
    };
    
    return {
      formattedDueDate,
      canDelete,
      formatTimestamp,
      handleEdit,
      handleDelete,
    };
  },
};
</script>

<style scoped>
.drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  z-index: var(--z-overlay);
}

.drawer-container {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  max-width: 500px;
  background: var(--color-bg-elevated);
  border-left: 1px solid var(--color-border);
  box-shadow: var(--shadow-xl);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-lg);
  border-bottom: 1px solid var(--color-border);
}

.drawer-header h3 {
  margin: 0;
  font-size: var(--text-xl);
  color: var(--color-text-primary);
}

.drawer-close {
  background: transparent;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: var(--space-xs);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.drawer-close:hover {
  background: var(--color-bg-overlay);
  color: var(--color-text-primary);
}

.drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-lg);
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.task-detail-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.task-detail-section label {
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-text-tertiary);
}

.task-detail-title {
  font-size: var(--text-2xl);
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.task-detail-meta {
  display: flex;
  gap: var(--space-sm);
  margin-top: var(--space-sm);
}

.priority-badge,
.status-badge {
  font-size: var(--text-xs);
  font-weight: 600;
  padding: 4px 10px;
  border-radius: var(--radius-sm);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.priority-badge.priority-high {
  background: hsla(0, 84%, 60%, 0.15);
  color: var(--color-error);
}

.priority-badge.priority-medium {
  background: hsla(38, 92%, 50%, 0.15);
  color: var(--color-warning);
}

.priority-badge.priority-low {
  background: hsla(199, 89%, 48%, 0.15);
  color: var(--color-info);
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

.task-description {
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin: 0;
}

.task-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-xs);
}

.task-tag {
  padding: 4px 10px;
  background: var(--color-surface);
  color: var(--color-text-secondary);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
  font-size: var(--text-xs);
}

.no-tags {
  color: var(--color-text-tertiary);
  font-style: italic;
}

.activity-log {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.activity-item {
  display: flex;
  gap: var(--space-md);
  position: relative;
}

.activity-item:not(:last-child)::before {
  content: '';
  position: absolute;
  left: 5px;
  top: 20px;
  bottom: -16px;
  width: 1px;
  background: var(--color-border);
}

.activity-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-primary);
  margin-top: 4px;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-action {
  color: var(--color-text-primary);
  font-size: var(--text-sm);
  margin: 0 0 var(--space-xs) 0;
}

.activity-time {
  color: var(--color-text-tertiary);
  font-size: var(--text-xs);
  margin: 0;
}

.drawer-actions {
  display: flex;
  gap: var(--space-md);
  padding-top: var(--space-lg);
  border-top: 1px solid var(--color-border);
}

/* Transitions */
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity var(--transition-base);
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}

.drawer-enter-active .drawer-container,
.drawer-leave-active .drawer-container {
  transition: transform var(--transition-base);
}

.drawer-enter-from .drawer-container,
.drawer-leave-to .drawer-container {
  transform: translateX(100%);
}
</style>

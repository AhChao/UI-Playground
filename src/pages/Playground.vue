<template>
  <div class="playground">
    <header class="playground-header">
      <div class="container">
        <div class="header-content">
          <div class="header-left">
            <h1>{{ t('app.title') }}</h1>
            <p class="header-subtitle">{{ t('app.subtitle') }}</p>
          </div>
          <div class="header-right">
            <div class="lang-switch">
              <button 
                :class="{ active: locale === 'zh-TW' }" 
                @click="setLocale('zh-TW')"
              >
                繁中
              </button>
              <span class="divider">/</span>
              <button 
                :class="{ active: locale === 'en' }" 
                @click="setLocale('en')"
              >
                EN
              </button>
            </div>
            <input
              v-model="searchQuery"
              type="text"
              :placeholder="t('app.searchPlaceholder')"
              class="search-input"
            />
            <Button variant="primary" @click="handleCreateTask">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3V13M3 8H13" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
              {{ t('app.createTask') }}
            </Button>
          </div>
        </div>
      </div>
    </header>
    
    <div class="playground-filters">
      <div class="container">
        <div class="filters-content">
          <div class="filter-group">
            <label>{{ t('filter.status') }}</label>
            <select v-model="statusFilter">
              <option value="all">{{ t('filter.all') }}</option>
              <option value="To Do">{{ t('status.todo') }}</option>
              <option value="In Progress">{{ t('status.inprogress') }}</option>
              <option value="Done">{{ t('status.done') }}</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>{{ t('filter.priority') }}</label>
            <select v-model="priorityFilter">
              <option value="all">{{ t('filter.all') }}</option>
              <option value="High">{{ t('priority.high') }}</option>
              <option value="Medium">{{ t('priority.medium') }}</option>
              <option value="Low">{{ t('priority.low') }}</option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>{{ t('filter.sortBy') }}</label>
            <select v-model="sortBy">
              <option value="dueDate">{{ t('sort.dueDate') }}</option>
              <option value="priority">{{ t('sort.priority') }}</option>
              <option value="createdAt">{{ t('sort.createdAt') }}</option>
            </select>
          </div>
          
          <Button variant="ghost" @click="clearFilters">{{ t('filter.clear') }}</Button>
        </div>
      </div>
    </div>
    
    <main class="playground-main">
      <div class="container">
        <div class="main-content">
          <div class="task-list-container">
            <TaskList
              :tasks="sortedTasks"
              :loading="taskStore.loading"
              @task-click="handleTaskClick"
              @reorder="handleReorder"
            />
          </div>
        </div>
      </div>
    </main>
    
    <!-- Modals and Overlays -->
    <TaskModal
      :is-open="uiStore.isModalOpen"
      :mode="uiStore.modalMode"
      :task="uiStore.activeTask"
      :loading="taskStore.loading"
      @close="uiStore.closeModal"
      @submit="handleTaskSubmit"
    />
    
    <TaskDrawer
      :is-open="uiStore.isDrawerOpen"
      :task="uiStore.activeTask"
      @close="uiStore.closeDrawer"
      @edit="handleEditTask"
      @delete="handleDeleteTask"
    />
    
    <Toast />
    
    <DebugPanel />
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useTaskStore } from '../stores/taskStore';
import { useUiStore } from '../stores/uiStore';
import { useTagStore } from '../stores/tagStore';
import { useI18n } from '../composables/useI18n';
import Button from '../components/ui/Button.vue';
import Toast from '../components/ui/Toast.vue';
import TaskList from '../components/tasks/TaskList.vue';
import TaskModal from '../components/tasks/TaskModal.vue';
import TaskDrawer from '../components/tasks/TaskDrawer.vue';
import DebugPanel from '../components/DebugPanel.vue';

export default {
  name: 'Playground',
  components: {
    Button,
    Toast,
    TaskList,
    TaskModal,
    TaskDrawer,
    DebugPanel,
  },
  setup() {
    const taskStore = useTaskStore();
    const uiStore = useUiStore();
    const tagStore = useTagStore();
    const { t, locale } = useI18n();
    
    const searchQuery = ref('');
    const statusFilter = ref('all');
    const priorityFilter = ref('all');
    const sortBy = ref('dueDate');
    
    const { sortedTasks } = storeToRefs(taskStore);
    
    // Watch filters and update store
    watch(searchQuery, (value) => {
      taskStore.setFilter('search', value);
    });
    
    watch(statusFilter, (value) => {
      taskStore.setFilter('status', value);
    });
    
    watch(priorityFilter, (value) => {
      taskStore.setFilter('priority', value);
    });
    
    watch(sortBy, (value) => {
      taskStore.setSortBy(value);
    });
    
    const clearFilters = () => {
      searchQuery.value = '';
      statusFilter.value = 'all';
      priorityFilter.value = 'all';
      taskStore.clearFilters();
    };
    
    const handleCreateTask = () => {
      uiStore.openModal('create');
    };
    
    const handleTaskClick = (task) => {
      uiStore.openDrawer(task);
    };
    
    const handleEditTask = (task) => {
      uiStore.closeDrawer();
      uiStore.openModal('edit', task);
    };
    
    const handleTaskSubmit = async (taskData) => {
      try {
        if (uiStore.modalMode === 'create') {
          await taskStore.addTask(taskData);
          uiStore.addToast({
            type: 'success',
            message: t('toast.createSuccess'),
          });
          window.debugLog?.('success', 'Task created');
        } else {
          await taskStore.editTask(uiStore.activeTask.id, taskData);
          uiStore.addToast({
            type: 'success',
            message: t('toast.updateSuccess'),
          });
          window.debugLog?.('success', 'Task updated');
        }
        uiStore.closeModal();
      } catch (error) {
        uiStore.addToast({
          type: 'error',
          message: error.message || 'Failed to save task',
        });
        window.debugLog?.('error', error.message);
      }
    };
    
    const handleDeleteTask = async (taskId) => {
      try {
        await taskStore.removeTask(taskId);
        uiStore.addToast({
          type: 'success',
          message: t('toast.deleteSuccess'),
        });
        uiStore.closeDrawer();
        window.debugLog?.('success', 'Task deleted');
      } catch (error) {
        uiStore.addToast({
          type: 'error',
          message: error.message || 'Failed to delete task',
        });
        window.debugLog?.('error', error.message);
      }
    };
    
    const handleReorder = async (taskIds) => {
      try {
        await taskStore.reorder(taskIds);
        uiStore.addToast({
          type: 'info',
          message: t('toast.reorderSuccess'),
        });
        window.debugLog?.('info', 'Tasks reordered');
      } catch (error) {
        uiStore.addToast({
          type: 'error',
          message: t('toast.reorderError'),
        });
        window.debugLog?.('error', error.message);
      }
    };
    
    const setLocale = (lang) => {
      uiStore.setLocale(lang);
    };
    
    // Load initial data
    onMounted(async () => {
      try {
        await Promise.all([
          taskStore.fetchTasks(),
          tagStore.fetchTags(),
        ]);
        window.debugLog?.('info', 'Initial data loaded');
      } catch (error) {
        uiStore.addToast({
          type: 'error',
          message: t('toast.loadError'),
        });
        window.debugLog?.('error', error.message);
      }
    });
    
    return {
      taskStore,
      uiStore,
      searchQuery,
      statusFilter,
      priorityFilter,
      sortBy,
      sortedTasks,
      clearFilters,
      handleCreateTask,
      handleTaskClick,
      handleEditTask,
      handleTaskSubmit,
      handleDeleteTask,
      handleReorder,
      t,
      locale,
      setLocale,
    };
  },
};
</script>

<style scoped>
.playground {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding-bottom: 60px; /* Space for debug panel */
}

.playground-header {
  background: var(--color-bg-elevated);
  border-bottom: 1px solid var(--color-border);
  padding: var(--space-xl) 0;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-xl);
  flex-wrap: wrap;
}

.header-left h1 {
  margin: 0;
  font-size: var(--text-3xl);
  background: linear-gradient(135deg, var(--color-primary), var(--color-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-subtitle {
  margin: var(--space-xs) 0 0 0;
  color: var(--color-text-tertiary);
  font-size: var(--text-sm);
}

.header-right {
  display: flex;
  align-items: center;
  gap: var(--space-md);
}

.lang-switch {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  margin-right: var(--space-md);
}

.lang-switch button {
  background: transparent;
  border: none;
  color: var(--color-text-tertiary);
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
}

.lang-switch button:hover {
  color: var(--color-text-primary);
  background: var(--color-bg-overlay);
}

.lang-switch button.active {
  color: var(--color-primary);
  background: hsla(250, 70%, 60%, 0.1);
}

.lang-switch .divider {
  color: var(--color-border);
}

.search-input {
  padding: var(--space-sm) var(--space-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-size: var(--text-sm);
  min-width: 250px;
  transition: all var(--transition-fast);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  background: var(--color-bg-overlay);
}

.playground-filters {
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  padding: var(--space-md) 0;
}

.filters-content {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
}

.filter-group label {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  font-weight: 500;
}

.filter-group select {
  padding: var(--space-xs) var(--space-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.filter-group select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.playground-main {
  flex: 1;
  padding: var(--space-xl) 0;
}

.main-content {
  display: grid;
  gap: var(--space-xl);
}

.task-list-container {
  min-height: 400px;
}
</style>

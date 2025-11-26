<template>
  <div class="debug-panel" :class="{ collapsed: isCollapsed }">
    <button class="debug-panel-toggle" @click="isCollapsed = !isCollapsed">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M4 6L8 10L12 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      {{ t('debug.title') }}
    </button>
    
    <div v-if="!isCollapsed" class="debug-panel-content">
      <div class="debug-section">
        <h4>{{ t('debug.apiSimulation') }}</h4>
        
        <div class="debug-control">
          <label for="latency">{{ t('debug.latency') }}</label>
          <input
            id="latency"
            v-model.number="apiState.latency"
            type="range"
            min="0"
            max="3000"
            step="100"
          />
          <span class="debug-value">{{ apiState.latency }}ms</span>
        </div>
        
        <div class="debug-control">
          <label>
            <input v-model="apiState.failNext" type="checkbox" />
            {{ t('debug.failNext') }}
          </label>
        </div>
        
        <div class="debug-control">
          <label>
            <input v-model="apiState.mode.emptyTasks" type="checkbox" />
            {{ t('debug.emptyMode') }}
          </label>
        </div>
      </div>
      
      <div class="debug-section">
        <h4>{{ t('debug.permissions') }}</h4>
        
        <div class="debug-control">
          <label>
            <input v-model="apiState.permissions.createTask" type="checkbox" />
            {{ t('debug.canCreate') }}
          </label>
        </div>
        
        <div class="debug-control">
          <label>
            <input v-model="apiState.permissions.editTask" type="checkbox" />
            {{ t('debug.canEdit') }}
          </label>
        </div>
        
        <div class="debug-control">
          <label>
            <input v-model="apiState.permissions.deleteTask" type="checkbox" />
            {{ t('debug.canDelete') }}
          </label>
        </div>
      </div>
      
      <div class="debug-section">
        <h4>{{ t('debug.eventLog') }}</h4>
        <div class="event-log">
          <div v-for="event in eventLog" :key="event.id" class="event-item">
            <span class="event-time">{{ event.time }}</span>
            <span :class="['event-type', `event-${event.type}`]">{{ event.type }}</span>
            <span class="event-message">{{ event.message }}</span>
          </div>
          <div v-if="eventLog.length === 0" class="event-empty">{{ t('debug.noEvents') }}</div>
        </div>
        <Button variant="ghost" @click="clearLog">{{ t('debug.clearLog') }}</Button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { apiState } from '../services/mockApi';
import Button from './ui/Button.vue';
import { useI18n } from '../composables/useI18n';

export default {
  name: 'DebugPanel',
  components: {
    Button,
  },
  setup() {
    const { t } = useI18n();
    const isCollapsed = ref(false);
    const eventLog = ref([]);
    
    const logEvent = (type, message) => {
      const now = new Date();
      const time = now.toLocaleTimeString('en-US', { hour12: false });
      
      eventLog.value.unshift({
        id: Date.now() + Math.random(),
        time,
        type,
        message,
      });
      
      // Keep only last 20 events
      if (eventLog.value.length > 20) {
        eventLog.value = eventLog.value.slice(0, 20);
      }
    };
    
    const clearLog = () => {
      eventLog.value = [];
    };
    
    // Expose logEvent for external use
    window.debugLog = logEvent;
    
    return {
      isCollapsed,
      apiState,
      eventLog,
      logEvent,
      clearLog,
      t,
    };
  },
};
</script>

<style scoped>
.debug-panel {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--color-bg-elevated);
  border-top: 2px solid var(--color-primary);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
  z-index: var(--z-sticky);
  transition: transform var(--transition-base);
}

.debug-panel.collapsed {
  transform: translateY(calc(100% - 40px));
}

.debug-panel-toggle {
  width: 100%;
  padding: var(--space-sm) var(--space-lg);
  background: transparent;
  border: none;
  color: var(--color-text-primary);
  font-weight: 600;
  font-size: var(--text-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  transition: background var(--transition-fast);
}

.debug-panel-toggle:hover {
  background: var(--color-bg-overlay);
}

.debug-panel-toggle svg {
  transition: transform var(--transition-fast);
}

.debug-panel.collapsed .debug-panel-toggle svg {
  transform: rotate(180deg);
}

.debug-panel-content {
  padding: var(--space-lg);
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-xl);
  max-height: 400px;
  overflow-y: auto;
}

.debug-section {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.debug-section h4 {
  margin: 0;
  font-size: var(--text-sm);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-primary);
}

.debug-control {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.debug-control label {
  font-size: var(--text-sm);
  color: var(--color-text-secondary);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  cursor: pointer;
}

.debug-control input[type="checkbox"] {
  cursor: pointer;
}

.debug-control input[type="range"] {
  width: 100%;
  cursor: pointer;
}

.debug-value {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-primary);
}

.event-log {
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  max-height: 200px;
  overflow-y: auto;
  padding: var(--space-sm);
  background: var(--color-bg);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.event-item {
  display: flex;
  gap: var(--space-sm);
  font-size: var(--text-xs);
  font-family: var(--font-mono);
  padding: var(--space-xs);
  border-bottom: 1px solid var(--color-border);
}

.event-item:last-child {
  border-bottom: none;
}

.event-time {
  color: var(--color-text-tertiary);
  flex-shrink: 0;
}

.event-type {
  font-weight: 600;
  text-transform: uppercase;
  flex-shrink: 0;
}

.event-type.event-success {
  color: var(--color-success);
}

.event-type.event-error {
  color: var(--color-error);
}

.event-type.event-info {
  color: var(--color-info);
}

.event-message {
  color: var(--color-text-secondary);
  flex: 1;
}

.event-empty {
  color: var(--color-text-tertiary);
  font-style: italic;
  text-align: center;
  padding: var(--space-md);
}
</style>

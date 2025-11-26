import { reactive } from 'vue';
import { v4 as uuidv4 } from 'uuid';

// ============================================
// API State for Debugging
// ============================================
export const apiState = reactive({
  latency: 500, // ms
  failNext: false,
  permissions: {
    deleteTask: true,
    editTask: true,
    createTask: true,
  },
  mode: {
    emptyTasks: false,
  },
});

// ============================================
// Mock Data
// ============================================
const mockTasks = [
  {
    id: 't001',
    title: 'Prepare meeting notes',
    description: 'Summarize yesterday\'s discussion and prepare action items.',
    priority: 'High',
    tags: ['Work', 'Documentation'],
    status: 'In Progress',
    dueDate: '2025-11-30T00:00:00Z',
    createdAt: '2025-11-20T10:00:00Z',
    activityLog: [
      { timestamp: '2025-11-20T10:00:00Z', action: 'Created task' },
      { timestamp: '2025-11-21T14:30:00Z', action: 'Changed status to In Progress' },
    ],
  },
  {
    id: 't002',
    title: 'Review pull requests',
    description: 'Check and approve pending PRs from the team.',
    priority: 'Medium',
    tags: ['Work', 'Code Review'],
    status: 'To Do',
    dueDate: '2025-11-28T00:00:00Z',
    createdAt: '2025-11-21T09:00:00Z',
    activityLog: [
      { timestamp: '2025-11-21T09:00:00Z', action: 'Created task' },
    ],
  },
  {
    id: 't003',
    title: 'Update project documentation',
    description: 'Add new API endpoints to the documentation.',
    priority: 'Low',
    tags: ['Documentation'],
    status: 'To Do',
    dueDate: '2025-12-05T00:00:00Z',
    createdAt: '2025-11-22T11:00:00Z',
    activityLog: [
      { timestamp: '2025-11-22T11:00:00Z', action: 'Created task' },
    ],
  },
  {
    id: 't004',
    title: 'Fix login bug',
    description: 'Users are unable to login with special characters in password.',
    priority: 'High',
    tags: ['Bug', 'Critical'],
    status: 'In Progress',
    dueDate: '2025-11-27T00:00:00Z',
    createdAt: '2025-11-23T08:00:00Z',
    activityLog: [
      { timestamp: '2025-11-23T08:00:00Z', action: 'Created task' },
      { timestamp: '2025-11-23T10:00:00Z', action: 'Changed priority to High' },
    ],
  },
  {
    id: 't005',
    title: 'Design new landing page',
    description: 'Create mockups for the new marketing landing page.',
    priority: 'Medium',
    tags: ['Design', 'Marketing'],
    status: 'Done',
    dueDate: '2025-11-25T00:00:00Z',
    createdAt: '2025-11-18T14:00:00Z',
    activityLog: [
      { timestamp: '2025-11-18T14:00:00Z', action: 'Created task' },
      { timestamp: '2025-11-24T16:00:00Z', action: 'Changed status to Done' },
    ],
  },
];

const mockTags = ['Work', 'Documentation', 'Code Review', 'Bug', 'Critical', 'Design', 'Marketing', 'Personal'];

// In-memory storage
let tasks = [...mockTasks];
let tags = [...mockTags];

// ============================================
// Helper Functions
// ============================================
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const simulateRequest = async () => {
  await delay(apiState.latency);
  
  if (apiState.failNext) {
    apiState.failNext = false; // Reset after one failure
    throw new Error('Simulated API failure');
  }
};

// ============================================
// Task API
// ============================================
export const getTasks = async () => {
  await simulateRequest();
  
  if (apiState.mode.emptyTasks) {
    return [];
  }
  
  return [...tasks];
};

export const getTaskById = async (id) => {
  await simulateRequest();
  
  const task = tasks.find((t) => t.id === id);
  if (!task) {
    throw new Error('Task not found');
  }
  
  return { ...task };
};

export const createTask = async (taskData) => {
  await simulateRequest();
  
  if (!apiState.permissions.createTask) {
    throw new Error('Permission denied: Cannot create task');
  }
  
  const newTask = {
    id: uuidv4(),
    ...taskData,
    createdAt: new Date().toISOString(),
    activityLog: [
      { timestamp: new Date().toISOString(), action: 'Created task' },
    ],
  };
  
  tasks.push(newTask);
  return { ...newTask };
};

export const updateTask = async (id, updates) => {
  await simulateRequest();
  
  if (!apiState.permissions.editTask) {
    throw new Error('Permission denied: Cannot edit task');
  }
  
  const taskIndex = tasks.findIndex((t) => t.id === id);
  if (taskIndex === -1) {
    throw new Error('Task not found');
  }
  
  const updatedTask = {
    ...tasks[taskIndex],
    ...updates,
    activityLog: [
      ...tasks[taskIndex].activityLog,
      { timestamp: new Date().toISOString(), action: 'Updated task' },
    ],
  };
  
  tasks[taskIndex] = updatedTask;
  return { ...updatedTask };
};

export const deleteTask = async (id) => {
  await simulateRequest();
  
  if (!apiState.permissions.deleteTask) {
    throw new Error('Permission denied: Cannot delete task');
  }
  
  const taskIndex = tasks.findIndex((t) => t.id === id);
  if (taskIndex === -1) {
    throw new Error('Task not found');
  }
  
  tasks.splice(taskIndex, 1);
  return { success: true };
};

export const reorderTasks = async (taskIds) => {
  await simulateRequest();
  
  // Reorder tasks based on the provided array of IDs
  const reordered = taskIds.map((id) => tasks.find((t) => t.id === id)).filter(Boolean);
  tasks = reordered;
  
  return { success: true };
};

// ============================================
// Tag API
// ============================================
export const getTags = async () => {
  await simulateRequest();
  return [...tags];
};

export const createTag = async (tagName) => {
  await simulateRequest();
  
  if (tags.includes(tagName)) {
    throw new Error('Tag already exists');
  }
  
  tags.push(tagName);
  return tagName;
};

export const deleteTag = async (tagName) => {
  await simulateRequest();
  
  const tagIndex = tags.indexOf(tagName);
  if (tagIndex === -1) {
    throw new Error('Tag not found');
  }
  
  tags.splice(tagIndex, 1);
  
  // Remove tag from all tasks
  tasks = tasks.map((task) => ({
    ...task,
    tags: task.tags.filter((t) => t !== tagName),
  }));
  
  return { success: true };
};

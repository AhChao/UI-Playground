export const translations = {
    'en': {
        // Header
        'app.title': 'Task Manager Playground',
        'app.subtitle': 'UI Integration Testing Environment',
        'app.searchPlaceholder': 'Search tasks...',
        'app.createTask': 'Create Task',

        // Filters
        'filter.status': 'Status:',
        'filter.priority': 'Priority:',
        'filter.sortBy': 'Sort by:',
        'filter.all': 'All',
        'filter.clear': 'Clear Filters',

        // Sort Options
        'sort.dueDate': 'Due Date',
        'sort.priority': 'Priority',
        'sort.createdAt': 'Created Date',

        // Task List
        'list.loading': 'Loading tasks...',
        'list.empty.title': 'No tasks found',
        'list.empty.subtitle': 'Create your first task to get started',

        // Task Item
        'task.overdue': 'Overdue',
        'task.today': 'Today',
        'task.tomorrow': 'Tomorrow',
        'task.days': 'days',

        // Status
        'status.todo': 'To Do',
        'status.inprogress': 'In Progress',
        'status.done': 'Done',

        // Priority
        'priority.high': 'High',
        'priority.medium': 'Medium',
        'priority.low': 'Low',

        // Modal
        'modal.createTitle': 'Create New Task',
        'modal.editTitle': 'Edit Task',
        'modal.titleLabel': 'Title',
        'modal.titlePlaceholder': 'Enter task title',
        'modal.descLabel': 'Description',
        'modal.descPlaceholder': 'Enter task description',
        'modal.priorityLabel': 'Priority',
        'modal.statusLabel': 'Status',
        'modal.dueDateLabel': 'Due Date',
        'modal.tagsLabel': 'Tags',
        'modal.tagsPlaceholder': 'Type to add tags...',
        'modal.cancel': 'Cancel',
        'modal.save': 'Save Changes',
        'modal.create': 'Create Task',
        'modal.error.titleRequired': 'Title is required',
        'modal.error.descLength': 'Description must be less than 500 characters',

        // Drawer
        'drawer.title': 'Task Details',
        'drawer.noDescription': 'No description provided',
        'drawer.noDueDate': 'No due date',
        'drawer.noTags': 'No tags',
        'drawer.activityLog': 'Activity Log',
        'drawer.edit': 'Edit Task',
        'drawer.delete': 'Delete Task',
        'drawer.time.justNow': 'Just now',
        'drawer.time.minutesAgo': 'minute(s) ago',
        'drawer.time.hoursAgo': 'hour(s) ago',
        'drawer.time.daysAgo': 'day(s) ago',

        // Debug Panel
        'debug.title': 'Debug Panel',
        'debug.apiSimulation': 'API Simulation',
        'debug.latency': 'API Latency (ms)',
        'debug.failNext': 'Fail next API request',
        'debug.emptyMode': 'Empty tasks mode',
        'debug.permissions': 'Permissions',
        'debug.canCreate': 'Can create tasks',
        'debug.canEdit': 'Can edit tasks',
        'debug.canDelete': 'Can delete tasks',
        'debug.eventLog': 'Event Log',
        'debug.clearLog': 'Clear Log',
        'debug.noEvents': 'No events logged',

        // Toasts
        'toast.createSuccess': 'Task created successfully!',
        'toast.updateSuccess': 'Task updated successfully!',
        'toast.deleteSuccess': 'Task deleted successfully!',
        'toast.reorderSuccess': 'Tasks reordered',
        'toast.reorderError': 'Failed to reorder tasks',
        'toast.loadError': 'Failed to load initial data',
    },
    'zh-TW': {
        // Header
        'app.title': '任務管理 Playground',
        'app.subtitle': 'UI 整合測試環境',
        'app.searchPlaceholder': '搜尋任務...',
        'app.createTask': '建立任務',

        // Filters
        'filter.status': '狀態:',
        'filter.priority': '優先級:',
        'filter.sortBy': '排序:',
        'filter.all': '全部',
        'filter.clear': '清除篩選',

        // Sort Options
        'sort.dueDate': '截止日期',
        'sort.priority': '優先級',
        'sort.createdAt': '建立日期',

        // Task List
        'list.loading': '載入任務中...',
        'list.empty.title': '找不到任務',
        'list.empty.subtitle': '建立您的第一個任務以開始使用',

        // Task Item
        'task.overdue': '已過期',
        'task.today': '今天',
        'task.tomorrow': '明天',
        'task.days': '天',

        // Status
        'status.todo': '待辦',
        'status.inprogress': '進行中',
        'status.done': '已完成',

        // Priority
        'priority.high': '高',
        'priority.medium': '中',
        'priority.low': '低',

        // Modal
        'modal.createTitle': '建立新任務',
        'modal.editTitle': '編輯任務',
        'modal.titleLabel': '標題',
        'modal.titlePlaceholder': '輸入任務標題',
        'modal.descLabel': '描述',
        'modal.descPlaceholder': '輸入任務描述',
        'modal.priorityLabel': '優先級',
        'modal.statusLabel': '狀態',
        'modal.dueDateLabel': '截止日期',
        'modal.tagsLabel': '標籤',
        'modal.tagsPlaceholder': '輸入以新增標籤...',
        'modal.cancel': '取消',
        'modal.save': '儲存變更',
        'modal.create': '建立任務',
        'modal.error.titleRequired': '標題為必填',
        'modal.error.descLength': '描述必須少於 500 個字元',

        // Drawer
        'drawer.title': '任務詳情',
        'drawer.noDescription': '未提供描述',
        'drawer.noDueDate': '無截止日期',
        'drawer.noTags': '無標籤',
        'drawer.activityLog': '活動紀錄',
        'drawer.edit': '編輯任務',
        'drawer.delete': '刪除任務',
        'drawer.time.justNow': '剛剛',
        'drawer.time.minutesAgo': '分鐘前',
        'drawer.time.hoursAgo': '小時前',
        'drawer.time.daysAgo': '天前',

        // Debug Panel
        'debug.title': '除錯面板',
        'debug.apiSimulation': 'API 模擬',
        'debug.latency': 'API 延遲 (ms)',
        'debug.failNext': '下一次請求失敗',
        'debug.emptyMode': '空任務模式',
        'debug.permissions': '權限',
        'debug.canCreate': '可建立任務',
        'debug.canEdit': '可編輯任務',
        'debug.canDelete': '可刪除任務',
        'debug.eventLog': '事件紀錄',
        'debug.clearLog': '清除紀錄',
        'debug.noEvents': '無事件紀錄',

        // Toasts
        'toast.createSuccess': '任務建立成功！',
        'toast.updateSuccess': '任務更新成功！',
        'toast.deleteSuccess': '任務刪除成功！',
        'toast.reorderSuccess': '任務重新排序成功',
        'toast.reorderError': '任務重新排序失敗',
        'toast.loadError': '載入初始資料失敗',
    }
};

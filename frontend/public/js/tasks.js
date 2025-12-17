// Check authentication
if (!requireAuth()) {
    // Will redirect to login
}

// Global state
let allTasks = [];
let currentFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadUserInfo();
    loadTasks();
});

// Load user info
function loadUserInfo() {
    const user = UserManager.get();
    if (user) {
        document.getElementById('user-name').textContent = user.username;
        document.getElementById('user-avatar').textContent = getUserInitials(user.username);
    }
}

// Load all tasks
async function loadTasks() {
    try {
        UI.showLoading('task-list');

        console.log('Loading tasks...');
        const response = await api.get('/task/getTasks');
        console.log('Tasks loaded:', response);
        allTasks = response.data || [];

        renderTasks();
        updateCounts();

    } catch (error) {
        console.error('Load tasks error:', error);
        
        if (error.message.includes('Unauthorized') || error.message.includes('token')) {
            alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
            logout();
        } else {
            document.getElementById('task-list').innerHTML = `
                <div class="empty-state">
                    <h3>⚠️ Không thể tải danh sách công việc</h3>
                    <p>${error.message}</p>
                    <button class="btn-primary" onclick="loadTasks()">Thử Lại</button>
                </div>
            `;
        }
    }
}

// Render tasks based on filter
function renderTasks() {
    const taskList = document.getElementById('task-list');
    
    let filteredTasks = allTasks;
    if (currentFilter !== 'all') {
        filteredTasks = allTasks.filter(task => task.status === currentFilter);
    }

    if (filteredTasks.length === 0) {
        UI.showEmptyState('task-list', 
            currentFilter === 'all' ? 'Chưa có công việc nào' : `Không có công việc "${translateStatus(currentFilter)}"`
        );
        return;
    }

    taskList.innerHTML = filteredTasks.map(task => `
        <div class="task-item" data-task-id="${task._id}">
            <div class="task-header">
                <div class="task-title">${escapeHtml(task.title)}</div>
                <span class="task-status ${task.status.toLowerCase().replace(' ', '-')}">
                    ${getStatusIcon(task.status)} ${translateStatus(task.status)}
                </span>
            </div>
            <div class="task-meta">
                <span>
                    <svg style="width: 16px; height: 16px; display: inline-block; vertical-align: middle; margin-right: 4px;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Tạo: ${formatDate(task.createDate)}
                </span>
                <span>
                    <svg style="width: 16px; height: 16px; display: inline-block; vertical-align: middle; margin-right: 4px;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Cập nhật: ${formatDate(task.modifyDate)}
                </span>
            </div>
            <div class="task-actions">
                <button class="btn-edit" onclick="openEditModal('${task._id}')">
                    <svg style="width: 16px; height: 16px; display: inline-block; vertical-align: middle; margin-right: 4px;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Sửa
                </button>
                ${task.status !== 'Completed' ? `
                    <button class="btn-complete" onclick="markTaskComplete('${task._id}')">
                        <svg style="width: 16px; height: 16px; display: inline-block; vertical-align: middle; margin-right: 4px;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Hoàn thành
                    </button>
                ` : `
                    <button class="btn-secondary" onclick="markTaskIncomplete('${task._id}')">
                        <svg style="width: 16px; height: 16px; display: inline-block; vertical-align: middle; margin-right: 4px;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                        Chưa xong
                    </button>
                `}
                <button class="btn-delete" onclick="deleteTask('${task._id}')">
                    <svg style="width: 16px; height: 16px; display: inline-block; vertical-align: middle; margin-right: 4px;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Xóa
                </button>
            </div>
        </div>
    `).join('');
}

// Update task counts
function updateCounts() {
    const all = allTasks.length;
    const pending = allTasks.filter(t => t.status === 'Pending').length;
    const progress = allTasks.filter(t => t.status === 'In Progress').length;
    const completed = allTasks.filter(t => t.status === 'Completed').length;

    document.getElementById('count-all').textContent = all;
    document.getElementById('count-pending').textContent = pending;
    document.getElementById('count-progress').textContent = progress;
    document.getElementById('count-completed').textContent = completed;
}

// Filter tasks
function filterTasks(filter) {
    currentFilter = filter;

    // Update active filter button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-filter="${filter}"]`).classList.add('active');

    renderTasks();
}

// Create new task
async function handleCreateTask(event) {
    event.preventDefault();

    const title = document.getElementById('task-title').value.trim();
    const status = document.getElementById('task-status').value;
    const submitBtn = event.target.querySelector('button[type="submit"]');

    if (!title) {
        alert('Vui lòng nhập tên công việc');
        return;
    }

    try {
        UI.disableButton(submitBtn);
        submitBtn.textContent = 'Đang tạo...';

        console.log('Creating task:', { title, status });
        const response = await api.post('/task/createTask', { title, status });
        console.log('Task created:', response);

        // Clear form
        document.getElementById('task-title').value = '';
        document.getElementById('task-status').value = 'Pending';

        // Reload tasks
        await loadTasks();

        // Show success (optional)
        alert('✅ Tạo công việc thành công!');

    } catch (error) {
        console.error('Create task error:', error);
        alert('❌ Không thể tạo công việc: ' + error.message);
    } finally {
        UI.disableButton(submitBtn, false);
        submitBtn.textContent = 'Tạo Mới';
    }
}

// Open edit modal
function openEditModal(taskId) {
    const task = allTasks.find(t => t._id === taskId);
    if (!task) return;

    document.getElementById('edit-task-id').value = task._id;
    document.getElementById('edit-task-title').value = task.title;
    document.getElementById('edit-task-status').value = task.status;

    document.getElementById('edit-modal').classList.add('show');
}

// Close edit modal
function closeEditModal() {
    document.getElementById('edit-modal').classList.remove('show');
}

// Update task
async function handleUpdateTask(event) {
    event.preventDefault();

    const _id = document.getElementById('edit-task-id').value;
    const title = document.getElementById('edit-task-title').value.trim();
    const status = document.getElementById('edit-task-status').value;
    const submitBtn = event.target.querySelector('button[type="submit"]');

    if (!title) {
        alert('Vui lòng nhập tên công việc');
        return;
    }

    try {
        UI.disableButton(submitBtn);
        submitBtn.textContent = 'Đang lưu...';

        console.log('Updating task:', { _id, title, status });
        const response = await api.post('/task/updateTask', { _id, title, status });
        console.log('Task updated:', response);

        closeEditModal();
        await loadTasks();

        alert('✅ Cập nhật công việc thành công!');

    } catch (error) {
        console.error('Update task error:', error);
        alert('❌ Không thể cập nhật: ' + error.message);
    } finally {
        UI.disableButton(submitBtn, false);
        submitBtn.textContent = 'Lưu Thay Đổi';
    }
}

// Mark task as complete
async function markTaskComplete(taskId) {
    if (!confirm('Đánh dấu công việc này là hoàn thành?')) return;

    try {
        console.log('Marking task as done:', taskId);
        const response = await api.post('/task/markDone', { _id: taskId });
        console.log('Task marked as done:', response);
        await loadTasks();
    } catch (error) {
        console.error('Mark done error:', error);
        alert('❌ Không thể cập nhật: ' + error.message);
    }
}

// Mark task as incomplete
async function markTaskIncomplete(taskId) {
    if (!confirm('Đánh dấu công việc này là chưa hoàn thành?')) return;

    try {
        console.log('Marking task as incomplete:', taskId);
        const response = await api.post('/task/markUnDone', { _id: taskId });
        console.log('Task marked as incomplete:', response);
        await loadTasks();
    } catch (error) {
        console.error('Mark undone error:', error);
        alert('❌ Không thể cập nhật: ' + error.message);
    }
}

// Delete task
async function deleteTask(taskId) {
    if (!confirm('⚠️ Bạn có chắc muốn xóa công việc này?')) return;

    try {
        console.log('Deleting task:', taskId);
        const response = await api.post('/task/deActivateTask', { _id: taskId });
        console.log('Task deleted:', response);
        await loadTasks();
        alert('✅ Đã xóa công việc');
    } catch (error) {
        console.error('Delete task error:', error);
        alert('❌ Không thể xóa: ' + error.message);
    }
}

// Handle logout
async function handleLogout() {
    if (!confirm('Bạn có chắc muốn đăng xuất?')) return;

    try {
        // Call logout API
        await api.post('/auth/logout');
    } catch (error) {
        console.error('Logout API error:', error);
    } finally {
        // Always logout locally
        logout();
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Get status icon
function getStatusIcon(status) {
    const icons = {
        'Pending': '🕐',
        'In Progress': '⚡',
        'Completed': '✅'
    };
    return icons[status] || '📋';
}

// Close modal when clicking outside
document.getElementById('edit-modal').addEventListener('click', (e) => {
    if (e.target.id === 'edit-modal') {
        closeEditModal();
    }
});

// Make functions global
window.filterTasks = filterTasks;
window.handleCreateTask = handleCreateTask;
window.openEditModal = openEditModal;
window.closeEditModal = closeEditModal;
window.handleUpdateTask = handleUpdateTask;
window.markTaskComplete = markTaskComplete;
window.markTaskIncomplete = markTaskIncomplete;
window.deleteTask = deleteTask;
window.handleLogout = handleLogout;


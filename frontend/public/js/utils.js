// API Configuration
const API_BASE_URL = 'http://localhost:3000';

// Token Management quản lý jwt token
const TokenManager = {
    get: () => localStorage.getItem('accessToken'),  // Lấy token
    set: (token) => localStorage.setItem('accessToken', token),// Lưu token
    remove: () => localStorage.removeItem('accessToken'),// Xóa token (logout)
    exists: () => !!localStorage.getItem('accessToken') // Kiểm tra có token không
};

// User Management quan lý thông tin user
const UserManager = {
    get: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    set: (user) => localStorage.setItem('user', JSON.stringify(user)),
    remove: () => localStorage.removeItem('user'),
    getUsername: () => {
        const user = UserManager.get();
        return user ? user.username : '';
    }
};

// API Helper gọi api đến backend 
const api = {
    // Generic fetch with auth
    async request(endpoint, options = {}) {
        const token = TokenManager.get();
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        try {
            const response = await fetch(`${API_BASE_URL}${endpoint}`, {
                ...options,
                headers
            });

            // Try to parse JSON response
            let data;
            try {
                data = await response.json();
            } catch (e) {
                data = { message: 'Invalid response from server' };
            }

            if (!response.ok) {
                // Handle authentication errors
                if (response.status === 401 || response.status === 403) {
                    const errorMsg = data.message || data.error || 'Session expired';
                    // Auto logout on auth errors
                    if (errorMsg.includes('token') || errorMsg.includes('Unauthorized')) {
                        setTimeout(() => {
                            TokenManager.remove();
                            UserManager.remove();
                            window.location.href = '/';
                        }, 1000);
                    }
                    throw new Error(errorMsg);
                }
                
                // Handle other errors
                const errorMsg = data.message || data.error?.message || data.error || 'Request failed';
                throw new Error(errorMsg);
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            console.error('Endpoint:', endpoint);
            console.error('Options:', options);
            throw error;
        }
    },

    // GET request
    get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    },

    // POST request
    post(endpoint, body) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        });
    },

    // PUT request
    put(endpoint, body) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body)
        });
    },

    // DELETE request
    delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }
};

// UI Helpers
const UI = {
    // Show message
    showMessage(elementId, message, type = 'success') {
        const messageEl = document.getElementById(elementId);
        if (!messageEl) return;

        messageEl.textContent = message;
        messageEl.className = `message ${type} show`;

        setTimeout(() => {
            messageEl.classList.remove('show');
        }, 5000);
    },

    // Clear message
    clearMessage(elementId) {
        const messageEl = document.getElementById(elementId);
        if (messageEl) {
            messageEl.className = 'message';
            messageEl.textContent = '';
        }
    },

    // Show loading
    showLoading(elementId, show = true) {
        const element = document.getElementById(elementId);
        if (!element) return;

        if (show) {
            element.innerHTML = `
                <div class="loading">
                    <div class="spinner"></div>
                    <p>Đang tải...</p>
                </div>
            `;
        }
    },

    // Show empty state
    showEmptyState(elementId, message = 'Không có dữ liệu') {
        const element = document.getElementById(elementId);
        if (!element) return;

        element.innerHTML = `
            <div class="empty-state">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <h3>${message}</h3>
                <p>Hãy tạo công việc đầu tiên của bạn!</p>
            </div>
        `;
    },

    // Disable button
    disableButton(button, disabled = true) {
        if (!button) return;
        button.disabled = disabled;
        if (disabled) {
            button.style.opacity = '0.6';
            button.style.cursor = 'not-allowed';
        } else {
            button.style.opacity = '1';
            button.style.cursor = 'pointer';
        }
    }
};

// Format Date
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffMinutes = Math.floor(diffTime / (1000 * 60));
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffMinutes < 1) {
        return 'Vừa xong';
    } else if (diffMinutes < 60) {
        return `${diffMinutes} phút trước`;
    } else if (diffHours < 24) {
        return `${diffHours} giờ trước`;
    } else if (diffDays === 1) {
        return 'Hôm qua';
    } else if (diffDays < 7) {
        return `${diffDays} ngày trước`;
    } else {
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Get user initials for avatar
function getUserInitials(username) {
    if (!username) return '?';
    const parts = username.trim().split(' ');
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return username.substring(0, 2).toUpperCase();
}

// Status translation
const STATUS_MAP = {
    'Pending': 'Chờ xử lý',
    'In Progress': 'Đang thực hiện',
    'Completed': 'Hoàn thành'
};

function translateStatus(status) {
    return STATUS_MAP[status] || status;
}

// Check authentication
function requireAuth() {
    if (!TokenManager.exists()) {
        window.location.href = '/';
        return false;
    }
    return true;
}

// Logout
function logout() {
    TokenManager.remove();
    UserManager.remove();
    window.location.href = '/';
}

// Export for use in other scripts
window.API_BASE_URL = API_BASE_URL;
window.TokenManager = TokenManager;
window.UserManager = UserManager;
window.api = api;
window.UI = UI;
window.formatDate = formatDate;
window.getUserInitials = getUserInitials;
window.translateStatus = translateStatus;
window.requireAuth = requireAuth;
window.logout = logout;

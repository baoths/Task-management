// Check if already logged in
if (TokenManager.exists()) {
    window.location.href = '/tasks.html';
}

// Tab Switching
function showTab(tabName) {
    // Hide all forms
    document.querySelectorAll('.form-container').forEach(form => {
        form.classList.remove('active');
    });

    // Remove active class from all tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected form
    document.getElementById(`${tabName}-form`).classList.add('active');

    // Add active class to clicked tab
    event.target.classList.add('active');

    // Clear messages
    UI.clearMessage('login-message');
    UI.clearMessage('register-message');
}

// Handle Login
async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const submitBtn = event.target.querySelector('button[type="submit"]');

    // Validation
    if (!email || !password) {
        UI.showMessage('login-message', 'Vui lòng điền đầy đủ thông tin', 'error');
        return;
    }

    try {
        // Disable button
        UI.disableButton(submitBtn);
        submitBtn.textContent = 'Đang đăng nhập...';

        // Call login API
        console.log('Attempting login for:', email);
        const response = await api.post('/auth/login', {
            email,
            password
        });
        console.log('Login response:', response);

        // Save token and user info
        TokenManager.set(response.accessToken);
        UserManager.set({
            id: response.id,
            username: response.username,
            email: response.email
        });

        // Show success message
        UI.showMessage('login-message', 'Đăng nhập thành công! Đang chuyển hướng...', 'success');

        // Redirect to tasks page
        setTimeout(() => {
            window.location.href = '/tasks.html';
        }, 1000);

    } catch (error) {
        console.error('Login error:', error);
        UI.showMessage('login-message', error.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại email và mật khẩu.', 'error');
        
        // Re-enable button
        UI.disableButton(submitBtn, false);
        submitBtn.textContent = 'Đăng Nhập';
    }
}

// Handle Register
async function handleRegister(event) {
    event.preventDefault();

    const username = document.getElementById('register-name').value.trim();
    const email = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const submitBtn = event.target.querySelector('button[type="submit"]');

    // Validation
    if (!username || !email || !password) {
        UI.showMessage('register-message', 'Vui lòng điền đầy đủ thông tin', 'error');
        return;
    }

    if (password.length < 6) {
        UI.showMessage('register-message', 'Mật khẩu phải có ít nhất 6 ký tự', 'error');
        return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        UI.showMessage('register-message', 'Email không hợp lệ', 'error');
        return;
    }

    try {
        // Disable button
        UI.disableButton(submitBtn);
        submitBtn.textContent = 'Đang đăng ký...';

        // Call register API
        console.log('Attempting register for:', { username, email });
        const response = await api.post('/auth/register', {
            username,
            email,
            password
        });
        console.log('Register response:', response);

        // Show success message
        UI.showMessage('register-message', 'Đăng ký thành công! Vui lòng đăng nhập.', 'success');

        // Clear form
        document.getElementById('register-name').value = '';
        document.getElementById('register-email').value = '';
        document.getElementById('register-password').value = '';

        // Switch to login tab after 2 seconds
        setTimeout(() => {
            const loginTab = document.querySelector('.tab-btn:first-child');
            loginTab.click();
            
            // Pre-fill email
            document.getElementById('login-email').value = email;
        }, 2000);

    } catch (error) {
        console.error('Register error:', error);
        let errorMessage = error.message || 'Đăng ký thất bại. Vui lòng thử lại.';
        
        if (error.message.includes('duplicate') || error.message.includes('exists') || error.message.includes('đã tồn tại')) {
            errorMessage = 'Email hoặc tên đăng nhập đã tồn tại';
        }

        UI.showMessage('register-message', errorMessage, 'error');
    } finally {
        // Re-enable button
        UI.disableButton(submitBtn, false);
        submitBtn.textContent = 'Đăng Ký';
    }
}

// Make functions global
window.showTab = showTab;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;

document.addEventListener('DOMContentLoaded', function() {
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    // Form toggle
    signUpButton.addEventListener('click', () => container.classList.add('right-panel-active'));
    signInButton.addEventListener('click', () => container.classList.remove('right-panel-active'));

    // Login handler
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = this.querySelector('input[type="email"]').value;
        const password = this.querySelector('input[type="password"]').value;
        
        const btn = this.querySelector('button');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In';
        btn.disabled = true;

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Login failed');
            }

            // Store auth data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({ name: data.name, userType: data.userType }));
            localStorage.setItem('isLoggedIn', 'true');
            
            // Redirect based on userType
            if (data.userType === 'admin') {
                window.location.href = '/admin/dashboard';
            } else {
                window.location.href = '/main';
            }
            
        } catch (error) {
            alert(error.message);
        } finally {
            btn.innerHTML = 'Sign In';
            btn.disabled = false;
        }
    });

    // Signup handler
    signupForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const name = this.querySelector('input[type="text"]').value;
        const email = this.querySelector('input[type="email"]').value;
        const password = this.querySelector('input[type="password"]').value;

        const btn = this.querySelector('button');
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering';
        btn.disabled = true;

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Registration failed');
            }

            // Store auth data
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('isLoggedIn', 'true');
            
            alert('Registration successful! Redirecting...');
            window.location.href = '/main';
            
        } catch (error) {
            alert(error.message);
        } finally {
            btn.innerHTML = 'Sign Up';
            btn.disabled = false;
        }
    });
});
// Update the login function to properly handle tokens
async function loginUser(email, password) {
    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Login failed');
        }

        const data = await response.json();
        
        // Store token and user data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('isLoggedIn', 'true');
        
        // Check for pending reminder after login
        const pendingReminder = localStorage.getItem('reminderAfterLogin');
        if (pendingReminder) {
            localStorage.removeItem('reminderAfterLogin');
            window.location.href = 'upcoming.html';
        } else {
            window.location.href = 'main.html';
        }
    } catch (error) {
        showNotification(error.message, 'error');
    }
}
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const loginBtn = document.getElementById('loginBtn');
    
    if (loginBtn) {
        loginBtn.textContent = isLoggedIn ? 'Logout' : 'Login';
        
        loginBtn.addEventListener('click', (e) => {
            if (loginBtn.textContent === 'Logout') {
                e.preventDefault();
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = 'index.html';
            }
        });
    }
}
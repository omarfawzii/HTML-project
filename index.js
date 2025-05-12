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
            const response = await fetch('http://localhost:3000/api/auth/login', {
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
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('isLoggedIn', 'true');
            
            // Redirect to main page
            window.location.href = 'main.html';
            
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
            const response = await fetch('http://localhost:3000/api/auth/register', {
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
            window.location.href = 'main.html';
            
        } catch (error) {
            alert(error.message);
        } finally {
            btn.innerHTML = 'Sign Up';
            btn.disabled = false;
        }
    });
});
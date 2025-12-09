
        // Register Show Password
        const form = document.getElementById('registerForm');
        const username = document.getElementById('name');
        const password = document.getElementById('password');
        const role = document.getElementById('role');
        const feedback = document.getElementById('feedback');
        const pwToggle = document.getElementById('pwToggle');
        const submitBtn = document.getElementById('submitBtn');

        // Toggle password visibility
        pwToggle.addEventListener('click', () => {
            const showing = password.type === 'text';
            password.type = showing ? 'password' : 'text';
            pwToggle.textContent = showing ? 'Show' : 'Hide';
            pwToggle.setAttribute('aria-pressed', String(!showing));
            password.focus();
        });

        // Registration form validation
        form.addEventListener('submit', (e) => {
            feedback.textContent = '';
            feedback.className = '';

            const nameVal = username.value.trim();
            const pwVal = password.value.trim();
            const roleVal = role.value;

            if (!nameVal) {
                showError('Please enter a username.');
                username.focus();
                e.preventDefault();
                return;
            }

            if (!pwVal) {
                showError('Please enter a password.');
                password.focus();
                e.preventDefault();
                return;
            }

            if (!roleVal) {
                showError('Please select a role.');
                role.focus();
                e.preventDefault();
                return;
            }

            // Disable button on valid submit
            submitBtn.disabled = true;
            submitBtn.textContent = 'Creating...';
        });

        function showError(msg) {
            feedback.textContent = msg;
            feedback.className = 'error';
        }

        function openAbout() {
            alert("About SSC Financial Management System");
        }

        function openSettings() {
            alert("Settings feature coming soon...");
        }

        function goBack() {
            window.history.back();
        }
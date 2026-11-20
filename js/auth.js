/**
 * FindIt AI - Authentication Logic (auth.js)
 * Manages Login, Registration, Password Toggle, and Demo Accounts
 */

document.addEventListener('DOMContentLoaded', () => {
  initPasswordToggles();
  initLoginForm();
  initSignupForm();
  initForgotPasswordForm();
});

// Toggle password visibility
function initPasswordToggles() {
  const toggleButtons = document.querySelectorAll('.password-toggle-btn');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetInputId = btn.getAttribute('data-target');
      const input = document.getElementById(targetInputId);
      if (input) {
        if (input.type === 'password') {
          input.type = 'text';
          btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;
        } else {
          input.type = 'password';
          btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
        }
      }
    });
  });
}

// User / Admin Login
function initLoginForm() {
  const loginForm = document.getElementById('login-form');
  if (!loginForm) return;

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const errorBox = document.getElementById('login-error-msg');

    if (errorBox) errorBox.classList.remove('visible');

    // Validation
    if (!email || !password) {
      if (errorBox) {
        errorBox.textContent = 'Please fill in both email and password.';
        errorBox.classList.add('visible');
      }
      return;
    }

    const state = getState();

    // Check if logging in as Admin
    if (email.toLowerCase() === state.adminUser.email.toLowerCase()) {
      sessionStorage.setItem('findit_logged_in', 'true');
      sessionStorage.setItem('findit_session_role', 'admin');
      showToast('Welcome back, Admin Sarah!', 'success');
      setTimeout(() => {
        window.location.href = 'admin/dashboard.html';
      }, 500);
      return;
    }

    // Normal user check
    const userMatch = state.registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (userMatch) {
      if (userMatch.status === 'Suspended') {
        if (errorBox) {
          errorBox.textContent = 'This account has been suspended by administration.';
          errorBox.classList.add('visible');
        }
        return;
      }

      sessionStorage.setItem('findit_logged_in', 'true');
      sessionStorage.setItem('findit_session_role', 'user');
      showToast(`Welcome back, ${userMatch.name}!`, 'success');
      setTimeout(() => {
        window.location.href = 'user/dashboard.html';
      }, 500);
    } else {
      // Allow flexible demo login
      sessionStorage.setItem('findit_logged_in', 'true');
      sessionStorage.setItem('findit_session_role', 'user');
      showToast('Login successful! Redirecting to dashboard...', 'success');
      setTimeout(() => {
        window.location.href = 'user/dashboard.html';
      }, 500);
    }
  });

  // Demo auto-fill helpers
  const fillUserBtn = document.getElementById('btn-demo-user');
  if (fillUserBtn) {
    fillUserBtn.addEventListener('click', () => {
      document.getElementById('login-email').value = 'alex.morgan@example.com';
      document.getElementById('login-password').value = 'Password123!';
    });
  }

  const fillAdminBtn = document.getElementById('btn-demo-admin');
  if (fillAdminBtn) {
    fillAdminBtn.addEventListener('click', () => {
      document.getElementById('login-email').value = 'admin@findit.ai';
      document.getElementById('login-password').value = 'AdminPass2026!';
    });
  }
}

// User Registration
function initSignupForm() {
  const signupForm = document.getElementById('signup-form');
  if (!signupForm) return;

  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fullName = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const phone = document.getElementById('signup-phone').value.trim();
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm-password').value;
    const termsAccepted = document.getElementById('signup-terms').checked;
    const errorBox = document.getElementById('signup-error-msg');

    if (errorBox) errorBox.classList.remove('visible');

    // Validations
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      if (errorBox) {
        errorBox.textContent = 'All fields are required.';
        errorBox.classList.add('visible');
      }
      return;
    }

    // Phone validation
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (!phoneRegex.test(phone.replace(/\s+/g, ''))) {
      if (errorBox) {
        errorBox.textContent = 'Please enter a valid phone number with country code.';
        errorBox.classList.add('visible');
      }
      return;
    }

    // Password Match
    if (password !== confirmPassword) {
      if (errorBox) {
        errorBox.textContent = 'Passwords do not match.';
        errorBox.classList.add('visible');
      }
      return;
    }

    if (!termsAccepted) {
      if (errorBox) {
        errorBox.textContent = 'You must accept the Terms and Conditions.';
        errorBox.classList.add('visible');
      }
      return;
    }

    // Register user into state
    const state = getState();
    const newUser = {
      id: generateId('USR'),
      name: fullName,
      email: email,
      phone: phone,
      role: 'user',
      reportsCount: 0,
      points: 100, // Welcome reward bonus!
      status: 'Active'
    };

    state.registeredUsers.push(newUser);
    state.currentUser = {
      ...newUser,
      organization: 'General Community Member',
      avatar: fullName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
      rewardPoints: 100,
      badges: []
    };

    // Add welcome notification
    state.notifications.unshift({
      id: generateId('NTF'),
      userId: newUser.id,
      type: 'reward',
      title: '🎁 Welcome Bonus Credited!',
      message: 'You received 100 starter reward points for creating an account with FindIt AI.',
      link: 'rewards.html',
      isRead: false,
      timestamp: 'Just now'
    });

    saveState(state);

    showToast('Registration successful! Redirecting to login...', 'success');
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1000);
  });
}

// Forgot Password Flow
function initForgotPasswordForm() {
  const form = document.getElementById('forgot-password-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('forgot-email').value.trim();
    const successMsg = document.getElementById('forgot-success-box');

    if (!email) {
      showToast('Please enter your registered email address.', 'danger');
      return;
    }

    if (successMsg) {
      successMsg.style.display = 'block';
      successMsg.innerHTML = `<strong>Password Reset Link Dispatched!</strong><br>We have sent a secure recovery link and temporary OTP to <em>${email}</em>. Please check your inbox or spam folder.`;
    }

    showToast('Password reset link sent!', 'success');
  });
}

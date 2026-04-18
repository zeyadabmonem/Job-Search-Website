/* login.js — handles login form logic */

/* ── Elements ──────────────────────────────────────────────── */
var form      = document.getElementById('login-form');
var emailEl   = document.getElementById('email');
var passEl    = document.getElementById('password');
var eyeBtn    = document.getElementById('eye-btn');
var errorMsg  = document.getElementById('error-msg');
var loginBtn  = document.getElementById('login-btn');
var rememberEl= document.getElementById('remember');

/* ── Auto-fill remembered email ────────────────────────────── */
window.addEventListener('load', function () {
  var saved = localStorage.getItem('jf_remember_email');
  if (saved) {
    emailEl.value = saved;
    rememberEl.checked = true;
  }
});

/* ── Password visibility toggle ────────────────────────────── */
eyeBtn.addEventListener('click', function () {
  if (passEl.type === 'password') {
    passEl.type = 'text';
    eyeBtn.textContent = '🙈';
  } else {
    passEl.type = 'password';
    eyeBtn.textContent = '👁';
  }
});

/* ── Inline field validation ────────────────────────────────── */
function showError(inputEl, errorId, show) {
  inputEl.classList.toggle('error', show);
  document.getElementById(errorId).classList.toggle('visible', show);
}

emailEl.addEventListener('blur', function () {
  showError(emailEl, 'email-error', !emailEl.value.trim().includes('@'));
});

passEl.addEventListener('blur', function () {
  showError(passEl, 'password-error', passEl.value.trim().length < 6);
});

/* ── Form submit ────────────────────────────────────────────── */
form.addEventListener('submit', function (e) {
  e.preventDefault();
  errorMsg.textContent = '';

  var email = emailEl.value.trim();
  var pass  = passEl.value.trim();

  /* Validate email */
  if (!email || !email.includes('@')) {
    showError(emailEl, 'email-error', true);
    emailEl.focus();
    return;
  }

  /* Validate password length */
  if (pass.length < 6) {
    showError(passEl, 'password-error', true);
    passEl.focus();
    return;
  }

  /* Remember-me handling */
  if (rememberEl.checked) {
    localStorage.setItem('jf_remember_email', email);
  } else {
    localStorage.removeItem('jf_remember_email');
  }

  /* Loading state */
  loginBtn.textContent = 'Signing in…';
  loginBtn.disabled    = true;

  /*
   * In a real app this would be an API call.
   * For now: demo users stored in localStorage at registration,
   * or fall back to a hard-coded demo admin account.
   */
  setTimeout(function () {
    var users = JSON.parse(localStorage.getItem('jf_users') || '[]');
    var match = users.find(function (u) {
      return u.email === email && u.password === pass;
    });

    /* Demo admin fallback (admin@jobfinder.com / admin123) */
    if (!match && email === 'admin@jobfinder.com' && pass === 'admin123') {
      match = { name: 'Admin', email: email, role: 'admin' };
    }

    if (!match) {
      errorMsg.textContent = 'Invalid email or password.';
      loginBtn.textContent = 'Login';
      loginBtn.disabled    = false;
      return;
    }

    /* Save session and redirect */
    JobStorage.setUser({ name: match.name, email: match.email, role: match.role });

    if (match.role === 'admin') {
      window.top.location.href = 'admin-dashboard.html';
    } else {
      window.top.location.href = 'home.html';
    }

  }, 700);
});

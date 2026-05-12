/* login.js — handles login form logic */

/* ── Elements ──────────────────────────────────────────────── */
var form      = document.getElementById('login-form');
var emailEl   = document.getElementById('email');
var passEl    = document.getElementById('password');
var eyeBtn    = document.getElementById('eye-btn');
var errorMsg  = document.getElementById('error-msg');
var loginBtn  = document.getElementById('login-btn');
var rememberEl= document.getElementById('remember');


/* ── Password visibility toggle ────────────────────────────── */
eyeBtn.addEventListener('click', function () {
  if (passEl.type === 'password') {
    passEl.type = 'text';
    eyeBtn.textContent = '';
  } else {
    passEl.type = 'password';
    eyeBtn.textContent = '';
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


  /* Loading state */
  loginBtn.textContent = 'Signing in…';
  loginBtn.disabled    = true;

  fetch('http://127.0.0.1:8000/api/auth/login/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: email, password: pass })
  })
  .then(function(res) {
    if (!res.ok) {
      return res.json().then(function(err) { throw err; });
    }
    return res.json();
  })
  .then(function(data) {
    var token = data.access;
    JobStorage.setToken(token);
    
    /* Decode JWT payload to get user info without a second API call */
    var payloadBase64 = token.split('.')[1];
    var decodedPayload = JSON.parse(atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/')));
    
    var userObj = {
      email: decodedPayload.email,
      role: decodedPayload.role,
      name: decodedPayload.name || decodedPayload.username, /* preference for display name */
      company: decodedPayload.company || ''
    };
    JobStorage.setUser(userObj);

    loginBtn.textContent = 'Success! Redirecting…';
    setTimeout(function () {
      if (userObj.role === 'admin') {
        window.top.location.href = 'dashboard.html';
      } else {
        window.top.location.href = 'index.html';
      }
    }, 600);
  })
  .catch(function(err) {
    console.error(err);
    var errorText = 'Invalid email or password.';
    if (err.detail) errorText = err.detail;
    
    errorMsg.textContent = errorText;
    loginBtn.textContent = 'Login';
    loginBtn.disabled    = false;
  });
});




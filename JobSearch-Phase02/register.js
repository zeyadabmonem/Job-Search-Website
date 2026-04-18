/* register.js — handles registration form logic */

/* ── Elements ──────────────────────────────────────────────── */
var form        = document.getElementById('register-form');
var nameEl      = document.getElementById('name');
var emailEl     = document.getElementById('email');
var passEl      = document.getElementById('password');
var confirmEl   = document.getElementById('confirm-password');
var companyEl   = document.getElementById('company');
var roleInput   = document.getElementById('role');
var roleBtns    = document.querySelectorAll('.role-btn');
var companyField= document.getElementById('company-field');
var eyeBtn      = document.getElementById('eye-btn');
var errorMsg    = document.getElementById('error-msg');
var registerBtn = document.getElementById('register-btn');

/* ── Role toggle ────────────────────────────────────────────── */
roleBtns.forEach(function (btn) {
  btn.addEventListener('click', function () {
    roleBtns.forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    roleInput.value = btn.dataset.role;
    /* Show company field for admin */
    if (btn.dataset.role === 'admin') {
      companyField.classList.add('visible');
    } else {
      companyField.classList.remove('visible');
    }
  });
});

/* ── Password toggle ────────────────────────────────────────── */
eyeBtn.addEventListener('click', function () {
  if (passEl.type === 'password') {
    passEl.type = 'text';
    eyeBtn.textContent = '🙈';
  } else {
    passEl.type = 'password';
    eyeBtn.textContent = '👁';
  }
});

/* ── Validation helper ──────────────────────────────────────── */
function showError(el, errorId, show) {
  el.classList.toggle('error', show);
  document.getElementById(errorId).classList.toggle('visible', show);
  return !show;
}

/* Attach blur validators */
nameEl.addEventListener('blur', function () {
  showError(nameEl, 'name-error', nameEl.value.trim().length === 0);
});

emailEl.addEventListener('blur', function () {
  showError(emailEl, 'email-error', !emailEl.value.trim().includes('@'));
});

passEl.addEventListener('blur', function () {
  showError(passEl, 'password-error', passEl.value.trim().length < 6);
});

confirmEl.addEventListener('blur', function () {
  showError(confirmEl, 'confirm-error', confirmEl.value !== passEl.value);
});

companyEl.addEventListener('blur', function () {
  if (roleInput.value === 'admin') {
    showError(companyEl, 'company-error', companyEl.value.trim().length === 0);
  }
});

/* ── Form submit ────────────────────────────────────────────── */
form.addEventListener('submit', function (e) {
  e.preventDefault();
  errorMsg.textContent = '';

  var role    = roleInput.value;
  var name    = nameEl.value.trim();
  var email   = emailEl.value.trim();
  var pass    = passEl.value.trim();
  var confirm = confirmEl.value;
  var company = companyEl.value.trim();

  /* Run all validations */
  var ok = true;
  ok = showError(nameEl,    'name-error',    name.length === 0)            && ok;
  ok = showError(emailEl,   'email-error',   !email.includes('@'))          && ok;
  ok = showError(passEl,    'password-error',pass.length < 6)               && ok;
  ok = showError(confirmEl, 'confirm-error', confirm !== passEl.value)       && ok;

  if (role === 'admin') {
    ok = showError(companyEl, 'company-error', company.length === 0) && ok;
  }

  if (!ok) {
    var first = form.querySelector('input.error');
    if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  /* Check if email already exists */
  var users = JSON.parse(localStorage.getItem('jf_users') || '[]');
  if (users.some(function (u) { return u.email === email; })) {
    errorMsg.textContent = 'An account with this email already exists.';
    return;
  }

  /* Save new user */
  var newUser = { name: name, email: email, password: pass, role: role };
  if (role === 'admin') newUser.company = company;
  users.push(newUser);
  localStorage.setItem('jf_users', JSON.stringify(users));

  /* Auto-login and redirect */
  JobStorage.setUser({ name: name, email: email, role: role });

  registerBtn.textContent = 'Success! Redirecting…';
  registerBtn.disabled    = true;

  setTimeout(function () {
    window.top.location.href = role === 'admin' ? 'admin-dashboard.html' : 'home.html';
  }, 600);
});

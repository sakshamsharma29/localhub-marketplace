// // frontend/js/auth.js

// // ─── Register Form ────────────────────────────
// async function handleRegister(e) {
//   e.preventDefault();
//   const btn = document.getElementById('register-btn');
//   const name     = document.getElementById('name').value.trim();
//   const email    = document.getElementById('email').value.trim();
//   const password = document.getElementById('password').value;
//   const confirm  = document.getElementById('confirm').value;
//   const phone    = document.getElementById('phone')?.value.trim();
//   const role     = document.getElementById('role')?.value || 'customer';

//   clearErrors();

//   let valid = true;
//   if (!name)    { setError('name', 'Full name is required'); valid = false; }
//   if (!email || !/\S+@\S+\.\S+/.test(email)) { setError('email', 'Valid email is required'); valid = false; }
//   if (password.length < 6) { setError('password', 'Password must be at least 6 characters'); valid = false; }
//   if (password !== confirm) { setError('confirm', 'Passwords do not match'); valid = false; }
//   if (!valid) return;

//   setLoading(btn, true);
//   try {
//     const data = await apiCall('/users/register', {
//       method: 'POST',
//       body: JSON.stringify({ name, email, password, phone, role }),
//     });
//     localStorage.setItem('lh_token', data.token);
//     localStorage.setItem('lh_user', JSON.stringify(data.user));
//     showToast('Welcome to LocalHub! 🎉', 'success');
//     setTimeout(() => window.location.href = '/index.html', 900);
//   } catch (err) {
//     showToast(err.message, 'error');
//   } finally {
//     setLoading(btn, false);
//   }
// }

// // ─── Login Form ───────────────────────────────
// async function handleLogin(e) {
//   e.preventDefault();
//   const btn   = document.getElementById('login-btn');
//   const email = document.getElementById('email').value.trim();
//   const password = document.getElementById('password').value;

//   clearErrors();
//   let valid = true;
//   if (!email) { setError('email', 'Email is required'); valid = false; }
//   if (!password) { setError('password', 'Password is required'); valid = false; }
//   if (!valid) return;

//   setLoading(btn, true);
//   try {
//     const data = await apiCall('/users/login', {
//       method: 'POST',
//       body: JSON.stringify({ email, password }),
//     });
//     localStorage.setItem('lh_token', data.token);
//     localStorage.setItem('lh_user', JSON.stringify(data.user));
//     showToast(`Welcome back, ${data.user.name.split(' ')[0]}!`, 'success');
//     const redirect = new URLSearchParams(window.location.search).get('redirect') || '/index.html';
//     setTimeout(() => window.location.href = redirect, 900);
//   } catch (err) {
//     showToast(err.message, 'error');
//   } finally {
//     setLoading(btn, false);
//   }
// }

// // ─── Form Helpers ─────────────────────────────
// function setError(fieldId, message) {
//   const field = document.getElementById(fieldId);
//   if (!field) return;
//   field.classList.add('error');
//   const err = document.createElement('div');
//   err.className = 'form-error';
//   err.textContent = message;
//   err.dataset.errorFor = fieldId;
//   field.parentElement.appendChild(err);
// }

// function clearErrors() {
//   document.querySelectorAll('.form-error').forEach(e => e.remove());
//   document.querySelectorAll('.form-control.error').forEach(e => e.classList.remove('error'));
// }

// function setLoading(btn, loading) {
//   if (!btn) return;
//   if (loading) {
//     btn.dataset.originalText = btn.innerHTML;
//     btn.innerHTML = '<span class="spinner"></span> Please wait…';
//     btn.disabled = true;
//   } else {
//     btn.innerHTML = btn.dataset.originalText || btn.innerHTML;
//     btn.disabled = false;
//   }
// }

// // ─── Guard: redirect if already logged in ────
// function redirectIfLoggedIn() {
//   if (isLoggedIn()) window.location.href = '/index.html';
// }

// // ─── Guard: require login ─────────────────────
// function requireLogin() {
//   if (!isLoggedIn()) window.location.href = `/login.html?redirect=${encodeURIComponent(window.location.pathname)}`;
// }

// // Toggle password visibility
// function togglePassword(inputId, iconId) {
//   const input = document.getElementById(inputId);
//   const icon  = document.getElementById(iconId);
//   if (!input) return;
//   if (input.type === 'password') {
//     input.type = 'text';
//     if (icon) icon.textContent = '🙈';
//   } else {
//     input.type = 'password';
//     if (icon) icon.textContent = '👁';
//   }
// }





// frontend/js/auth.js

document.addEventListener('DOMContentLoaded', function() {

  var loginForm    = document.getElementById('login-form');
  var registerForm = document.getElementById('register-form');

  /* ─── LOGIN ─── */
  if (loginForm) {

    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      var btn      = loginForm.querySelector('button[type=submit]');
      var email    = document.getElementById('email').value.trim();
      var password = document.getElementById('password').value;

      if (!email || !password) {
        showToast('Please fill in all fields', 'error');
        return;
      }

      btn.disabled  = true;
      btn.innerHTML = '<span class="spinner"></span> Logging in…';

      try {
        var data = await apiCall('/users/login', {
          method: 'POST',
          body:   JSON.stringify({ email: email, password: password })
        });

        // Save token and user immediately
        localStorage.setItem('token', data.token);
        localStorage.setItem('user',  JSON.stringify(data.user));

        showToast('Welcome back, ' + data.user.name + '!', 'success');

        // Get redirect from URL param
        var params   = new URLSearchParams(window.location.search);
        var redirect = params.get('redirect');

        // Navigate immediately — no delay
        if (redirect) {
          window.location.replace(redirect);
        } else {
          window.location.replace('index.html');
        }

      } catch(err) {
        showToast(err.message, 'error');
        btn.disabled    = false;
        btn.textContent = 'Login';
      }
    });
  }

  /* ─── REGISTER ─── */
  if (registerForm) {

    registerForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      var btn      = registerForm.querySelector('button[type=submit]');
      var name     = document.getElementById('name').value.trim();
      var email    = document.getElementById('email').value.trim();
      var phone    = document.getElementById('phone').value.trim();
      var password = document.getElementById('password').value;
      var confirm  = document.getElementById('confirm-password').value;
      var role     = document.getElementById('role').value;

      if (!name || !email || !password) {
        showToast('Name, email and password are required', 'error'); return;
      }
      if (password !== confirm) {
        showToast('Passwords do not match', 'error'); return;
      }
      if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error'); return;
      }
      if (!document.getElementById('terms').checked) {
        showToast('Please accept the Terms of Service', 'error'); return;
      }

      btn.disabled      = true;
      btn.innerHTML     = '<span class="spinner"></span> Creating account…';

      try {
        var data = await apiCall('/users/register', {
          method: 'POST',
          body:   JSON.stringify({ name: name, email: email, phone: phone, password: password, role: role })
        });

        localStorage.setItem('token', data.token);
        localStorage.setItem('user',  JSON.stringify(data.user));
        showToast('Account created!', 'success');
        window.location.replace('index.html');

      } catch(err) {
        showToast(err.message, 'error');
        btn.disabled    = false;
        btn.textContent = 'Create Account';
      }
    });

    // Password match feedback
    var confirmInput = document.getElementById('confirm-password');
    if (confirmInput) {
      confirmInput.addEventListener('input', function() {
        var pw = document.getElementById('password').value;
        confirmInput.style.borderColor = (confirmInput.value && confirmInput.value !== pw) ? '#DC2626' : '';
      });
    }
  }

});
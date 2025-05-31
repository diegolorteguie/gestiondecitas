document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const errorMsg = document.getElementById('errorMsg');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const loginSection = document.getElementById('login-section');
  const mainAppContent = document.getElementById('main-app-content');
  const bodyElement = document.body;

  const logoutMainNavbar = document.getElementById('logout-main-navbar');
  if (logoutMainNavbar) {
    logoutMainNavbar.addEventListener('click', (e) => {
      e.preventDefault();
      sessionStorage.removeItem('usuarioLogueado');
      window.location.href = 'index.html';
    });
  }

  const loggedIn = sessionStorage.getItem('usuarioLogueado');

  if (loggedIn === 'true') {
    loginSection.style.display = 'none';
    mainAppContent.style.display = 'block';
    bodyElement.classList.remove('login-page');
  } else {
    loginSection.style.display = 'flex';
    mainAppContent.style.display = 'none';
    bodyElement.classList.add('login-page');
  }

  if (loginForm) {
    loginForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const username = usernameInput.value.trim();
      const password = passwordInput.value;

      usernameInput.classList.remove('input-error');
      passwordInput.classList.remove('input-error');
      errorMsg.style.display = 'none';

      if (username === '' || password === '') {
        errorMsg.textContent = 'Por favor, ingrese usuario y contraseña.';
        errorMsg.style.display = 'block';
        if (username === '') usernameInput.classList.add('input-error');
        if (password === '') passwordInput.classList.add('input-error');
        return;
      }

      if (username === 'admin' && password === 'password') {
        sessionStorage.setItem('usuarioLogueado', 'true');
        loginSection.style.display = 'none';
        mainAppContent.style.display = 'block';
        bodyElement.classList.remove('login-page');
      } else {
        errorMsg.textContent = 'Usuario o contraseña incorrectos.';
        errorMsg.style.display = 'block';
        usernameInput.classList.add('input-error');
        passwordInput.classList.add('input-error');
      }
    });
  }
});

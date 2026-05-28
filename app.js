let usuarioActual = null;

window.addEventListener('DOMContentLoaded', () => {
  console.clear();
  console.log('🚀 App DIAGNÓSTICO cargada');

  if (typeof firebase === 'undefined') {
    alert('❌ Firebase no se cargó');
    return;
  }

  firebase.auth().onAuthStateChanged(usuario => {
    console.log('🔐 Auth State:', usuario ? usuario.email : 'NO LOGUEADO');
    if (usuario) mostrarApp(usuario);
    else mostrarLogin();
  });
});

function login(event) {
  event.preventDefault();
  
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const errorMsg = document.getElementById('loginError');
  const btn = event.target.querySelector('button');
  const original = btn.textContent;

  btn.textContent = 'Cargando...';
  btn.disabled = true;
  errorMsg.style.display = 'none';

  console.log('🔄 Intentando login con:', email);

  // Timeout más visible
  const timeout = setTimeout(() => {
    console.warn('⚠️ TIMEOUT - Firebase no respondió');
    mostrarError(errorMsg, 'Tiempo agotado. Problema de conexión con Firebase.');
    btn.textContent = original;
    btn.disabled = false;
  }, 10000);

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(cred => {
      clearTimeout(timeout);
      console.log('✅ LOGIN EXITOSO');
      mostrarApp(cred.user);
    })
    .catch(err => {
      clearTimeout(timeout);
      console.error('❌ ERROR Firebase:', err.code, err.message);
      mostrarError(errorMsg, `Error: ${err.code || err.message}`);
    })
    .finally(() => {
      clearTimeout(timeout);
      btn.textContent = original;
      btn.disabled = false;
    });
}

function mostrarLogin() {
  document.getElementById('loginScreen').classList.add('active');
  document.getElementById('mainApp').classList.remove('active');
}

function mostrarApp(usuario) {
  document.getElementById('loginScreen').classList.remove('active');
  document.getElementById('mainApp').classList.add('active');
  document.getElementById('userInfo').textContent = `Conectado como: ${usuario.email}`;
}

function mostrarError(el, msg) {
  el.textContent = msg;
  el.style.display = 'block';
  el.style.color = 'red';
}

console.log('✅ Versión de diagnóstico cargada');

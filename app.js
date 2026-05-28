let usuarioActual = null;

window.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 App cargada - Versión estable');

  firebase.auth().onAuthStateChanged(usuario => {
    if (usuario) {
      mostrarApp(usuario);
    } else {
      mostrarLogin();
    }
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

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(cred => {
      console.log('✅ Login exitoso');
      mostrarApp(cred.user);
    })
    .catch(err => {
      console.error('❌ Error:', err.code, err.message);
      mostrarError(errorMsg, `Error: ${err.code || 'Revisa tu conexión'}`);
    })
    .finally(() => {
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
}

function logout() {
  firebase.auth().signOut().then(() => location.reload());
}

console.log('✅ app.js cargado correctamente');

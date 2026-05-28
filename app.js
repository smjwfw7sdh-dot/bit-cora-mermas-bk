let usuarioActual = null;

const AUTO_LOGIN_EMAIL = "albornozmati33@gmail.com";
const AUTO_LOGIN_PASS = "BurgerKing@2026";

window.addEventListener('DOMContentLoaded', () => {
  console.clear();
  console.log('🚀 Aplicación iniciada');

  firebase.auth().onAuthStateChanged(usuario => {
    console.log('🔐 Estado Auth:', usuario ? usuario.email : 'NO LOGUEADO');

    if (usuario) {
      usuarioActual = usuario;
      mostrarApp(usuario);
    } else {
      mostrarLogin();
      setTimeout(autoLogin, 600);
    }
  });
});

function autoLogin() {
  console.log('🔄 Intentando auto-login...');
  firebase.auth().signInWithEmailAndPassword(AUTO_LOGIN_EMAIL, AUTO_LOGIN_PASS)
    .then(cred => {
      console.log('🚀 AUTO-LOGIN EXITOSO:', cred.user.email);
      mostrarApp(cred.user);
    })
    .catch(err => {
      console.error('❌ Auto-login falló:', err.code);
      mostrarLogin();
    });
}

function login(event) {
  event.preventDefault();
  console.log('🔄 Login manual...');

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const errorMsg = document.getElementById('loginError');
  const btn = event.target.querySelector('button');
  const textoOriginal = btn.textContent;

  if (!email || !password) {
    mostrarError(errorMsg, 'Completa email y contraseña');
    return;
  }

  btn.textContent = 'Cargando...';
  btn.disabled = true;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(cred => {
      console.log('✅ Login exitoso');
      mostrarApp(cred.user);
    })
    .catch(err => {
      console.error('❌ Error:', err.code);
      mostrarError(errorMsg, 'Usuario o contraseña incorrectos');
    })
    .finally(() => {
      btn.textContent = textoOriginal;
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
  if (typeof renderizarTabla === 'function') renderizarTabla();
}

function mostrarError(el, msg) {
  el.textContent = msg;
  el.style.display = 'block';
}

function logout() {
  if (confirm('¿Cerrar sesión?')) {
    firebase.auth().signOut().then(() => location.reload());
  }
}

// Funciones de recuperación (mantenidas)
function mostrarRecuperacion() {
  document.getElementById('recoveryModal').style.display = 'flex';
}

function cerrarRecuperacion() {
  document.getElementById('recoveryModal').style.display = 'none';
}

function enviarRecuperacion() {
  const email = document.getElementById('recoveryEmail').value.trim();
  if (!email) return alert('Ingresa tu correo');
  
  firebase.auth().sendPasswordResetEmail(email)
    .then(() => alert('✅ Enlace enviado a tu correo'))
    .catch(() => alert('Error al enviar enlace'));
}

console.log('✅ app.js cargado correctamente');

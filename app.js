// ==================== ESTADO GLOBAL ====================
let usuarioActual = null;

// ==================== CREDENCIALES AUTO-LOGIN ====================
const AUTO_LOGIN_EMAIL = "albornozmati33@gmail.com";
const AUTO_LOGIN_PASS = "BurgerKing@2026";

// ==================== INICIALIZACIÓN ====================
window.addEventListener('DOMContentLoaded', () => {
  console.clear();
  console.log('🚀 Aplicación iniciada');

  // Verificar Firebase
  console.log('🔥 Firebase disponible?', typeof firebase !== 'undefined');
  console.log('🔑 Auth disponible?', typeof firebase?.auth !== 'undefined');

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

// ==================== AUTO LOGIN ====================
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

// ==================== LOGIN MANUAL CON TIMEOUT ====================
function login(event) {
  event.preventDefault();
  console.log('🔄 Login manual iniciado');

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

  // Timeout de seguridad (8 segundos)
  const timeoutId = setTimeout(() => {
    console.warn('⚠️ Timeout: Firebase no respondió en 8 segundos');
    btn.textContent = textoOriginal;
    btn.disabled = false;
    mostrarError(errorMsg, 'Tiempo agotado. Revisa tu conexión o internet');
  }, 8000);

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(cred => {
      clearTimeout(timeoutId);
      console.log('✅ Login exitoso:', cred.user.email);
      mostrarApp(cred.user);
    })
    .catch(err => {
      clearTimeout(timeoutId);
      console.error('❌ Error Firebase:', err.code, err.message);
      mostrarError(errorMsg, 'Usuario o contraseña incorrectos');
    })
    .finally(() => {
      clearTimeout(timeoutId);
      btn.textContent = textoOriginal;
      btn.disabled = false;
    });
}

// ==================== FUNCIONES DE PANTALLA ====================
function mostrarLogin() {
  console.log('🔐 Mostrando pantalla de login');
  document.getElementById('loginScreen').classList.add('active');
  document.getElementById('mainApp').classList.remove('active');
}

function mostrarApp(usuario) {
  console.log('📱 Mostrando aplicación principal');
  document.getElementById('loginScreen').classList.remove('active');
  document.getElementById('mainApp').classList.add('active');
  document.getElementById('userInfo').textContent = `Conectado como: ${usuario.email}`;
  
  if (typeof renderizarTabla === 'function') {
    renderizarTabla();
  }
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

// ==================== RECUPERACIÓN DE CONTRASEÑA ====================
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
    .then(() => alert('✅ Enlace de recuperación enviado'))
    .catch(() => alert('Error al enviar el enlace'));
}

console.log('✅ app.js cargado completamente con timeout de seguridad');

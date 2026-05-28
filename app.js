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

// ==================== AUTO LOGIN (VERSIÓN DETALLADA) ====================
function autoLogin() {
  console.log('🔄 Intentando auto-login...');
  
  firebase.auth().signInWithEmailAndPassword(AUTO_LOGIN_EMAIL, AUTO_LOGIN_PASS)
    .then(cred => {
      console.log('🚀 AUTO-LOGIN EXITOSO:', cred.user.email);
      mostrarApp(cred.user);
    })
    .catch(err => {
      console.error('❌ Error detallado:', err.code);
      console.error('Mensaje:', err.message);
      
      const errorMsg = document.getElementById('loginError');
      if (errorMsg) {
        mostrarError(errorMsg, 'Error: ' + (err.message || err.code));
      }
      mostrarLogin();
    });
}

// ==================== LOGIN MANUAL ====================
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

  const timeoutId = setTimeout(() => {
    console.warn('⚠️ Timeout: Firebase no respondió');
    btn.textContent = textoOriginal;
    btn.disabled = false;
    mostrarError(errorMsg, 'Tiempo agotado. Revisa tu conexión');
  }, 8000);

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(cred => {
      clearTimeout(timeoutId);
      console.log('✅ Login exitoso');
      mostrarApp(cred.user);
    })
    .catch(err => {
      clearTimeout(timeoutId);
      console.error('❌ Error:', err.code);
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

// ==================== RECUPERACIÓN ====================
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
    .then(() => alert('✅ Enlace enviado'))
    .catch(() => alert('Error al enviar enlace'));
}

console.log('✅ app.js cargado completamente');

// ==================== ESTADO GLOBAL ====================
let usuarioActual = null;

// ==================== CREDENCIALES ====================
const AUTO_LOGIN_EMAIL = "albornozmati33@gmail.com";
const AUTO_LOGIN_PASS = "BurgerKing@2026";

// ==================== INICIALIZACIÓN ====================
window.addEventListener('DOMContentLoaded', () => {
  console.log('📱 DOM cargado');

  // Verificar si Firebase está disponible
  if (typeof firebase === 'undefined') {
    console.error('❌ Firebase no está cargado en el HTML');
    alert('Error: Firebase no se cargó. Revisa el index.html');
    return;
  }
  console.log('✅ Firebase detectado');

  // Configurar fecha
  const fechaInput = document.getElementById('fecha');
  if (fechaInput) fechaInput.valueAsDate = new Date();

  // Monitorear autenticación
  firebase.auth().onAuthStateChanged(usuario => {
    console.log('🔐 onAuthStateChanged:', usuario ? usuario.email : 'Sin usuario');

    if (usuario) {
      usuarioActual = usuario;
      mostrarApp(usuario);
    } else {
      mostrarLogin();
      // Auto-login
      setTimeout(autoLogin, 700);
    }
  });
});

// ==================== AUTO LOGIN ====================
function autoLogin() {
  console.log('🔄 Iniciando AUTO-LOGIN...');
  firebase.auth().signInWithEmailAndPassword(AUTO_LOGIN_EMAIL, AUTO_LOGIN_PASS)
    .then(userCredential => {
      console.log('🚀 AUTO-LOGIN EXITOSO:', userCredential.user.email);
      usuarioActual = userCredential.user;
      mostrarApp(userCredential.user);
    })
    .catch(error => {
      console.error('❌ AUTO-LOGIN ERROR:', error.code, error.message);
      mostrarLogin(); // Mostrar formulario normal
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
  const btnOriginal = btn.textContent;

  if (!email || !password) {
    mostrarError(errorMsg, 'Completa email y contraseña');
    return;
  }

  btn.textContent = 'Cargando...';
  btn.disabled = true;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      console.log('✅ Login manual exitoso');
      mostrarApp(userCredential.user);
    })
    .catch(error => {
      console.error('❌ Error login:', error.code, error.message);
      let msg = 'Error al ingresar';
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') msg = 'Contraseña incorrecta';
      if (error.code === 'auth/user-not-found') msg = 'Usuario no encontrado';
      mostrarError(errorMsg, msg);
    })
    .finally(() => {
      btn.textContent = btnOriginal;
      btn.disabled = false;
    });
}

// ==================== FUNCIONES DE PANTALLA ====================
function mostrarLogin() {
  console.log('🔐 Mostrando Login');
  document.getElementById('loginScreen').classList.add('active');
  document.getElementById('mainApp').classList.remove('active');
}

function mostrarApp(usuario) {
  console.log('📱 Mostrando App');
  document.getElementById('loginScreen').classList.remove('active');
  document.getElementById('mainApp').classList.add('active');
  document.getElementById('userInfo').textContent = `Conectado: ${usuario.email}`;
  if (typeof renderizarTabla === 'function') renderizarTabla();
}

function mostrarError(el, msg) {
  el.textContent = msg;
  el.style.display = 'block';
}

function logout() {
  firebase.auth().signOut().then(() => location.reload());
}

// ==================== FIN ====================
console.log('✅ app.js cargado con versión debug');

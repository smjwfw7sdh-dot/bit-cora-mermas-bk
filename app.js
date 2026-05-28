// ==================== ESTADO GLOBAL ====================
let usuarioActual = null;

// ==================== CREDENCIALES PARA AUTO-LOGIN ====================
const AUTO_LOGIN_EMAIL = "albornozmati33@gmail.com";
const AUTO_LOGIN_PASS  = "BurgerKing@2026";

// ==================== INICIALIZACIÓN ====================
window.addEventListener('DOMContentLoaded', () => {
  console.log('📱 DOM cargado - Inicializando aplicación');

  // Configurar fecha de hoy
  const fechaInput = document.getElementById('fecha');
  if (fechaInput) fechaInput.valueAsDate = new Date();

  // Monitorear estado de autenticación
  firebase.auth().onAuthStateChanged(usuario => {
    console.log('🔐 onAuthStateChanged →', usuario ? usuario.email : 'No autenticado');

    if (usuario) {
      usuarioActual = usuario;
      console.log('✅ Usuario autenticado:', usuario.email);
      mostrarApp(usuario);
    } else {
      console.log('❌ No hay usuario - mostrando login');
      mostrarLogin();

      // Auto-login después de un pequeño delay
      setTimeout(() => {
        if (!usuarioActual) {
          console.log('🔄 Intentando AUTO-LOGIN...');
          autoLogin();
        }
      }, 600);
    }
  });
});

// ==================== AUTO-LOGIN ====================
function autoLogin() {
  firebase.auth().signInWithEmailAndPassword(AUTO_LOGIN_EMAIL, AUTO_LOGIN_PASS)
    .then(resultado => {
      console.log('🚀 Auto-login EXITOSO:', resultado.user.email);
      usuarioActual = resultado.user;
      mostrarApp(resultado.user);
    })
    .catch(error => {
      console.error('❌ Auto-login falló:', error.code, error.message);
      // Si falla, queda en pantalla de login normal
    });
}

// ==================== LOGIN MANUAL ====================
function login(event) {
  event.preventDefault();

  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const errorMsg = document.getElementById('loginError');

  if (!email || !password) {
    mostrarError(errorMsg, 'Por favor completa todos los campos');
    return;
  }

  const btn = event.target.querySelector('button');
  const btnText = btn.textContent;
  btn.textContent = 'Cargando...';
  btn.disabled = true;

  console.log('🔄 Intentando login manual con:', email);

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(resultado => {
      console.log('✅ Login manual exitoso:', resultado.user.email);
      errorMsg.style.display = 'none';
      usuarioActual = resultado.user;
      mostrarApp(resultado.user);
    })
    .catch(error => {
      console.error('❌ Error login:', error.code, error.message);
      let mensaje = 'Error al ingresar';

      switch(error.code) {
        case 'auth/user-not-found':
        case 'auth/invalid-credential':
          mensaje = 'Usuario o contraseña incorrectos';
          break;
        case 'auth/wrong-password':
          mensaje = 'Contraseña incorrecta';
          break;
        case 'auth/invalid-email':
          mensaje = 'Correo inválido';
          break;
        case 'auth/too-many-requests':
          mensaje = 'Demasiados intentos. Espera unos minutos';
          break;
        case 'auth/network-request-failed':
          mensaje = 'Error de conexión. Revisa tu internet';
          break;
      }
      mostrarError(errorMsg, mensaje);
    })
    .finally(() => {
      btn.textContent = btnText;
      btn.disabled = false;
    });
}

// ==================== CERRAR SESIÓN ====================
function logout() {
  if (confirm('¿Cerrar sesión?')) {
    firebase.auth().signOut().then(() => {
      usuarioActual = null;
      mostrarLogin();
    });
  }
}

// ==================== PANTALLAS ====================
function mostrarLogin() {
  console.log('🔐 Mostrando pantalla de Login');
  document.getElementById('loginScreen').classList.add('active');
  document.getElementById('mainApp').classList.remove('active');
}

function mostrarApp(usuario) {
  console.log('📱 Mostrando App Principal');
  document.getElementById('loginScreen').classList.remove('active');
  document.getElementById('mainApp').classList.add('active');

  document.getElementById('userInfo').textContent = `Conectado como: ${usuario.email}`;
  renderizarTabla();
}

function mostrarError(elemento, mensaje) {
  elemento.textContent = mensaje;
  elemento.style.display = 'block';
  elemento.style.color = 'red';
}

// ==================== EL RESTO DE TU CÓDIGO (mermas, tabla, etc.) ====================
// (Se mantiene igual)

function mostrarRecuperacion() {
  document.getElementById('recoveryModal').style.display = 'flex';
}

function cerrarRecuperacion() {
  document.getElementById('recoveryModal').style.display = 'none';
  document.getElementById('recoveryEmail').value = '';
  document.getElementById('recoveryMessage').style.display = 'none';
}

function enviarRecuperacion() {
  // ... (tu código original)
  console.log('Función de recuperación no modificada');
}

// Aquí va el resto de tu código (productosPorCategoria, cargarProductosPorCategoria, agregarMerma, etc.)
// Si quieres, pégamelo y te lo integro completo.

console.log('✅ app.js cargado completamente con mejoras');

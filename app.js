// ==================== ESTADO GLOBAL ====================
let usuarioActual = null;

// ==================== CREDENCIALES PARA AUTO-LOGIN ====================
const AUTO_LOGIN_EMAIL = "albornozmati33@gmail.com";
const AUTO_LOGIN_PASS = "BurgerKing@2026";

// ==================== INICIALIZACIÓN ====================
window.addEventListener('DOMContentLoaded', () => {
  console.log('📱 DOM cargado - Inicializando aplicación');

  // Configurar fecha de hoy por defecto
  document.getElementById('fecha').valueAsDate = new Date();

  // Monitorear autenticación
  firebase.auth().onAuthStateChanged(usuario => {
    console.log('🔐 Estado de autenticación cambió:', usuario ? usuario.email : 'No autenticado');
    
    if (usuario) {
      usuarioActual = usuario;
      console.log('✅ Usuario autenticado:', usuario.email);
      mostrarApp(usuario);
    } else {
      console.log('❌ Usuario no autenticado - mostrando login');
      mostrarLogin();
      
      // AUTO-LOGIN (solo en desarrollo)
      setTimeout(() => {
        if (!usuarioActual) {
          console.log('🔄 Intentando auto-login con usuario de prueba...');
          autoLogin();
        }
      }, 800);
    }
  });
});

// ==================== AUTO-LOGIN ====================
function autoLogin() {
  firebase.auth().signInWithEmailAndPassword(AUTO_LOGIN_EMAIL, AUTO_LOGIN_PASS)
    .then(resultado => {
      console.log('🚀 Auto-login exitoso:', resultado.user.email);
      usuarioActual = resultado.user;
      mostrarApp(resultado.user);
    })
    .catch(error => {
      console.error('❌ Auto-login falló:', error.code);
      // Si falla, muestra el formulario normal
    });
}

// ==================== AUTENTICACIÓN NORMAL ====================
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

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(resultado => {
      console.log('✅ Login manual exitoso:', resultado.user.email);
      errorMsg.style.display = 'none';
      usuarioActual = resultado.user;
      mostrarApp(resultado.user);
    })
    .catch(error => {
      console.error('❌ Error de login:', error.code, error.message);
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
          mensaje = 'Correo electrónico inválido';
          break;
        case 'auth/too-many-requests':
          mensaje = 'Demasiados intentos. Espera un momento';
          break;
      }
      mostrarError(errorMsg, mensaje);
    })
    .finally(() => {
      btn.textContent = btnText;
      btn.disabled = false;
    });
}

function logout() {
  if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
    firebase.auth().signOut()
      .then(() => {
        console.log('✅ Sesión cerrada');
        usuarioActual = null;
        mostrarLogin();
      })
      .catch(error => {
        console.error('❌ Error al cerrar sesión:', error);
        alert('Error al cerrar sesión');
      });
  }
}

// ==================== GESTIÓN DE PANTALLAS ====================
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
  renderizarTabla();
}

// ==================== OTRAS FUNCIONES (sin cambios mayores) ====================
function mostrarError(elemento, mensaje) {
  elemento.textContent = mensaje;
  elemento.style.display = 'block';
  elemento.style.color = 'red';
}

// ... (el resto del código se mantiene igual: recuperar contraseña, mermas, tabla, etc.)

// Puedes pegar el resto de tu código original aquí (cargarProductosPorCategoria, agregarMerma, etc.)

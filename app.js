// ==================== ESTADO GLOBAL ====================
let usuarioActual = null;

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
    }
  });
});

// ==================== AUTENTICACIÓN ====================
function login(event) {
  event.preventDefault();
  
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const errorMsg = document.getElementById('loginError');

  console.log('🔍 Intento de login con:', email);

  if (!email || !password) {
    console.warn('⚠️ Campos incompletos');
    mostrarError(errorMsg, 'Por favor completa todos los campos');
    return;
  }

  // Mostrar cargando
  const btn = event.target.querySelector('button');
  const btnText = btn.textContent;
  btn.textContent = 'Cargando...';
  btn.disabled = true;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(resultado => {
      console.log('✅ Login exitoso:', resultado.user.email);
      errorMsg.style.display = 'none';
      // La transición a la app la maneja onAuthStateChanged
    })
    .catch(error => {
      console.error('❌ Error de login:', error.code, error.message);
      let mensaje = 'Error al ingresar';
      
      switch(error.code) {
        case 'auth/user-not-found':
          mensaje = 'Usuario no encontrado';
          break;
        case 'auth/wrong-password':
          mensaje = 'Contraseña incorrecta';
          break;
        case 'auth/invalid-email':
          mensaje = 'Correo inválido';
          break;
        case 'auth/invalid-credential':
          mensaje = 'Email o contraseña incorrectos';
          break;
        case 'auth/too-many-requests':
          mensaje = 'Demasiados intentos. Intenta más tarde';
          break;
        case 'auth/network-request-failed':
          mensaje = 'Error de conexión. Verifica tu internet';
          break;
        default:
          mensaje = 'Error: ' + error.message;
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
    console.log('🚪 Cerrando sesión');
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

function mostrarRecuperacion() {
  document.getElementById('recoveryModal').style.display = 'flex';
}

function cerrarRecuperacion() {
  document.getElementById('recoveryModal').style.display = 'none';
  document.getElementById('recoveryEmail').value = '';
  document.getElementById('recoveryMessage').style.display = 'none';
}

function enviarRecuperacion() {
  const email = document.getElementById('recoveryEmail').value.trim();
  const msg = document.getElementById('recoveryMessage');

  console.log('📧 Enviando recuperación a:', email);

  if (!email) {
    mostrarError(msg, 'Ingresa tu correo electrónico');
    return;
  }

  firebase.auth().sendPasswordResetEmail(email)
    .then(() => {
      console.log('✅ Email de recuperación enviado');
      msg.textContent = `Instrucciones enviadas a ${email}`;
      msg.style.color = 'green';
      msg.style.display = 'block';
      setTimeout(() => {
        cerrarRecuperacion();
      }, 2000);
    })
    .catch(error => {
      console.error('❌ Error en recuperación:', error.code);
      let mensaje = 'Error al enviar instrucciones';
      if (error.code === 'auth/user-not-found') {
        mensaje = 'Correo no registrado';
      }
      mostrarError(msg, mensaje);
    });
}

// ==================== GESTIÓN DE PANTALLAS ====================
function mostrarLogin() {
  document.getElementById('loginScreen').classList.add('active');
  document.getElementById('mainApp').classList.remove('active');
}

function mostrarApp(usuario) {
  document.getElementById('loginScreen').classList.remove('active');
  document.getElementById('mainApp').classList.add('active');
  
  // Mostrar información del usuario
  document.getElementById('userInfo').textContent = `Conectado como: ${usuario.email}`;
  console.log('📊 Cargando tabla de mermas');
  
  // Cargar tabla
  renderizarTabla();
}

// ==================== GESTIÓN DE MERMAS ====================
const productosPorCategoria = {
  "Carnes": ["Whopper Patty", "Mega Patty", "Rebel Patty", "Chicken Patty", "Chicken Patty Vegetal", "Pollo JR", "Hamburguesa XT 7oz"],
  "Pan": ["Pan Whopper", "Pan Hamburguesa", "Pan de Papa", "Pan Queso", "Pan Sesamo Negro", "Pan Masa Madre", "Pan especial"],
  "Postres": ["Muffin Triple Chocolate", "Donut Fresa", "Donut Tricolor", "Pie de Manzana", "Pie de Chocolate", "Medialuna"],
  "Snacks": ["Chicken Fries", "Empanadas", "Nuggets", "Cheese Pilows", "Aros de Cebolla"],
  "Bebidas": ["Lata Pepsi", "Lata Pepsi Zero", "Lata Kem", "Lata Crush", "Cachantun con Gas", "Cachantun Sin Gas", "Red Bull", "Red Bull Free"],
  "Otros": ["Lechuga", "Tomate", "Cebolla", "Queso Cheddar", "Tocino", "Vaso Cerámica Mandalorian"]
};

function cargarProductosPorCategoria() {
  const categoria = document.getElementById('categoria').value;
  const productoSelect = document.getElementById('productoSelect');
  productoSelect.innerHTML = '<option value="">Seleccionar producto...</option>';
  
  if (categoria && productosPorCategoria[categoria]) {
    console.log('📦 Cargando productos de:', categoria);
    productosPorCategoria[categoria].forEach(producto => {
      const opt = document.createElement('option');
      opt.value = producto;
      opt.textContent = producto;
      productoSelect.appendChild(opt);
    });
  }
}

function getFecha() {
  return document.getElementById('fecha').value;
}

async function agregarMerma() {
  const fecha = getFecha();
  const hora = document.getElementById('hora').value;
  const producto = document.getElementById('productoSelect').value;
  const cantidad = parseFloat(document.getElementById('cantidad').value);
  const motivo = document.getElementById('motivo').value;
  const turno = document.getElementById('turno').value;

  console.log('📝 Validando nueva merma:', { fecha, hora, producto, cantidad, motivo, turno });

  // Validar campos
  if (!fecha || !hora || !producto || isNaN(cantidad) || !motivo) {
    console.warn('❌ Campos incompletos');
    alert('❌ Por favor completa todos los campos obligatorios');
    return;
  }

  if (cantidad <= 0) {
    console.warn('❌ Cantidad inválida:', cantidad);
    alert('❌ La cantidad debe ser mayor a 0');
    return;
  }

  if (cantidad > 1000) {
    console.warn('⚠️ Cantidad sospechosamente alta:', cantidad);
    alert('⚠️ Verifica la cantidad ingresada (parece muy alta)');
    return;
  }

  try {
    console.log('💾 Guardando merma en Firestore...');
    // Agregar documento con datos validados
    const resultado = await db.collection(collectionName).add({
      fecha,
      hora,
      producto,
      cantidad,
      motivo,
      turno,
      usuarioEmail: usuarioActual.email,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    console.log('✅ Merma guardada con ID:', resultado.id);
    alert('✅ Merma registrada correctamente');
    limpiarFormulario();
    renderizarTabla();
  } catch (error) {
    console.error('❌ Error al guardar merma:', error.code, error.message);
    alert('❌ Error al guardar: ' + error.message);
  }
}

function limpiarFormulario() {
  document.getElementById('cantidad').value = '';
  document.getElementById('hora').value = '';
  document.getElementById('productoSelect').value = '';
  document.getElementById('categoria').value = '';
  document.getElementById('motivo').value = '';
  console.log('🧹 Formulario limpiado');
}

async function renderizarTabla() {
  const fecha = getFecha();
  document.getElementById('fechaActual').textContent = fecha || 'Hoy';

  console.log('📊 Cargando registros para:', fecha);

  try {
    // CAMBIO: Se elimina el .orderBy('hora', 'desc') para simplificar la consulta
    const snapshot = await db.collection(collectionName)
      .where('fecha', '==', fecha)
      .get();

    const tbody = document.getElementById('listaMermas');
    tbody.innerHTML = '';
    let total = 0;

    if (snapshot.empty) {
      console.log('ℹ️ No hay registros para esta fecha');
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:20px;">No hay registros para esta fecha</td></tr>';
    } else {
      console.log('📋 Registros encontrados:', snapshot.size);
      snapshot.forEach(doc => {
        const m = doc.data();
        const cant = parseFloat(m.cantidad) || 0;
        total += cant;

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${m.hora

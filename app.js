// ==================== ESTADO GLOBAL ====================
let usuarioActual = null;

// ==================== INICIALIZACIÓN ====================
window.addEventListener('DOMContentLoaded', () => {
  // Configurar fecha de hoy por defecto
  document.getElementById('fecha').valueAsDate = new Date();
  
  // Monitorear autenticación
  firebase.auth().onAuthStateChanged(usuario => {
    if (usuario) {
      usuarioActual = usuario;
      mostrarApp(usuario);
    } else {
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

  if (!email || !password) {
    mostrarError(errorMsg, 'Por favor completa todos los campos');
    return;
  }

  // Mostrar cargando
  const btn = event.target.querySelector('button');
  const btnText = btn.textContent;
  btn.textContent = 'Cargando...';
  btn.disabled = true;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => {
      errorMsg.style.display = 'none';
    })
    .catch(error => {
      let mensaje = 'Error al ingresar';
      if (error.code === 'auth/user-not-found') {
        mensaje = 'Usuario no encontrado';
      } else if (error.code === 'auth/wrong-password') {
        mensaje = 'Contraseña incorrecta';
      } else if (error.code === 'auth/invalid-email') {
        mensaje = 'Correo inválido';
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
        usuarioActual = null;
        mostrarLogin();
      })
      .catch(error => {
        console.error('Error al cerrar sesión:', error);
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

  if (!email) {
    mostrarError(msg, 'Ingresa tu correo electrónico');
    return;
  }

  firebase.auth().sendPasswordResetEmail(email)
    .then(() => {
      msg.textContent = `Instrucciones enviadas a ${email}`;
      msg.style.color = 'green';
      msg.style.display = 'block';
      setTimeout(() => {
        cerrarRecuperacion();
      }, 2000);
    })
    .catch(error => {
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

  // Validar campos
  if (!fecha || !hora || !producto || isNaN(cantidad) || !motivo) {
    alert('❌ Por favor completa todos los campos obligatorios');
    return;
  }

  if (cantidad <= 0) {
    alert('❌ La cantidad debe ser mayor a 0');
    return;
  }

  if (cantidad > 1000) {
    alert('⚠️ Verifica la cantidad ingresada (parece muy alta)');
    return;
  }

  try {
    // Agregar documento con datos validados
    await db.collection(collectionName).add({
      fecha,
      hora,
      producto,
      cantidad,
      motivo,
      turno,
      usuarioEmail: usuarioActual.email,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert('✅ Merma registrada correctamente');
    limpiarFormulario();
    renderizarTabla();
  } catch (error) {
    console.error('Error:', error);
    alert('❌ Error al guardar: ' + error.message);
  }
}

function limpiarFormulario() {
  document.getElementById('cantidad').value = '';
  document.getElementById('hora').value = '';
  document.getElementById('productoSelect').value = '';
  document.getElementById('categoria').value = '';
  document.getElementById('motivo').value = '';
}

async function renderizarTabla() {
  const fecha = getFecha();
  document.getElementById('fechaActual').textContent = fecha || 'Hoy';

  try {
    const snapshot = await db.collection(collectionName)
      .where('fecha', '==', fecha)
      .orderBy('hora', 'desc')
      .get();

    const tbody = document.getElementById('listaMermas');
    tbody.innerHTML = '';
    let total = 0;

    if (snapshot.empty) {
      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:20px;">No hay registros para esta fecha</td></tr>';
    } else {
      snapshot.forEach(doc => {
        const m = doc.data();
        const cant = parseFloat(m.cantidad) || 0;
        total += cant;

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${m.hora}</td>
          <td>${m.turno || '-'}</td>
          <td>${m.producto}</td>
          <td>${cant.toFixed(2)}</td>
          <td><strong>${m.motivo}</strong></td>
          <td>${m.usuarioEmail || '-'}</td>
          <td><button class="delete-btn" onclick="eliminar('${doc.id}')">Eliminar</button></td>
        `;
        tbody.appendChild(tr);
      });
    }

    document.getElementById('totalMerma').textContent = total.toFixed(2);
  } catch (error) {
    console.error('Error al cargar tabla:', error);
    alert('Error al cargar los registros');
  }
}

async function eliminar(id) {
  if (confirm('⚠️ ¿Estás seguro de que deseas eliminar este registro?')) {
    try {
      await db.collection(collectionName).doc(id).delete();
      renderizarTabla();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar: ' + error.message);
    }
  }
}

async function exportarCSV() {
  const fecha = getFecha();
  if (!fecha) {
    alert('Selecciona una fecha primero');
    return;
  }

  try {
    const snapshot = await db.collection(collectionName)
      .where('fecha', '==', fecha)
      .orderBy('hora')
      .get();

    if (snapshot.empty) {
      alert('No hay registros para esta fecha');
      return;
    }

    // Crear CSV con encoding UTF-8
    let csv = 'Fecha,Hora,Turno,Producto,Cantidad,Motivo,Usuario\n';

    snapshot.forEach(doc => {
      const m = doc.data();
      csv += `"${m.fecha}","${m.hora}","${m.turno || ''}","${m.producto.replace(/"/g, '""')}","${m.cantidad}","${m.motivo}","${(m.usuarioEmail || '').replace(/"/g, '""')}"\n`;
    });

    // Crear y descargar archivo
    const blob = new Blob(["\uFEFF" + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Merma_BK_${fecha}.csv`;
    link.click();
  } catch (error) {
    console.error('Error:', error);
    alert('Error al generar CSV: ' + error.message);
  }
}

function cambiarFecha() {
  renderizarTabla();
}

// ==================== UTILIDADES ====================
function mostrarError(elemento, mensaje) {
  elemento.textContent = mensaje;
  elemento.style.display = 'block';
  setTimeout(() => {
    elemento.style.display = 'none';
  }, 4000);
}
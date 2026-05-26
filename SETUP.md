# 🔧 Guía de Configuración - Bitácora de Merma BK

## Paso 1: Crear Proyecto Firebase

### 1.1 Acceder a Firebase Console
- Ve a: https://console.firebase.google.com/
- Inicia sesión con tu cuenta Google

### 1.2 Crear Nuevo Proyecto
1. Click en "Agregar proyecto"
2. **Nombre del proyecto:** `bklasrastras`
3. Desactiva "Google Analytics" (opcional)
4. Click "Crear proyecto"
5. Espera a que se cree (1-2 minutos)

### 1.3 Configurar Región
- Ve a "Configuración del proyecto" (⚙️ > Proyecto settings)
- En "Región por defecto de Cloud Firestore" selecciona una cercana
- Ejemplo: `southamerica-east1` (Argentina)

---

## Paso 2: Configurar Authentication (Autenticación)

### 2.1 Habilitar Autenticación
1. En el menú izquierdo, ve a **"Authentication"**
2. Click en "Comenzar"
3. Selecciona **"Email/Contraseña"**
4. Activa el método (toggle ON)
5. Click "Guardar"

### 2.2 Crear Usuario Admin
1. Ve a la pestaña **"Usuarios"**
2. Click en **"Agregar usuario"**
3. **Email:** `matipizarro23@icloud.com`
4. **Contraseña:** `BK2026!SecurePass#123`
5. Click "Agregar usuario"

✅ ¡El usuario está listo!

### 2.3 Crear Usuarios Adicionales (Opcional)
Repite el paso 2.2 para cada empleado:
- Email: correo del empleado
- Contraseña: algo que el empleado pueda recordar

---

## Paso 3: Configurar Firestore Database

### 3.1 Crear Base de Datos
1. En el menú izquierdo, ve a **"Firestore Database"**
2. Click en **"Crear base de datos"**
3. **Ubicación:** Selecciona la misma región que en 1.3
4. **Modo inicial:** Selecciona "Iniciar en modo de prueba"
   - Nota: Cambiaremos esto después
5. Click "Crear"
6. Espera a que se cree (1-2 minutos)

### 3.2 Configurar Reglas de Seguridad
1. Ve a la pestaña **"Reglas"**
2. Reemplaza todo el contenido con el código de `firestore.rules`
3. Click "Publicar"

**Contenido a copiar** (desde `firestore.rules`):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /mermasBK/{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && validarDatosMerma(request.resource.data);
      allow delete: if request.auth != null;
    }
    function validarDatosMerma(data) {
      return data.keys().hasAll(['fecha', 'hora', 'producto', 'cantidad', 'motivo']) &&
             data.fecha is string && data.hora is string && data.producto is string &&
             data.cantidad is number && data.motivo is string &&
             data.fecha.size() > 0 && data.hora.size() > 0 &&
             data.producto.size() > 0 && data.motivo.size() > 0 &&
             data.cantidad > 0 && data.cantidad <= 1000 &&
             data.motivo in ['Q', 'V', 'C', 'E', 'D'] &&
             (!('turno' in data) || data.turno in ['AM', 'PM', 'Trasnoche']);
    }
  }
}
```

### 3.3 Crear Índice de Base de Datos (Opcional pero recomendado)
1. Ve a la pestaña **"Índices"**
2. Haz click en "Crear índice"
3. **Colección:** `mermasBK`
4. **Campos:**
   - `fecha` (Ascendente)
   - `hora` (Descendente)
5. Click "Crear índice"

Esto mejora el rendimiento de las búsquedas.

---

## Paso 4: Obtener Credenciales Firebase

### 4.1 Acceder a Configuración del Proyecto
1. Click en el icono ⚙️ (Configuración) en el menú izquierdo
2. Click en **"Proyecto settings"** (Configuración del proyecto)

### 4.2 Copiar SDK Configuration
1. Ve a la sección **"Tus apps"**
2. Busca tu app web (si no existe, crea una)
3. Copia el objeto `firebaseConfig`
4. Debería verse así:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBzJsuxacvqTVqF7TLIvEV3Rh8Mn1sY-nY",
  authDomain: "bklasrastras.firebaseapp.com",
  projectId: "bklasrastras",
  storageBucket: "bklasrastras.firebasestorage.app",
  messagingSenderId: "259558703101",
  appId: "1:259558703101:web:84c37427bad55867f7e394"
};
```

---

## Paso 5: Actualizar Archivo config.js

### 5.1 Actualizar Configuración
1. Abre el archivo `config.js` en el repositorio
2. Reemplaza los valores placeholder con los datos reales de tu Firebase
3. Guarda el archivo
4. Git commit y push

**Ejemplo antes:**
```javascript
const firebaseConfig = {
  apiKey: "ACTUALIZA_CON_TU_API_KEY",
  authDomain: "ACTUALIZA_CON_TU_AUTH_DOMAIN",
  // ... etc
};
```

**Ejemplo después:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyBzJsuxacvqTVqF7TLIvEV3Rh8Mn1sY-nY",
  authDomain: "bklasrastras.firebaseapp.com",
  // ... etc
};
```

---

## Paso 6: Activar GitHub Pages

### 6.1 Configurar Repositorio
1. Ve a tu repositorio: https://github.com/smjwfw7sdh-dot/bit-cora-mermas-bk
2. Click en **Settings** (Configuración)
3. En el menú izquierdo, ve a **Pages**
4. **Source:** Selecciona `main` y `/ (root)`
5. Click **Save**
6. Espera 1-2 minutos

### 6.2 Tu Aplicación está Lista
- URL: https://smjwfw7sdh-dot.github.io/bit-cora-mermas-bk/
- ¡Comparte este link con el equipo!

---

## ✅ Checklist Final

- [ ] Proyecto Firebase creado (bklasrastras)
- [ ] Authentication habilitada (Email/Contraseña)
- [ ] Usuario admin creado (matipizarro23@icloud.com)
- [ ] Firestore Database creada
- [ ] Reglas de seguridad publicadas
- [ ] Credenciales copiadas a config.js
- [ ] Cambios pusheados a GitHub
- [ ] GitHub Pages activado
- [ ] Acceso a la app funcionando

---

## 🆘 Troubleshooting

### "No puedo conectarme a Firebase"
- Verifica que los datos en `config.js` sean correctos
- Revisa que el proyecto esté activo en Firebase Console
- Intenta limpiar la caché del navegador

### "Error de autenticación"
- Verifica que el usuario exista en Firebase Authentication
- Confirma que la contraseña sea correcta
- Revisa que no haya espacios extra en email/password

### "No se guardan los datos"
- Verifica las reglas de Firestore (firestore.rules)
- Asegúrate de que el usuario esté autenticado
- Revisa la consola del navegador (F12) para errores

### "Página en blanco"
- Verifica que el archivo `config.js` esté bien
- Comprueba que Firebase esté cargando correctamente
- Abre la consola (F12) para ver errores

---

## 📚 Recursos Adicionales

- Firebase Docs: https://firebase.google.com/docs
- Firestore Docs: https://firebase.google.com/docs/firestore
- GitHub Pages: https://pages.github.com/

---

**¡Ya está lista tu Bitácora de Merma!** 🎉

Para soporte técnico, contacta a tu administrador.

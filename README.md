# Bitácora de Merma - Burger King Las Rastras

## 📋 ¿Qué es?

Aplicación web para registrar y controlar la merma (desperdicios) de productos en la sucursal Burger King Las Rastras. Permite:

✅ Registrar productos dañados/vencidos/quemados  
✅ Categorizar por tipo de producto  
✅ Identificar motivo de la merma  
✅ Rastrear responsable del registro  
✅ Exportar datos para análisis  
✅ Acceso seguro con contraseña  

---

## 🚀 Acceso Rápido

**URL:** https://smjwfw7sdh-dot.github.io/bit-cora-mermas-bk/

**Credenciales por defecto:**
- Email: `matipizarro23@icloud.com`
- Contraseña: `BK2026!SecurePass#123`

---

## 👨 Cómo Usar

### 1. Iniciar Sesión
- Abre la aplicación
- Ingresa tu email y contraseña
- Click en "Ingresar"

### 2. Registrar Merma
1. **Selecciona la fecha** (por defecto: hoy)
2. **Elige el turno:** AM, PM o Trasnoche
3. **Selecciona categoría:**
   - Carnes
   - Pan
   - Postres
   - Snacks
   - Bebidas
   - Otros
4. **Elige el producto** de la lista
5. **Ingresa hora** del registro
6. **Cantidad** de unidades
7. **Motivo** de la merma:
   - Q = Quemado
   - V = Vencido
   - C = Contaminado / Caído al piso
   - E = Error de preparación
   - D = Daño de fábrica o transporte
8. Click en **"Registrar Merma"**

### 3. Ver Registros
- Los registros aparecen automáticamente en la tabla
- Se actualiza el total diario de merma
- Puedes cambiar de fecha para ver otros días

### 4. Eliminar Registro
- Click en el botón "Eliminar" de la fila
- Confirma la acción

### 5. Exportar Datos
- Click en **"Exportar CSV (Análisis)"**
- Se descarga un archivo `.csv` con todos los registros del día
- Compatible con Excel y Google Sheets

### 6. Cerrar Sesión
- Click en el botón **"Cerrar Sesión"** en la esquina superior
- Confirma la acción

---

## 📊 Códigos de Motivo

| Código | Motivo | Ejemplo |
|--------|--------|----------|
| **Q** | Quemado | Hamburguesa quemada |
| **V** | Vencido | Pan con fecha de vencimiento |
| **C** | Contaminado/Caído | Producto caído al piso |
| **E** | Error de preparación | Orden mal hecha |
| **D** | Daño de fábrica | Empanada rota desde fábrica |

---

## 👥 Gestionar Usuarios

### Crear nuevo usuario:
1. Ve a https://console.firebase.google.com/
2. Selecciona proyecto "bklasrastras"
3. Ve a "Authentication"
4. Click en "Agregar usuario"
5. Ingresa email y contraseña
6. Click en "Crear usuario"

### El nuevo usuario puede ingresar inmediatamente con sus credenciales

---

## 🔐 Seguridad

- ✅ Autenticación con email y contraseña
- ✅ Base de datos cifrada (Firebase Firestore)
- ✅ Acceso solo para usuarios autenticados
- ✅ Validación de datos en tiempo real
- ✅ Auditoría: cada registro guarda quién lo hizo

---

## ⚠️ Problemas Comunes

### "Error al conectar"
- Verifica tu conexión a internet
- Recarga la página
- Limpia la caché del navegador

### "Contraseña incorrecta"
- Verifica que escribas bien el email
- Usa "Olvidaste tu contraseña" para recuperar

### "No se guarda la merma"
- Verifica que todos los campos estén completos
- La cantidad debe ser mayor a 0
- Recarga la página e intenta de nuevo

### "No puedo descargar CSV"
- Verifica que haya registros para la fecha seleccionada
- Comprueba que tu navegador permita descargas
- Intenta en otro navegador

---

## 📞 Soporte Técnico

Para problemas técnicos contacta a tu administrador o revisa el archivo `SETUP.md` para más detalles de configuración.

---

## 📄 Información Técnica

- **Plataforma:** Web (funciona en cualquier navegador)
- **Backend:** Firebase Firestore
- **Autenticación:** Firebase Authentication
- **Responsivo:** Sí (funciona en móvil y desktop)
- **Requiere instalación:** No

---

**Última actualización:** Mayo 2026

/**
 * CONFIGURACIÓN DE FIREBASE
 * 
 * IMPORTANTE: Actualiza estos valores con tu proyecto Firebase
 * 
 * Para obtener estas credenciales:
 * 1. Ve a https://console.firebase.google.com/
 * 2. Selecciona tu proyecto "bklasrastras"
 * 3. Haz clic en "Configuración del proyecto" (⚙️)
 * 4. Copia los datos de "SDK de Firebase para web"
 */

const firebaseConfig = {
  apiKey: "AIzaSyBzJsuxacvqTVqF7TLIvEV3Rh8Mn1sY-nY",
  authDomain: "bklasrastras.firebaseapp.com",
  // ... etc
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const collectionName = "mermasBK";

/**
 * INSTRUCCIONES PARA OBTENER LAS CREDENCIALES:
 * 
 * 1. Abre https://console.firebase.google.com/
 * 2. Click en "Agrega un proyecto"
 * 3. Nombre: "bklasrastras"
 * 4. Crea el proyecto
 * 5. En el panel, haz click en "Agregar app"
 * 6. Selecciona "Web" (</>)
 * 7. Copia el objeto "firebaseConfig"
 * 8. Reemplaza los valores aquí
 * 9. Guarda el archivo
 * 
 * USUARIOS POR DEFECTO:
 * Email: matipizarro23@icloud.com
 * Contraseña: BK2026!SecurePass#123
 * 
 * Para crear más usuarios:
 * 1. Ve a Firebase Console > Authentication
 * 2. Haz click en "Agregar usuario"
 * 3. Ingresa email y contraseña
 */

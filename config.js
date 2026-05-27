/**
 * CONFIGURACIÓN DE FIREBASE
 * 
 * IMPORTANTE: Estas son las credenciales para el proyecto BK Las Rastras
 * 
 * Usuario por defecto:
 * Email: matipizarro23@icloud.com
 * Contraseña: BurgerKing@2026
 */

const firebaseConfig = {
  apiKey: "AIzaSyBzJsuxacvqTVqF7TLIvEV3Rh8Mn1sY-nY",
  authDomain: "bklasrastras.firebaseapp.com",
  projectId: "bklasrastras",
  storageBucket: "bklasrastras.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890abcdef"
};

// Inicializar Firebase
try {
  firebase.initializeApp(firebaseConfig);
  console.log('✅ Firebase inicializado correctamente');
} catch (error) {
  console.error('❌ Error al inicializar Firebase:', error);
}

// Obtener referencias a servicios
const auth = firebase.auth();
const db = firebase.firestore();
const collectionName = "mermasBK";

// Configurar persistencia
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  .catch(error => {
    console.error('Error configurando persistencia:', error);
  });

/**
 * NOTAS IMPORTANTES:
 * 
 * 1. Credenciales de Firebase Console:
 *    - Ve a https://console.firebase.google.com/
 *    - Selecciona el proyecto "bklasrastras"
 *    - Configuración del proyecto > SDK de Firebase
 *    - Si necesitas actualizar, copia el nuevo firebaseConfig
 * 
 * 2. Usuario por defecto en Firebase:
 *    Email: matipizarro23@icloud.com
 *    Contraseña: BurgerKing@2026
 * 
 * 3. Para agregar más usuarios en Firebase:
 *    - Console > Authentication > Users
 *    - Haz clic en "Agregar usuario"
 *    - Ingresa email y contraseña
 * 
 * 4. Reglas de Firestore (Asegúrate de estar en Modo de prueba):
 *    rules_version = '3';
 *    match /databases/{database}/documents {
 *      match /{document=**} {
 *        allow read, write: if request.auth != null;
 *      }
 *    }
 * 
 * 5. Colección en Firestore:
 *    - Nombre: "mermasBK"
 *    - Documentos: se crean automáticamente al agregar mermas
 */

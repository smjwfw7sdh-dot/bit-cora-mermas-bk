/**
 * CONFIGURACIÓN DE FIREBASE
 * 
 * IMPORTANTE: Estas son las credenciales configuradas para el proyecto BK Las Rastras
 * 
 * Credencial por defecto:
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
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const collectionName = "mermasBK";

/**
 * NOTAS IMPORTANTES:
 * 
 * 1. Las credenciales anteriores son de demostración
 * 2. Para usar en producción, actualiza con tus credenciales reales:
 *    - Ve a https://console.firebase.google.com/
 *    - Selecciona el proyecto "bklasrastras"
 *    - Configuración del proyecto > SDK de Firebase
 *    - Copia el objeto firebaseConfig
 * 
 * 3. Usuario por defecto ya configurado en Firebase:
 *    Email: matipizarro23@icloud.com
 *    Contraseña: BurgerKing@2026
 * 
 * 4. Para agregar más usuarios en Firebase:
 *    - Console > Authentication > Users
 *    - Haz clic en "Agregar usuario"
 *    - Ingresa email y contraseña
 * 
 * 5. Reglas de Firestore (Modo de prueba - IMPORTANTE para producción):
 *    rules_version = '3';
 *    match /databases/{database}/documents {
 *      match /{document=**} {
 *        allow read, write: if request.auth != null;
 *      }
 *    }
 */

# 📱 Guía para Generar APK de LiveShopping RD

## ✅ Estado Actual
- ✓ Build de producción completado (`dist/`)
- ✓ Capacitor instalado y configurado
- ✓ Proyecto Android creado
- ✓ Permisos de cámara agregados
- ✓ Todo sincronizado

## 🚀 Métodos para Generar la APK

### Método 1: Con Android Studio (Recomendado)

1. **Abre Android Studio**
   ```bash
   npm run android
   ```
   O manualmente:
   - Abre Android Studio
   - Selecciona: "Open an Existing Project"
   - Navega a: `C:\Users\migue\OneDrive\Documentos\GitHub\LiveShoppingRD\android`

2. **Espera a que Gradle sincronice**
   - Esto puede tomar unos minutos la primera vez

3. **Genera la APK de Debug (para pruebas)**
   - Menú: `Build` → `Build Bundle(s) / APK(s)` → `Build APK(s)`
   - Espera a que termine
   - Click en "locate" en la notificación
   - La APK estará en: `android/app/build/outputs/apk/debug/app-debug.apk`

4. **Genera la APK de Release (para producción)**
   - Menú: `Build` → `Generate Signed Bundle / APK`
   - Selecciona "APK"
   - Crea un nuevo keystore o usa uno existente
   - La APK firmada estará en: `android/app/build/outputs/apk/release/`

### Método 2: Desde la Terminal (APK de Debug)

```bash
# Asegúrate de estar en la raíz del proyecto
cd android

# Windows
.\gradlew.bat assembleDebug

# La APK estará en: android\app\build\outputs\apk\debug\app-debug.apk
```

### Método 3: APK de Release desde Terminal

```bash
cd android

# Windows
.\gradlew.bat assembleRelease

# La APK estará en: android\app\build\outputs\apk\release\app-release-unsigned.apk
```

## 📦 Instalar la APK en tu Dispositivo

### Opción A: Con Cable USB

1. Habilita "Depuración USB" en tu teléfono:
   - Ajustes → Acerca del teléfono → Toca 7 veces en "Número de compilación"
   - Ajustes → Opciones de desarrollador → Habilita "Depuración USB"

2. Conecta tu teléfono a la PC

3. Desde Android Studio:
   - Click en el botón "Run" (▶) 
   - Selecciona tu dispositivo

4. O desde terminal:
   ```bash
   npx cap run android
   ```

### Opción B: Transferir APK Manualmente

1. Copia el archivo `app-debug.apk` a tu teléfono (por cable, Bluetooth, o nube)

2. En tu teléfono:
   - Abre el archivo APK
   - Permite instalación de fuentes desconocidas si se solicita
   - Instala la aplicación

## 🔄 Workflow de Desarrollo

Cuando hagas cambios en el código:

```bash
# 1. Haz tus cambios en src/

# 2. Genera el build
npm run build

# 3. Sincroniza con Android
npx cap sync android

# 4. Abre en Android Studio y genera nueva APK
npx cap open android
```

O simplemente:
```bash
npm run android
```

## 🎯 Permisos Incluidos

La app tiene los siguientes permisos configurados:
- ✓ CAMERA - Para capturar fotos de piezas
- ✓ RECORD_AUDIO - Para audio en lives
- ✓ INTERNET - Para funcionalidad web
- ✓ READ/WRITE_EXTERNAL_STORAGE - Para guardar imágenes

## ⚙️ Configuración Actual

- **App ID**: `com.liveshopping.rd`
- **Nombre**: LiveShopping RD
- **Scheme**: HTTPS
- **WebDir**: `dist/`

## 🐛 Solución de Problemas

### Error: "Android SDK not found"
- Instala Android Studio completamente
- Configura la variable de entorno `ANDROID_HOME`

### Error de compilación de Gradle
```bash
cd android
.\gradlew.bat clean
.\gradlew.bat build
```

### La cámara no funciona en la APK
- Verifica que los permisos estén en AndroidManifest.xml
- Asegúrate de estar usando HTTPS (ya configurado)

## 📱 Ubicaciones de las APK

- **Debug**: `android/app/build/outputs/apk/debug/app-debug.apk`
- **Release**: `android/app/build/outputs/apk/release/app-release.apk`

---

**¡Listo para probar en tu dispositivo Android!** 🎉

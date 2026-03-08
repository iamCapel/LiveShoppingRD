@echo off
setlocal enabledelayedexpansion

echo --------------------------------------------------
echo [1/5] Descargando ultimos cambios de main...
git pull origin main
if !errorlevel! neq 0 (echo ERROR en Git Pull && pause && exit /b)

echo [2/5] Instalando dependencias nuevas...
call npm install
if !errorlevel! neq 0 (echo ERROR en NPM Install && pause && exit /b)

echo [3/5] Compilando aplicacion web...
call npm run build
if !errorlevel! neq 0 (echo ERROR en NPM Build && pause && exit /b)

echo [4/5] Sincronizando con Capacitor...
call npx cap sync android
if !errorlevel! neq 0 (echo ERROR en Capacitor Sync && pause && exit /b)

echo [5/5] Generando APK...
cd android

REM Limpieza deshabilitada por conflictos con OneDrive
REM Para hacer clean manualmente: gradlew --stop, luego eliminar carpeta build

call .\gradlew.bat assembleDebug
if !errorlevel! neq 0 (echo ERROR en Generacion de APK && pause && exit /b)

echo.
echo ======================================================
echo PROCESO COMPLETADO EXITOSAMENTE
echo APK lista en: android\app\build\outputs\apk\debug\app-debug.apk
echo ======================================================
pause

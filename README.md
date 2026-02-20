# ShopLive - Aplicación de Live Shopping

Una aplicación moderna de compra y venta en vivo con transmisión en tiempo real, sistema de subastas y stories de 24 horas.

## 🚀 Características

- 📹 **Transmisión en vivo** - Video en tiempo real usando la cámara del dispositivo
- 🔨 **Sistema de subastas** - Timer de 10 segundos que se reinicia con cada puja
- 💰 **Precio fijo o subasta** - El vendedor elige para cada pieza
- 📸 **Stories de 24 horas** - Los vendedores muestran adelantos de sus productos
- 👥 **Sistema de seguidores** - Sigue a tus vendedores favoritos
- 🔔 **Notificaciones en tiempo real** - Capturas de pantalla automáticas al reservar
- 📱 **Diseño móvil moderno** - Interfaz estilo Android nativa

## 📦 Instalación

### Prerequisitos

- Node.js (versión 16 o superior)
- npm o yarn

### Pasos

1. **Instalar dependencias**

```bash
npm install
```

2. **Iniciar el servidor de desarrollo**

```bash
npm run dev
```

3. **Abrir en el navegador**

La aplicación se abrirá automáticamente en `http://localhost:5173`

## 🏗️ Scripts disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Crea la versión de producción
- `npm run preview` - Previsualiza la versión de producción

## 📱 Uso

### Para Vendedores

1. Regístrate como "Vendedor"
2. Publica stories para mostrar tus próximos productos
3. Inicia una transmisión en vivo
4. Muestra cada pieza y elige entre precio fijo o subasta
5. Recibe notificaciones cuando alguien reserve

### Para Compradores

1. Regístrate como "Comprador"
2. Busca y sigue vendedores
3. Ve sus stories para conocer próximos lives
4. Únete a transmisiones en vivo
5. Puja o reserva las piezas que te gusten

## 🛠️ Tecnologías

- **React 18** - Framework de UI
- **Vite** - Build tool y dev server
- **Tailwind CSS** - Estilos utilitarios
- **Lucide React** - Iconos
- **WebRTC** - Transmisión de video en tiempo real

## 📝 Notas

- La app requiere permisos de cámara para transmitir en vivo
- Las stories se eliminan automáticamente después de 24 horas
- El timer de subasta se reinicia a 10 segundos con cada nueva puja
- Los compradores solo pueden reservar cuando la subasta está cerrada

## 🔒 Permisos necesarios

- **Cámara** - Para transmisiones en vivo (solo vendedores)
- **Micrófono** - Para audio en las transmisiones (solo vendedores)

## 📄 Licencia

MIT

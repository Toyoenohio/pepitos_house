# 🌭 Pepitos House 251 — Web & Pedidos Online

> *"Auténtico sabor guaro en cada bocado"*  
> Delivery en **Barcelona, Lechería y Puerto La Cruz**, Estado Anzoátegui, Venezuela.

---

## 🚀 Tecnologías

- **Framework:** [Astro 5](https://astro.build/) (Modo `server` con SSR)
- **Despliegue:** [Cloudflare Pages](https://pages.cloudflare.com/) (`@astrojs/cloudflare`)
- **Base de Datos:** [Neon PostgreSQL](https://neon.tech/) Serverless con [Drizzle ORM](https://orm.drizzle.team/)
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/) (Diseño Neo-Brutalista con sombras sólidas y contrastes vibrantes)
- **Gestión de Estado:** [Nano Stores](https://github.com/nanostores/nanostores) con persistencia en `localStorage`
- **Componentes Interactivos:** React 19 Islands

---

## 🌟 Funcionalidades

1. **📍 Landing Page con GEO-SEO Local:**
   - Meta tags de geolocalización específicas para Anzoátegui.
   - Schema.org JSON-LD estructurado de `Restaurant`.
   - Open Graph y Twitter Cards listos para compartir en redes y WhatsApp.

2. **🥪 Menú Digital Interactivo:**
   - Categorías: Pepitos Clásicos, Especiales Guaro, Hamburguesas, Bebidas y Postres.
   - Selector de tamaños: **30cm, 50cm y 1 metro**.
   - Modificadores y extras personalizables (pecorino, tocineta, salsas de la casa).
   - Búsqueda en tiempo real.

3. **⏰ Horario de Atención Estricto:**
   - **Jueves a Lunes de 3:00 PM a 10:00 PM (Hora de Venezuela UTC-4)**.
   - Martes y Miércoles: Cerrado.
   - Detección automática en zona horaria `America/Caracas` que bloquea pedidos fuera del horario de servicio.

4. **🛒 Carrito y Checkout Estilo Shopify:**
   - Drawer lateral accesible desde cualquier sección.
   - Checkout de una sola página (datos de contacto, método de entrega, pago móvil/efectivo).

5. **📲 Despacho a WhatsApp (`+58 424-831-9602`):**
   - Recibo formateado en Markdown estructurado que abre directamente la conversación con el pedido listo.

6. **🎟️ Tarjeta de Sellos Digital (/membresia):**
   - Tarjeta de fidelidad con 10 sellos estilo pasaporte.
   - 10 sellos = 1 Pepito Clásico gratis con animación de confeti.

7. **⚙️ Panel de Administración (/admin):**
   - Switch de disponibilidad inmediata (86).
   - Selector de días disponibles por producto.
   - Creador de nuevos productos.

---

## 🛠️ Instalación y Uso Local

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.example .env

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Compilar para producción (Cloudflare Pages)
npm run build
```

---

## 🌐 Despliegue en Cloudflare Pages

1. Conecta tu repositorio de GitHub en el panel de **Cloudflare Pages**.
2. Configuración de Build:
   - **Framework preset:** `Astro`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
3. Variables de entorno:
   - `DATABASE_URL`: Cadena de conexión de tu base de datos Neon Postgres.

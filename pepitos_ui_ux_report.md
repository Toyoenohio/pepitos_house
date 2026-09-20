# Pepitos House 251 — Auditoría UI/UX (con evidencia)

**Repo:** Toyoenohio/pepitos_house · **Stack:** Astro 5 SSR + React 19 + Tailwind v4
**Método:** build (`astro build` OK, `astro check` 0 errores), servidor dev, y render headless Chromium (puppeteer-core) a 320/360/390/414/768/1440 + medición de estilos computados + consola.

---

## 🔴 Críticos / Alta

### 1. Icono del carrito roto en todas las páginas (+ error de consola)
`CartBadge.tsx` — el path del SVG está corrupto y la altura es negativa.
```jsx
<svg className="w-4 -h-4" ...>          // "-h-4" no existe
  <path d="M16 11V7a4 4 0 00-8 0v4M989h14l1 12H4DL5 9z" />  // "M989h14", "H4DL5" → path inválido
```
**Evidencia (consola, en /, /menu, /checkout, /membresia, /admin):**
```
Error: <path> attribute d: Expected number, "…4 0 00-8 0v4M989h14l1 12H4DL5 9z".
```

### 2. Foto de producto aplastada en móvil (`y-40` en vez de `h-40`)
`ProductCatalog.tsx` línea 153:
```jsx
<div className="w-40 y-40 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full ...">
```
`y-40` no es una clase válida → en viewports <640px el círculo tiene ancho (160px) pero **sin alto**.
**Evidencia (medido a 390px):** contenedor de imagen `144 × 48 px` (plano/ovalado), el `alt` desborda y se encima con la etiqueta "MÁS VENDIDO".
Además `index.astro` línea 64 tiene `wfull` en vez de `w-full` (tarjeta hero).

### 3. Fondo de color de las tarjetas nunca se aplica (y `--` visible)
`ProductCatalog.tsx` línea 134 usa comillas simples en vez de template literal:
```jsx
<div className={"${product.bgAccent} p-5 relative border-b-2 ..."}>
```
→ el `className` queda literalmente `"${product.bgAccent} p-5 ..."`, `bgAccent` no se inyecta. **Evidencia:** `topBlockComputedBg = rgba(0,0,0,0)` (transparente) en las 12 tarjetas; todas pierden su cabecera de color de marca.
En el mismo archivo, línea 133: `--            {/* Top Media Block */}` → el texto `--` se renderiza dentro de cada tarjeta. **Evidencia:** 12/12 tarjetas contienen `--` en su `textContent`.

### 4. Hydration mismatch en TODAS las páginas
El carrito usa `persistentMap` de nanostores (localStorage). En SSR el carrito se renderiza vacío y en el cliente se hidrata con lo guardado → React falla la hidratación y re-renderiza todo.
**Evidencia (consola, cada página):**
```
PAGEERROR: Hydration failed because the server rendered HTML didn't match the client.
  <CartBadge>  +1 / -0      <CartDrawer>  <CheckoutForm> ...
```
Efecto visible: el contador del carrito parpadea en 0 y luego salta al valor real.

### 5. El toast de "Agregado" nunca aparece
`ProductCatalog.tsx` línea 232:
```jsx
className={`... ${-toastMessage ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
```
`-toastMessage` = negación de un string = `NaN` → siempre falso → el toast queda permanentemente invisible.
**Evidencia (después de pulsar "Agregar al carrito"):** el elemento existe con el texto correcto pero `opacity: 0`, `scale-95`, `pointer-events-none`.

### 6. Panel admin sin autenticación y sin efecto real
- `/admin` es público y enlazado desde el footer. No hay ningún gate de contraseña (`ADMIN_PASSWORD` declarado en `.env.example`/`env.d.ts` pero **nunca se usa**). **Evidencia:** `authWall = false`, sin `input[type=password]`.
- Los toggles de disponibilidad/días solo cambian estado local (`useState(INITIAL_PRODUCTS)`); no persisten ni se reflejan en el menú: `isAvailable` e `isItemAvailableToday` **no se consumen** en `ProductCatalog`. → el switch "86" es decorativo.

---

## 🟠 Medios

### 7. Carrito lateral (drawer): sin backdrop, sin bloqueo de scroll, sombra rota
`CartDrawer.tsx`:
- `shadow-21l` (invalido) → **no hay sombra**. Evidencia: `boxShadow: none`.
- No hay overlay/backdrop ni cierre con ESC/click fuera; el scroll del body sigue activo. Evidencia: `docsScrollLocked: visible`, `backdrop: 0`.
- Línea 138: el estado "deshabilitado con carrito vacío" usa una cadena literal (no template literal), así que el botón "IR AL CHECKOUT" **nunca se deshabilita**.
```jsx
className={"items.length === 0 ? 'pointer-events-none opacity-50' : ''} w-full bg-brandBlue ..."}
```

### 8. Formulario de checkout con clases rotas
`CheckoutForm.tsx`:
- `<form className="... shadow-brutal-space-y-6">` (falta espacio) → ni sombra ni espaciado vertical entre secciones. Evidencia: `formClass` confirmado en DOM.
- `p-xl-6` (invalido), `<span text-brandBlue>` (JSX inválido) → **el total se pinta negro, no azul**, y React tira warning:
```
Error: React does not recognize the `text-brandBlue` prop ...
```
- Estado vacío: `max-w-2l|` (línea 117) → clase rota (evidencia en el diff de hidratación: `max-w-2l| ...` vs `max-w-6xl`).

### 9. Texto visible con mojibake y typos (copia)
- **Marquee (BaseLayout):** `PAGO MÓVIL \x10� TASA BCV` (carácter de control 0x10 + U+FFFD), "EL AUTÁNTICO" (→ AUTÉNTICO), "TARJETA DE SELL_OS", "AUTÉNTICO SABOR GUARO  P ANZOÁTEGUI" (separador " P " suelto), "‑100% ternera". Evidencia: `marqueeText` capturado del DOM.
- **Checkout:** banner "Local Cerrado al **Mástro** Guaro"; botón deshabilitado "LOCAL CERRADO ( **JORDADE** 3PM-10PM)" (evidencia: texto literal del botón); "**Téléfono**" (acento francés); "**N\*** de apto"; "**Parace** que aún…"; "TU Bolsa Está **Limpiaecita**".
- **CartDrawer:** "¡La bolsa está **vací`�**" (truncado + U+FFFD); "Pago Móvil **BCU**" (→ BCV).
- **Loyalty:** "**Aoun** no tienes" (×2), "Cliente **Guago**" (→ Guaro), "sellos **acuales**".
- **Admin:** "Jue-Lun (**3zm**-10pm)"; stats por defecto `👹\x02\x030cm ′ Lomito` (caracteres de control, se aplican a todo producto nuevo); botón de cierre `✨` (debería ser ✕); "APAGADO (86)" con icono ✨.
- **index.astro:** "**prequio**" (→ premio), "**trádicionales**".

### 10. Tarjeta de membresía muestra sellos falsos
Sin `DATABASE_URL`, `/api/loyalty` devuelve **3 sellos inventados para cualquier email** y el `catch` del cliente hace lo mismo.
**Evidencia:** `curl /api/loyalty?email=test@example.com` → `{"member":{...,"currentStamps":3,"totalStamps":3}}`.
→ En local/fallback, cualquier visitante ve 3 sellos que no ganó.

---

## 🟡 Bajos

- **Sin favicon ni robots.txt** (`/favicon.ico` → 404). **`og:image=/og-cover.jpg` → 404**: al compartir en WhatsApp (su canal principal de venta) no hay imagen de previsualización.
- **JSON-LD/SEO con teléfono malformado:** `"telephone": "+584****9602"`.
- Clases muertas/typos adicionales: `mg:text-5xl` (heading "Menú 251" no escala en md), placeholder `"Buscarpepito de lomito"` (falta espacio), `items-first`, `max-h-[y0-90vh]`, `border-black/p15`, `pb-yl-4`, `pt-yl-2`, `border-3 … border-2` (conflicto de ancho de borde en la tarjeta).
- **Sticky header:** el marquee mide 30px pero el header usa `top-[31px]` → costura de 1px donde se ve el contenido al hacer scroll.
- **Sin menú de navegación en móvil** (solo icono de membresía + carrito); los enlaces Inicio/Menú/Checkout desaparecen bajo `md`.

---

## Verificación / no-issues (para no inflar)
- Sin overflow horizontal en ninguna página a 320–1440 (el marquee que "se sale" es el propio marquee animado, `scrollWidth == clientWidth` en todos los anchos).
- `border-3` SÍ funciona en Tailwind v4 (renderiza 3px) → no es bug.
- Las imágenes de Unsplash dan `net::ERR_BLOCKED_BY_ORB` solo en headless Chromium (artefacto del test, no bug real); el bug real de imagen es el `y-40` del punto 2.

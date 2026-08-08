# The Temple Fitness Club · Loncoche

Sitio de una sola página para **The Temple Fitness Club**, Loncoche, Región de La Araucanía.

> Versión **plantilla**: sin fotos reales todavía. Se ve completo usando capas de fondo animadas,
> tipografía e íconos SVG.

## Cómo abrirlo

Doble clic en `index.html`. No necesita instalar nada.

Para verlo con servidor local (útil para probar en el celular):

```bash
powershell -ExecutionPolicy Bypass -File serve.ps1
```

Queda en `http://localhost:8767`.

## Estructura

```
the-temple-fitness-club/
├─ index.html            ← todo el sitio (HTML + CSS + JS en un archivo)
├─ imagenes/             ← aquí van las fotos reales
├─ versiones/
│  └─ v1-clasica.html    ← el primer diseño, por si quieres volver a él
├─ serve.ps1
└─ LEEME.md
```

---

## La identidad visual

### Tipografía (tres voces, no una)

| Fuente | Para qué | Por qué |
|---|---|---|
| **Archivo** (400–900) | Titulares pesados y cuerpo de texto | Grotesca con carácter, aguanta pesos extremos sin verse genérica |
| **Instrument Serif** *itálica* | Las palabras "sagradas": *templo*, *distintos*, *puedas* | Serif de alto contraste. Es lo que da el aire de templo y rompe con el gimnasio típico |
| **JetBrains Mono** | Etiquetas, índices, coordenadas, horarios | Aire de ficha técnica. Los números y datos se leen como un informe |

El contraste **grotesca pesada + itálica elegante** es el corazón del diseño. Si cambias una,
cambia todo. Están en las variables `--display`, `--serif` y `--mono`.

### Nada de tarjetas

No hay ni un `border-radius` fuera de los círculos. La estructura se arma con **líneas finas**
(`--linea`), números de índice y espacio en blanco. Los servicios son un **índice de libro**,
no una grilla de cajitas.

### Capas de fondo

Todas viven dentro de `.escenario` y se recortan solas. Puedes mezclarlas donde quieras:

| Clase | Efecto | Referencia |
|---|---|---|
| `.aurora` | Manchas de color que respiran. Ciclos de 68s, 86s y 104s | Linear / Stripe |
| `.reticula` | Grilla fina con máscara radial | Vercel |
| `.reticula.puntos` | Patrón de puntos | MagicUI dot-pattern |
| `.suelo` | Grilla en perspectiva que se aleja (la nave del templo) | — |
| `.constelacion` | Canvas de puntos conectados con líneas | particles.js / Vanta |
| `.humo` | Ruido generativo `feTurbulence` derivando en 120s | Codrops |
| `.vineta` | Cierra los bordes y asegura contraste del texto | — |

Los tiempos son largos **a propósito**: se nota el movimiento pero no distrae al leer.
Si quieres más calma, sube los segundos en `@keyframes deriva-a/b/c`.

### Efectos de luz

| Clase | Qué hace |
|---|---|
| `.brillo` | Destello dorado que recorre el texto cada 7s |
| `.marco` | Marco cuyo borde tiene una luz que gira (usa `@property --giro`) |
| `.esquinas` + `<i class="corte corte-1/2">` | Corchetes de encuadre, como marcas de imprenta |
| `.encuadre-foto` | Zoom lento Ken Burns (22s) + zoom extra al pasar el mouse |
| `.boton-oro` | Destello blanco que cruza el botón en hover |
| `.boton-linea` | Corchetes que se abren hacia las esquinas |
| `.enlace-luz` | Subrayado que se dibuja de izquierda a derecha |
| `.fila` | Lavado dorado + hilo de luz que recorre el borde inferior |

### Animaciones de entrada

Se activan al hacer scroll con `IntersectionObserver`. Se aplican con el atributo `data-ent`:

- `data-ent="linea"` — la línea de texto sube tras una máscara (para titulares)
- `data-ent="sube"` — el bloque aparece subiendo
- `data-ent="cortina"` — se descubre de arriba a abajo (para encuadres)

Para escalonar varios: `style="--retardo:.12s"`.

---

## Qué editar y dónde

| Quiero cambiar… | Búscalo en `index.html` |
|---|---|
| **Teléfono / WhatsApp** | `56965706172` (en enlaces y en la constante `WHATSAPP` del JS) |
| **Direcciones** | `Pedro Montt 541` |
| **Horarios (texto)** | Sección `id="horarios"`, lista `.dias` |
| **Horarios (lógica abierto/cerrado)** | Objeto `HORARIOS` al inicio del `<script>` |
| **Servicios** | Sección `id="servicios"`, cada `<li class="fila">` |
| **Colores** | Bloque `:root` (`--oro`, `--negro`, `--linea`…) |
| **Tipografías** | `:root` (`--display`, `--serif`, `--mono`) + el `<link>` de Google Fonts |
| **Correo** | `contacto@thetemplefitness.cl` |
| **Redes sociales** | En el pie, los `href="#"` de `.redes` |
| **Cifras** | `.franja` (portada) y `.cifras` (atributo `data-cuenta`) |
| **Coordenadas decorativas** | `39°22′S · 72°38′O` |

### Horarios — formato del objeto `HORARIOS`

Minutos desde medianoche: `09:00 = 540`, `16:00 = 960`, `23:00 = 1380`.
Día: `0 = domingo` … `6 = sábado`. `null` = cerrado.

```js
const HORARIOS = {
  0: null,          // Domingo cerrado
  1: [540, 1380],   // Lunes 09:00 — 23:00
  ...
  6: [540,  960]    // Sábado 09:00 — 16:00
};
```

El estado "Abierto ahora — cierra 23:00" se calcula con la hora de **America/Santiago**, así que
funciona aunque el visitante esté en otro país. Se refresca cada minuto y aparece en dos lugares:
en la portada y en la hoja de horarios. El día actual se marca con una barra dorada.

---

## Cómo poner las fotos reales

Deja las imágenes en `imagenes/` y luego:

**1. Fondo de la portada** — en la sección `.portada`, dentro de `.escenario`, hay una línea
comentada. Descoméntala y apunta a tu foto:

```html
<div class="encuadre-foto" style="background-image:url('imagenes/hero.jpg');opacity:.35"></div>
```

Va **debajo** de la aurora, la retícula y la viñeta, así que el texto sigue legible.
Recomendado: JPG horizontal, mínimo 1920×1080, más bien oscuro.

**2. Foto de filosofía** — busca `.filo-encuadre` y pon `background-image` en su `.encuadre-foto`.
Es vertical (3:4). Ya trae zoom lento, marco con luz y corchetes. Cuando pongas la foto, borra
el `<span class="glifo">T</span>`.

**3. Íconos de servicios** — la clase es `.ic` dentro de cada `.fila-nombre`. Puedes cambiar el
`<svg>` por otro sin tocar el CSS.

**4. Mapa** — busca `.radar` y reemplaza el bloque completo por el `<iframe>` de Google Maps
("Compartir → Insertar un mapa").

**5. Imagen para redes (Open Graph)** — descomenta `<meta property="og:image">` en el `<head>`
y apunta a `imagenes/og-portada.jpg` (1200×630).

**6. Favicon / logo** — el `<link rel="icon">` usa un SVG en línea. Reemplázalo por
`<link rel="icon" href="imagenes/favicon.png">`.

---

## Notas técnicas

- HTML5 semántico, CSS con variables + Grid/Flexbox, JS vanilla. Sin librerías.
- Mobile-first. Cortes en 600px, 900px y 1240px.
- Dark mode por defecto (es la identidad).
- Respeta `prefers-reduced-motion`: si el usuario pidió menos movimiento, se apagan las
  animaciones, la constelación no se dibuja y todo aparece de una.
- La constelación se **apaga sola** cuando la portada sale de pantalla o cambias de pestaña,
  para no gastar batería.
- Si el JS no corre, la clase `html.js` no se aplica y **todo el contenido se ve igual**,
  solo sin animaciones de entrada.
- El formulario no necesita servidor: arma el mensaje y abre WhatsApp con el texto listo.
- Incluye JSON-LD para la ficha de Google.
- Única dependencia externa: Google Fonts. Si no carga, hay fuentes de respaldo del sistema.

## Pendientes antes de publicar

- [ ] Fotos reales (portada, filosofía)
- [ ] Logo definitivo + favicon
- [ ] Correo real de contacto
- [ ] Enlaces reales de Instagram / Facebook / TikTok
- [ ] Confirmar la dirección definitiva (hoy figuran dos: Pedro Montt 541 y Aníbal Pinto 381)
- [ ] Verificar las coordenadas exactas del local (las actuales son referenciales de Loncoche)
- [ ] Insertar el mapa de Google
- [ ] Dominio y hosting

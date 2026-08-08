# The Temple Fitness Club · Loncoche

Sitio de una sola página para **The Temple Fitness Club**, Loncoche, Región de La Araucanía.

> **Publicado** en https://yordyserna.github.io/the-temple-fitness-club/
> Con fotos y video reales del gimnasio.

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
├─ imagenes/
│  │  ── VIDEOS ──
│  ├─ clip-entrenamiento.mp4  ← 1,6 MB · fondo de la portada
│  ├─ tour-gimnasio.mp4       ← 13 MB · sección El recinto, bajo demanda
│  │
│  │  ── FOTOGRAMAS DEL TOUR (720×1280) ──
│  ├─ pasillo-luces.jpg   ← respaldo de la portada y póster del tour
│  ├─ luces-hexagonales.jpg, peso-libre.jpg, logo-piso.jpg,
│  ├─ maquinas-fila.jpg, sala-amplia.jpg, equipamiento.jpg,
│  ├─ zona-funcional.jpg, sala-general.jpg, vista-final.jpg,
│  ├─ maquinas-detalle.jpg, zona-pantalla.jpg
│  │
│  │  ── FOTOGRAMAS DEL CLIP (480×854) ──
│  ├─ logo-pared.jpg      ← el letrero de neón
│  ├─ kettlebells.jpg, mancuernas.jpg, discos.jpg
│  │
│  │  ── FOTOS ANTIGUAS (680px, del local anterior) ──
│  ├─ fuerza.webp, sala.webp, portada.webp, maquinas.webp
│  ├─ logo-banner.webp   ← logo real de la marca (og:image)
│  ├─ training-group.webp ← es un flyer con texto, no una foto
│  └─ plan-basico.webp   ← plan publicado: $30.000, 3 días x semana
├─ versiones/
│  └─ v1-clasica.html    ← el primer diseño, por si quieres volver a él
├─ serve.ps1
├─ .gitignore
└─ LEEME.md
```

### De dónde salieron los fotogramas

Las fotos que tenía el gimnasio no pasaban de 680px. Los dos videos, en
cambio, están en 720×1280 y 480×854. Los `.jpg` de la lista **son capturas
sacadas de esos videos**, así que tienen mejor resolución que cualquier foto
disponible.

Si algún día necesitas sacar más, el método es: servir la carpeta con
`serve.ps1`, abrir el mp4 en una página con un `<video>` oculto, mover
`currentTime` al segundo que quieras y dibujar el cuadro en un `<canvas>`
con `drawImage`. No hay forma de hacerlo por línea de comandos en este
equipo: no hay ffmpeg.

## Librerías (las tres por CDN, todas opcionales)

| Librería | Para qué |
|---|---|
| **Lenis** 1.1.20 | Scroll suave con inercia |
| **GSAP** 3.12.5 | Animaciones de revelado |
| **ScrollTrigger** 3.12.5 | Dispara las animaciones al llegar |

Si un CDN falla, el sitio **no se rompe**: cae al sistema propio de
`IntersectionObserver` y todo el contenido se ve igual, solo con animaciones
más simples. Esa es la razón de las clases `html.js` y `html.gsap`.

⚠️ Al ser CDN, el sitio necesita internet para el scroll suave y las
animaciones finas. El contenido, los horarios y el formulario funcionan
sin conexión.

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

Se aplican con el atributo `data-ent`:

- `data-ent="linea"` — titular. GSAP lo **parte en palabras** (o en letras si
  lleva la clase `.fuerte`) y cada trozo sube detrás de su propia máscara `clip-path`
- `data-ent="sube"` — el bloque aparece subiendo
- `data-ent="cortina"` — se descubre de arriba a abajo (para encuadres)

Para escalonar varios: `style="--retardo:.12s"`. GSAP lee esa misma variable,
así que el ritmo se controla desde el HTML tanto con GSAP como sin él.

**Sobre el partido de texto:** los elementos con `.brillo` o `.sacra` **no** se
parten, porque su degradado usa `background-clip:text` y se rompería en pedazos.
Los espacios entre palabras se reponen como nodos de texto **reales**, no con
`margin`, para que el lector de pantalla y el copiar-pegar sigan leyendo
"Tu cuerpo es un templo" y no "Tucuerpo".

### Cursor dorado

Punto que sigue al instante + anillo que llega tarde. Sobre `.boton`,
`.enlace-luz`, `.flotante`, `.redes a` y `.marca` el anillo crece a 1.9× y el
elemento se deja arrastrar hacia el cursor (efecto imán). Sobre campos de texto
el anillo se achica para no estorbar.

Solo se activa en equipos con mouse fino (`hover:hover` y `pointer:fine`).
En táctil ni se dibuja. Se apaga con `prefers-reduced-motion`.

---

## Qué editar y dónde

| Quiero cambiar… | Búscalo en `index.html` |
|---|---|
| **Teléfono / WhatsApp** | `56977512219` (en enlaces y en la constante `WHATSAPP` del JS) |
| **Dirección** | `Balmaceda 921` (y el `q=` del iframe del mapa) |
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

## Fotos y videos

Para cambiar cualquiera basta con reemplazar el archivo en `imagenes/`
respetando el nombre, o cambiar la ruta en el `style="..."`:

| Dónde | Archivo | Formato ideal |
|---|---|---|
| Fondo de portada (respaldo) | `pasillo-luces.jpg` | vertical u horizontal |
| Video de la portada | `clip-entrenamiento.mp4` | **máx. 2 MB** |
| Encuadre de Filosofía | `vista-final.jpg` | vertical 3:4 |
| Tour de El recinto | `tour-gimnasio.mp4` | vertical 9:16 |
| Póster del tour | `pasillo-luces.jpg` | igual que el video |
| Fondo del llamado final | `sala-general.jpg` | horizontal |
| Galería | 12 archivos, ver más abajo | cualquiera |

### Los dos videos, y por qué se cargan distinto

**El de la portada (1,6 MB)** se descarga siempre, salvo en tres casos donde
el JS ni lo pide: si el visitante activó *reducir movimiento*, si el navegador
declara ahorro de datos, o si la conexión es 2G/3G. Debajo hay una foto
completa, así que no cargarlo no rompe nada.

**El tour (13 MB)** nace **sin `src`**. Hasta que alguien no pulsa play, lo que
se ve es un fotograma de 200 KB y el mp4 no se toca. Esto importa: la mayoría
va a entrar por celular con datos.

> ⚠️ Si reemplazas el clip de la portada, **respeta el límite de 2 MB**. Ese
> archivo sí se descarga en cada visita.

El tour está grabado **en vertical** (720×1280, formato celular). Por eso su
marco es 9:16 con la ficha al costado, y no un rectángulo 16:9: en 16:9
quedaría con dos franjas negras enormes a los lados.

### El tratamiento de foto

Las fotos van detrás de texto, así que hay que apagarlas para que el titular
se lea. La clase `.foto` las baja de brillo y les quita parte del color, y
encima pone un velo que mezcla dorado y verde.

Antes iban a **blanco y negro puro**. Se cambió a `grayscale(.72)` porque el
verde del pasto sintético cubre todo el piso del gimnasio y es parte de cómo
se ve el lugar: en B/N el sitio se veía muerto.

Hay una segunda variante, **`.foto--viva`**, casi a color pleno. Es para
cuando la foto *es* el contenido y no hay texto encima que proteger.

Si quieres las fotos a color en todos lados, borra el `filter` de `.foto`.

### La galería

Las 12 piezas están escritas en el HTML dentro de `<div class="galeria">`.
Cada una lleva:

- `data-grande` → la imagen que abre el visor (puede ser una versión mayor)
- `data-pie` → el texto que sale abajo en el visor
- `.pieza-pie` → la etiqueta que aparece al pasar el cursor

El visor **toma las imágenes de ahí mismo**, no hay una segunda lista que
mantener sincronizada. Agregar una foto es copiar un bloque `<a class="pieza">`.

> ⚠️ **Si agregas o quitas fotos, cuenta las celdas.** En escritorio la
> galería es un mosaico de 4 columnas donde la pieza 01 ocupa 4 celdas y la
> 07 ocupa 2. Con 12 piezas el total da 16, es decir 4 filas exactas. Si el
> total deja de ser múltiplo de 4, aparece un hueco al final de la grilla.

⚠️ **Las fotos `.webp` antiguas son de 680px** y además parecen ser del local
anterior (estructura azul, discos rosados). Los `.jpg` sacados del video están
en 720×1280 y muestran el gimnasio como está hoy. Conviene pedirle al cliente
fotos nuevas en alta y jubilar las `.webp`.

### Otros elementos visuales

**Íconos de servicios** — la clase es `.ic` dentro de cada `.fila-nombre`.
Puedes cambiar el `<svg>` por otro sin tocar el CSS.

**Open Graph** — `<meta property="og:image">` apunta a `imagenes/logo-banner.webp`,
que es la única horizontal con la marca. Los fotogramas del tour no sirven acá:
son verticales y WhatsApp los recorta por el centro. Lo ideal sería una imagen
dedicada de 1200×630.

**Favicon / logo** — el `<link rel="icon">` usa un SVG en línea. El logo real
está en `imagenes/logo-banner.webp`; falta recortarlo y hacer un PNG limpio.

## Google Maps

Ya está puesto y funcionando. Es un **iframe con el mapa normal de Google**,
en colores.

**No necesita clave ni cuenta de Google.** El modo `?output=embed` es público
y gratis. Antes había un mapa con estilo Dark/Gold que sí exigía una clave de
pago con tarjeta asociada; nunca se activó y se quitó en agosto de 2026.

Para cambiar la dirección hay que tocar **dos** lugares, los dos en la sección
`id="horarios"`:

1. El parámetro `q=` del `src` del `<iframe>`
2. El `destination=` del enlace **Cómo llegar** que va justo debajo

Van con la dirección codificada para URL (los espacios como `%20` en el
primero y como `+` en el segundo). La forma fácil de sacarla: buscar el lugar
en Google Maps y copiar la dirección tal cual la muestra.

El iframe lleva `loading="lazy"`, así que el mapa no se descarga hasta que el
visitante llega a esa altura de la página.

> El mapa a todo color es lo único claro de un sitio íntegramente negro. Por
> eso lleva marco dorado y un `filter: brightness(.92)`: sin eso parece un
> error de carga.

---

## Accesibilidad

**Ninguna etiqueta baja de 12px.** Todas salen de dos variables:

```css
--etiqueta:    .75rem;   /* 12px — mínimo absoluto */
--etiqueta-md: .8125rem; /* 13px — etiquetas con más peso */
```

Si agregas texto nuevo, usa esas variables y no un valor suelto.

Como efecto secundario, el **menú de escritorio aparece recién a 1140px**: con
las etiquetas a 12px, logo + 5 entradas + CTA necesitan 990px y a 900px no
cabían. Por debajo manda la hamburguesa.

También: foco visible en dorado, `aria-expanded` en el menú, textos alternativos
en los enlaces y respeto total a `prefers-reduced-motion`.

## Rendimiento en móvil

El objetivo es 60 FPS en un teléfono de gama media. Lo que más cuesta en móvil
**no** son las animaciones de `transform`, sino tres cosas concretas, y por eso
son exactamente las que se apagan bajo 900px:

| Se apaga | Por qué |
|---|---|
| El grano fijo a pantalla completa | `mix-blend-mode` global obliga a recomponer todo |
| `blur(90px)` → `blur(56px)` | los filtros grandes sobre elementos enormes son caros |
| `.suelo`, `.humo`, `.brillo` y el marco giratorio | animan `background-position` o `conic-gradient`: repintan cada fotograma |

Además:

- La **constelación** baja a DPR 1.25, 26 puntos y **sin las líneas de unión**
  (que eran O(n²), lo más caro del canvas). Se apaga sola cuando la portada sale
  de pantalla o cambias de pestaña.
- **Lenis usa `syncTouch:false`**: en móvil el scroll táctil sigue siendo nativo,
  que es el que corre a 60 FPS de verdad. Lenis solo toma la rueda y el teclado.
- El **parallax** de la portada es un `scrub` (corre en cada fotograma), así que
  solo se crea en escritorio.
- Un solo reloj para todo: el ticker de GSAP mueve a Lenis y Lenis avisa a
  ScrollTrigger. No hay dos `requestAnimationFrame` compitiendo.

## Notas técnicas

- HTML5 semántico, CSS con variables + Grid/Flexbox, JS vanilla salvo Lenis y GSAP.
- Mobile-first. Cortes en 600px, 900px, 1140px y 1240px.
- Dark mode por defecto (es la identidad).
- Si el JS no corre, la clase `html.js` no se aplica y **todo el contenido se ve
  igual**, solo sin animaciones de entrada.
- El formulario no necesita servidor: arma el mensaje y abre WhatsApp con el texto listo.
- Incluye JSON-LD para la ficha de Google.

## Datos reales confirmados

- **Dirección: Av. José Manuel Balmaceda 921, Loncoche**, al lado del terminal
  de buses. Confirmado por el cliente en agosto de 2026 y verificado en Google
  Maps. Ya **no** trabajan en Pedro Montt 541 ni en Aníbal Pinto 381, que era
  lo que decía el sitio antes (y lo que todavía dice su Facebook).
- **WhatsApp comercial: +56 9 7751 2219**
- **Horario:** lunes a viernes 09:00–23:00, sábado 09:00–**15:00**, domingo cerrado
- Instagram: **@fitnessthetemple** (ya enlazado en el pie)
- Plan publicado: **Básico, 3 días x semana, lunes a sábado, $30.000**
  (está en `imagenes/plan-basico.webp`, todavía **no** hay sección de planes en el sitio)
- El logo real es **negro + amarillo** con azul en el emblema, no dorado.
  El sitio usa dorado, con verde como acento, por decisión de diseño.

## Pendientes

- [ ] **Fotos en alta resolución** — las `.webp` antiguas son de 680px y además
      parecen ser del local anterior
- [ ] Logo definitivo recortado + favicon PNG
- [ ] Correo real de contacto (hoy hay uno de ejemplo)
- [ ] Enlaces reales de Facebook y TikTok
- [ ] ¿Sección de planes con los precios reales? Hay uno publicado: $30.000,
      3 días x semana, en `plan-basico.webp`
- [ ] Confirmar si boxeo se sigue dictando (se quitó del índice de servicios)
- [ ] Decidir si la paleta se mantiene dorada o se ajusta al amarillo de la marca

### Resuelto

- [x] **Dirección** — Av. José Manuel Balmaceda 921, al lado del terminal de
      buses. Se mudaron: Pedro Montt 541 y Aníbal Pinto 381 ya no se usan.
      Verificado en Google Maps: el pin cae pegado al Terminal JAC/Turbus.
- [x] **WhatsApp** — cambiado al comercial, +56 9 7751 2219
- [x] **Horario del sábado** — cierran a las 15:00, no a las 16:00
- [x] **Google Maps** — puesto con iframe, sin necesidad de clave
- [x] **Fotos y video** — 16 fotogramas sacados de los dos videos del gimnasio

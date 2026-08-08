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
├─ imagenes/
│  ├─ portada.webp       ← fondo de la portada
│  ├─ sala.webp          ← encuadre vertical de Filosofía
│  ├─ fuerza.webp        ← fondo del llamado final
│  ├─ maquinas.webp      ← sin usar todavía
│  ├─ logo-banner.webp   ← logo real de la marca
│  ├─ training-group.webp
│  └─ plan-basico.webp   ← plan publicado: $30.000, 3 días x semana
├─ versiones/
│  └─ v1-clasica.html    ← el primer diseño, por si quieres volver a él
├─ serve.ps1
├─ .gitignore
└─ LEEME.md
```

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

## Fotos

Ya hay tres colocadas. Para cambiarlas basta con reemplazar el archivo en
`imagenes/` respetando el nombre, o cambiar la ruta en el `style="..."`:

| Dónde | Archivo | Formato ideal |
|---|---|---|
| Fondo de portada | `imagenes/portada.webp` | horizontal, ≥1920px |
| Encuadre de Filosofía | `imagenes/sala.webp` | vertical 3:4, ≥1000px |
| Fondo del llamado final | `imagenes/fuerza.webp` | horizontal, ≥1920px |

### El tratamiento de foto

Las fotos del gimnasio son muy coloridas (discos rosados, muros azules, pasto
verde) y peleaban con el negro y dorado. En vez de retocar archivos, la clase
`.foto` las pasa a **blanco y negro** y encima pone un **velo dorado en
`mix-blend-mode: overlay`**. Así cualquier foto nueva se integra sola.

Si alguna vez quieres verlas a color, borra el `filter` de `.foto`.

⚠️ **Las fotos actuales son de baja resolución** (680px de ancho). En la portada
se estiran a más del doble y se ven blandas. Si el gimnasio tiene los
originales, vale mucho la pena reemplazarlas.

### Otros elementos visuales

**Íconos de servicios** — la clase es `.ic` dentro de cada `.fila-nombre`.
Puedes cambiar el `<svg>` por otro sin tocar el CSS.

**Open Graph** — `<meta property="og:image">` apunta a `imagenes/portada.webp`.
Lo ideal es una imagen dedicada de 1200×630.

**Favicon / logo** — el `<link rel="icon">` usa un SVG en línea. El logo real
está en `imagenes/logo-banner.webp`; falta recortarlo y hacer un PNG limpio.

## Google Maps

El contenedor ya está, con estilo Dark/Gold. Para activarlo:

1. Saca una clave en [console.cloud.google.com](https://console.cloud.google.com)
   y habilita **Maps JavaScript API**.
2. Al final del `<body>` hay un `<script>` comentado. Descoméntalo y reemplaza
   `TU_CLAVE_AQUI`.
3. Ajusta `MAPA_CENTRO` en el JS con las coordenadas exactas del local
   (clic derecho en Google Maps → "¿Qué hay aquí?").

Las actuales son referenciales de Loncoche, **no** la puerta del gimnasio.

Sin clave se ve el estado de espera (`.mapa-espera`), que ya lleva el pin con
ondas de radar y un enlace real a Google Maps que sí funciona.

El estilo está en la constante `ESTILO_MAPA`: geometría casi negra, etiquetas
grises y autopistas trazadas en dorado. Sigue el formato de Snazzy Maps, así
que puedes pegar cualquier otro estilo de ahí en su lugar.

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

Salieron del material de marca que había en `imagenes/`:

- Instagram: **@fitnessthetemple** (ya enlazado en el pie)
- Plan publicado: **Básico, 3 días x semana, lunes a sábado, $30.000**
  (está en `imagenes/plan-basico.webp`, todavía **no** hay sección de planes en el sitio)
- El logo real es **negro + amarillo** con azul en el emblema, no dorado.
  El sitio usa dorado por decisión de diseño.

## Pendientes antes de publicar

- [ ] **Fotos en alta resolución** — las actuales son de 680px y se ven blandas
- [ ] Logo definitivo recortado + favicon PNG
- [ ] Correo real de contacto (hoy hay uno de ejemplo)
- [ ] Enlaces reales de Facebook y TikTok
- [ ] Confirmar la dirección definitiva (figuran dos: Pedro Montt 541 y Aníbal Pinto 381)
- [ ] Coordenadas exactas del local
- [ ] Clave de Google Maps
- [ ] ¿Sección de planes con los precios reales?
- [ ] Decidir si la paleta se mantiene dorada o se ajusta al amarillo de la marca

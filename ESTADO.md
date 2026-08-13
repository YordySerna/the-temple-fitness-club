# Dónde quedó esto — 12 de agosto de 2026

Traspaso para retomar desde otra sesión o desde otro equipo.

## Resumen en una línea

**Publicado y en vivo.** El sitio tiene ahora un portal de socios, y el
material multimedia quedó corregido. Falta conectar Flow.

## Dónde está

| Qué | Dónde |
|---|---|
| Sitio | https://yordyserna.github.io/the-temple-fitness-club/ |
| Portal de socios | https://yordyserna.github.io/the-temple-fitness-club/socios/ |
| Repo | https://github.com/YordySerna/the-temple-fitness-club |
| Portafolio (ficha 07) | https://yordyserna.github.io/ |

Los cuatro verificados respondiendo 200.

## Estado de los repos

| Repo | Rama | Estado |
|---|---|---|
| `the-temple-fitness-club` | `main` | al día con origin, publicado |
| `portafolio` | `master` | al día con origin |
| `calor-del-hogar` | `master` | al día con origin |

Si retomas desde otra máquina, haz `git fetch` antes de dar por bueno el
estado local.

---

## Lo que se hizo el 12 de agosto

### 1. Portal de socios

Página nueva en `socios/index.html`, con la misma paleta y tipografía del
sitio. Consulta por teléfono, muestra plan, vencimiento y monto, y ofrece
pagar.

**Corre en modo demo**: la constante `API_BASE` está vacía, así que usa tres
socios de prueba definidos en el propio archivo. No necesita backend para
funcionar ni para trabajar el diseño.

| Teléfono de prueba | Estado |
|---|---|
| `956781234` | Al día |
| `944556677` | Por vencer |
| `933221100` | Vencido |

Se llega desde **cuatro** lugares del sitio: el botón "Pagar mensualidad" de
la portada, el bloque "¿Ya eres socio?" en horarios, el menú móvil y el pie.

### 2. Arreglo del material multimedia

Se midieron los 17 elementos multimedia en pantalla. **Solo 3 estaban mal**,
y los tres eran fondos a ancho completo.

| Elemento | Antes | Ahora |
|---|---|---|
| Video de portada | 2.79× estirado | 1.83× |
| `pasillo-luces` | 1.76× estirado | 0.84× (reducido) |
| `sala-general` | 1.76× estirado | 0.84× (reducido) |

**La causa:** todo el material es vertical de celular (720×1280 y 480×854) y
se usaba como fondo horizontal. El navegador lo estiraba y recortaba el 78%
del encuadre.

Qué se hizo:

- **`fondo-portada.mp4`** (nuevo): sale de `tour-gimnasio.mp4` (720px) en vez
  del `clip-entrenamiento.mp4` viejo (480px). Recortado a 16s y
  **pre-desenfocado en el encode**, que comprime mucho mejor. 2 MB por 1.5×
  más resolución. El clip viejo se sacó del repo.
- **`sala-general-ancha.jpg` y `pasillo-luces-ancha.jpg`** (nuevas): 1500px
  con Lanczos + enfoque, recortadas al encuadre que realmente se usa. Ahora
  el navegador las reduce en vez de estirarlas.
- El desenfoque CSS del video bajó de 3px a 1.2px, porque el archivo ya viene
  desenfocado. Menos trabajo de GPU por fotograma.

⚠️ **Lo que no se puede arreglar con código:** la foto más grande tiene 720px
de ancho y una pantalla de escritorio pide 1300+. El video se queda en 1.83×
hasta conseguir originales. **El archivo original acredita a @johnfilms.cl** —
esa persona tiene los másteres en resolución completa. Es la mejora más grande
disponible y no cuesta nada de desarrollo.

### 3. Fuga de `will-change` corregida

Una regla CSS pedía capa de GPU para los 70 bloques de la página, de forma
permanente, aunque el visitante nunca bajara a verlos. Es de los mayores
comedores de memoria de GPU en móvil.

Ahora lo pide GSAP justo antes de animar cada bloque y lo suelta al terminar.
**De 127 elementos con `will-change` a 18** (2 del cursor + los que están
animando en ese momento).

---

## Lo que se probó con Flow y después se borró

El 12 de agosto se construyó y luego se descartó un experimento de pagos.
**Sigue existiendo en GitHub, privado**, aunque ya no está en el disco:

| Repo privado | Qué tiene |
|---|---|
| `github.com/YordySerna/laboratorio-pagos` | Simulador de cobro (HTML) + servidor FastAPI con SQLite y Flow Sandbox |
| `github.com/YordySerna/portal-socios` | Backend en Google Apps Script + planilla |

Se bajan con `git clone` si alguna vez sirven. Lo que vale la pena rescatar de
ahí es **la lógica de los cuatro pasos** al recibir un aviso de pago:

1. ¿La pasarela reconoce este identificador?
2. ¿Ya lo procesé antes? (idempotencia)
3. **¿La pasarela confirma que está pagado?** ← el que más se omite
4. Recién ahí, mover la fecha

Regla corta: **no le creas al aviso, pregúntale a la pasarela.**

### Sobre Flow

- Las credenciales de Sandbox **no se llegaron a usar**. Están en la cuenta de
  Flow, no en ningún archivo de estos repos.
- ⚠️ **Verificar si son de `sandbox.flow.cl` o de `www.flow.cl`.** Son cuentas
  separadas con claves distintas. Usar las de producción contra la URL de
  sandbox da `Invalid ApiKey`.
- Al copiarlas, usar el botón de copiar de Flow. Una API Key es hexadecimal
  (solo `0-9` y `A-F`): leerla de una pantalla confunde `O` con `0` y `l` con
  `1`, y el error aparece después disfrazado de "firma inválida".

### Sobre Getnet

La máquina POS de Santander y el cobro por web son **productos distintos**.
Tener el terminal no implica tener API de e-commerce. Hay que preguntarle al
ejecutivo si dan acceso de desarrollador y con qué condiciones — confirmarlo
antes de prometerle nada al cliente.

---

## Lo que quedó pendiente de decidir

Dos cosas que se pidieron y no se hicieron porque no estaba claro qué se
quería:

1. **"Dejar el frontend en distintas pestañas".** ¿Páginas HTML separadas
   (inicio, servicios, planes, socios) o una interfaz con pestañas dentro de
   la misma página?
2. **"Reemplazar el del portafolio con ese nuevo".** ¿Que la ficha 07 apunte a
   una versión de pruebas en vez de la actual?

Y una que sí está clara pero no se alcanzó a montar:

3. **Entorno de pruebas en línea.** Una rama `staging` con su propio GitHub
   Pages, separada de la que ve la clienta, para experimentar sin tocar el
   sitio que ella tiene el link.

---

## Qué se hizo antes (7 y 8 de agosto)

Sitio de una sola página, sin build, todo en `index.html`.

- **Tipografía:** Archivo 900 + Instrument Serif itálica + JetBrains Mono
- **Fondo por capas:** aurora, retícula, suelo en perspectiva, constelación en
  canvas, ruido generativo y viñeta
- **Lenis** para el scroll, **GSAP + ScrollTrigger** para el revelado por
  palabra y por letra con máscara `clip-path`
- **Cursor dorado magnético** en escritorio
- **Horario abierto/cerrado** calculado en vivo con hora de Chile
- **Formulario** que arma el mensaje y abre WhatsApp, sin servidor
- **Mapa** de Google embebido, sin necesidad de clave
- **Accesibilidad:** ninguna etiqueta baja de 12px
- **Rendimiento:** en móvil se apagan las mezclas y los repintados caros

Los detalles de cómo editar cada cosa están en [LEEME.md](LEEME.md).

---

## Datos de contacto vigentes

Confirmados por el cliente el 8 de agosto de 2026:

| Dato | Valor |
|---|---|
| Dirección | **Av. José Manuel Balmaceda 921, Loncoche** (al lado del terminal) |
| WhatsApp | **+56 9 7751 2219** (comercial) |
| Sábado | cierran a las **15:00** |

⚠️ **Se mudaron.** Pedro Montt 541 y Aníbal Pinto 381 ya no se usan. El
Facebook del gimnasio sigue mostrando Pedro Montt 541: conviene que el cliente
lo corrija, o Google va a seguir mandando gente a la dirección vieja.

## Decisiones que conviene revisar con el cliente

1. **La marca real es negro + amarillo**, no dorado, y el logo lleva azul.
   El sitio usa dorado con verde de acento, por decisión de diseño.
2. **Fotos y video en alta.** Ver la nota de @johnfilms.cl más arriba.
3. **Boxeo se quitó** de los servicios. Confirmar que efectivamente ya no lo
   hacen.
4. Hay un **precio publicado** ($30.000, plan básico) que todavía no tiene
   sección en el sitio.
5. **Instagram confirmado:** @fitnessthetemple. Faltan Facebook y TikTok.

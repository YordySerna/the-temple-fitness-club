# Dónde quedó esto — 13 de agosto de 2026

Traspaso para retomar desde otra sesión o desde otro equipo.

## Resumen en una línea

**Cobrando en sandbox, de punta a punta.** Un socio paga con tarjeta y su fecha
de vencimiento se mueve sola. Falta pasar a producción, que es otra cuenta.

## Prueba que ya se hizo, completa

El 13 de agosto se pagó la orden `PS-BE650649` ($45.000, Matías Curihual) con
tarjeta de prueba. Resultado: vencía el 16 de agosto y quedó al 16 de
septiembre, sin que nadie tocara la planilla.

Recorrido verificado:

```
portal → backend → Flow → cobro con tarjeta
                            ↓
              aviso a urlConfirmation
                            ↓
        4 pasos de validación → fecha movida
                            ↓
            el socio ve "Pago confirmado"
```

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

## Lo que se hizo el 13 de agosto · Flow conectado en el código

El backend vive en el repo privado **`github.com/YordySerna/portal-socios`**
(Google Apps Script + planilla). Se clona con `git clone`; no está en el disco.

> También existe `github.com/YordySerna/laboratorio-pagos`, con un servidor
> FastAPI. **No sirve para este proyecto:** esta máquina no tiene Python, y
> GitHub Pages solo sirve archivos estáticos, así que el backend tiene que
> vivir en la nube igual. Apps Script cubre eso sin instalar nada.

Se reemplazó el adaptador genérico de pasarela —que era un esqueleto
inventado— por **`Flow.gs`**, escrito contra la API real. Había cuatro cosas
que habrían impedido cobrar:

| # | Qué pasaba | Consecuencia |
|---|---|---|
| 1 | Ninguna petición iba firmada | Flow responde `invalid signature` |
| 2 | Se confundía nuestro `commerceOrder` con el `token` de Flow | no se podía consultar el estado |
| 3 | Se validaba una firma HMAC del aviso | **todos** los pagos legítimos rechazados |
| 4 | `urlReturn` devolvía JSON crudo | el socio veía un error justo tras pagar |

El punto 3 es el más importante y es contraintuitivo: **Flow no firma sus
avisos.** Manda un POST con un token y nada más. La protección real es el paso
3 de los cuatro —preguntarle a Flow si ese pago existe—.

Regla corta, que no cambia con ninguna pasarela:
**no le creas al aviso, pregúntale a la pasarela.**

El frontend también quedó completo: antes el socio salía a pagar y al volver
caía en el buscador vacío. Ahora hay pantalla de resultado, y el portal
reintenta unas veces porque el aviso de Flow y la vuelta del socio son caminos
independientes, sin orden garantizado.

### Lo que ya está montado

- Planilla creada por el instalador, con `Socios`, `Pagos` y `Bitacora`
- Backend desplegado como aplicación web, con acceso para cualquier usuario
- Credenciales de Flow **sandbox** en Propiedades del script
- `API_BASE` del portal apuntando al `/exec`
- Modo real activado (contra sandbox)

### Tres cosas que costaron encontrar

**1. El cuerpo del POST hay que armarlo a mano.** Pasarle el objeto a
`UrlFetchApp` y dejar que lo codifique da `Invalid Signature`: los bytes que
viajan no son los que se firmaron. Engaña porque `getStatus` manda solo ASCII
y funciona igual; falla únicamente al crear la orden, que es donde va el
nombre del plan con tildes.

**2. `ScriptApp.getService().getUrl()` devuelve `/dev` desde el editor** y
`/exec` solo cuando atiende una petición web. La de `/dev` exige sesión de
Google, así que Flow nunca habría podido avisar de un pago — y sin dar error:
la orden se crea, el socio paga, la fecha no se mueve. Ahora la URL buena se
anota sola en la primera visita real.

**3. Una implementación queda congelada en su versión.** Guardar en el editor
no cambia lo que responde el `/exec`. Cada vez que se toque el código hay que
hacer `Implementar → Administrar implementaciones → ✏️ → Nueva versión`. Es de
los que hacen perder una hora preguntándose por qué un arreglo no surte efecto.

### Para cobrar plata de verdad

⚠️ **Producción es otra cuenta de Flow**, con claves distintas, registrada
aparte en `www.flow.cl`. Las de sandbox no sirven allá.

1. Registrarse en www.flow.cl y conseguir las credenciales de producción
2. Cambiar `FLOW_API_KEY`, `FLOW_SECRET_KEY` y poner
   `FLOW_BASE = https://www.flow.cl/api` en Propiedades del script
3. Ejecutar `probarFlow` para confirmar el ambiente
4. Ejecutar `activarCobroReal`
5. **Limpiar los datos de prueba** antes de cargar socios reales: los tres
   socios de ejemplo (S001–S003) y las órdenes `PS-`/`TEST-` de la hoja Pagos

Si algo sale mal con un cobro real, `volverAModoDemo` lo apaga al instante.

### Sobre las credenciales de Flow

- Están en la cuenta de Flow, no en ningún archivo de estos repos. **No hacen
  falta acá**: van en Propiedades del script de Apps Script.
- ⚠️ **Verificar si son de `sandbox.flow.cl` o de `www.flow.cl`.** Son cuentas
  separadas con claves distintas. Usar las de producción contra la URL de
  sandbox da `Invalid ApiKey`, y cuesta encontrarlo porque parece un problema
  de firma.
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

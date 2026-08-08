# Dónde quedó esto — 8 de agosto de 2026

Traspaso para retomar desde otra sesión o desde otro equipo.
Última actualización: publicación completada.

## Resumen en una línea

**Publicado.** El sitio está en vivo y el portafolio ya enlaza a él.

## Dónde está

- Sitio: https://yordyserna.github.io/the-temple-fitness-club/
- Repo: https://github.com/YordySerna/the-temple-fitness-club
- Portafolio con la ficha 07: https://yordyserna.github.io/

Ambos verificados con código 200, imágenes incluidas.

## Estado de los repos

| Repo | Rama | Estado |
|---|---|---|
| `the-temple-fitness-club` | `main` | publicado, Pages activo (`build_type=legacy`) |
| `portafolio` | `master` | al día con origin |

Nota: el portafolio tenía dos commits hechos desde otro equipo. Se integraron
con rebase antes de subir la ficha, sin conflictos. Si se retoma desde otra
máquina, hacer `git fetch` antes de dar por bueno el estado local.

## Lo que sigue

Nada bloqueante. Pendientes reales, en orden de impacto:

1. Pedir las fotos en alta al cliente (ver punto 2 más abajo).
2. Resolver las dudas de contenido de la lista siguiente.
3. Poner la clave de Google Maps cuando el cliente la entregue.

## Qué se hizo

Sitio de una sola página, sin build, todo en `index.html`.

- **Tipografía:** Archivo 900 + Instrument Serif itálica + JetBrains Mono
- **Fondo por capas:** aurora, retícula, suelo en perspectiva, constelación en
  canvas, ruido generativo y viñeta
- **Lenis** para el scroll, **GSAP + ScrollTrigger** para el revelado por palabra
  y por letra con máscara `clip-path`
- **Cursor dorado magnético** en escritorio
- **Horario abierto/cerrado** calculado en vivo con hora de Chile
- **Formulario** que arma el mensaje y abre WhatsApp, sin servidor
- **Contenedor de Google Maps** listo, con estilo Dark/Gold (falta la clave)
- **Accesibilidad:** ninguna etiqueta baja de 12px
- **Rendimiento:** en móvil se apagan las mezclas y los repintados caros

Los detalles de cómo editar cada cosa están en [LEEME.md](LEEME.md).

## Decisiones que conviene revisar con el cliente

1. **La marca real es negro + amarillo**, no dorado, y el logo lleva azul.
   El sitio usa dorado por decisión de diseño.
2. **Las fotos son de 680px** de ancho y en la portada se estiran al doble.
   Se ven blandas. Hay que pedir los originales.
3. **Boxeo se quitó** de los servicios. Confirmar que efectivamente ya no lo hacen.
4. **Dos direcciones** en circulación: Pedro Montt 541 y Aníbal Pinto 381.
5. Hay un **precio publicado** ($30.000, plan básico) que todavía no tiene
   sección en el sitio.

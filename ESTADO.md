# Dónde quedó esto — 8 de agosto de 2026

Traspaso para retomar desde otra sesión o desde otro equipo.

## Resumen en una línea

El sitio está **terminado y committeado**, pero **nada está publicado**.
Falta un solo paso manual: `gh auth login`.

## Lo que falta, en este orden exacto

```bash
# 1. Autenticarse (interactivo — hay que correrlo a mano)
gh auth login --web --git-protocol https
```

```bash
# 2. Crear el repo y publicar
cd "C:\Users\yordi\OneDrive\Escritorio\devs\the-temple-fitness-club"
gh repo create the-temple-fitness-club --public --source=. --remote=origin --push
```

```bash
# 3. Activar GitHub Pages desde la rama main
gh api -X POST repos/YordySerna/the-temple-fitness-club/pages -f "source[branch]=main" -f "source[path]=/"
```

```bash
# 4. Recién ahora, subir el portafolio
cd "C:\Users\yordi\OneDrive\Escritorio\devs\portafolio"
git push origin master
```

**El orden importa.** El portafolio ya tiene un commit local con la ficha 07,
que enlaza a `yordyserna.github.io/the-temple-fitness-club/`. Si se sube antes
de que el repo exista, el sitio público queda con dos enlaces rotos.

## Estado de los repos

| Repo | Rama | Commits pendientes | Remoto |
|---|---|---|---|
| `the-temple-fitness-club` | `main` | 3, sin publicar | **no existe todavía** |
| `portafolio` | `master` | 1 por delante de origin | `YordySerna/YordySerna.github.io` |

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

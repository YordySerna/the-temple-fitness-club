/* Todo el JS de The Temple. Vivia dentro del index.html; se movio a
   este archivo el 30-08-2026 para poder declarar una CSP con
   script-src 'self', que bloquea todo script en linea. Va con defer
   al final, igual que antes: el comportamiento no cambia. */
/* ══════════════════════════════════════════════════════════════════════════
   Todo el JS del sitio. Sin dependencias.

   Nada de esto es necesario para leer la página: si este bloque no corre,
   el temporizador de abajo quita html.js y el contenido queda visible y
   navegable. Los enlaces de WhatsApp de los planes ya van escritos en el
   HTML con su mensaje, así que también funcionan solos.
   ══════════════════════════════════════════════════════════════════════════ */
(function(){
  'use strict';

  var $  = function(s, r){ return (r||document).querySelector(s); };
  var $$ = function(s, r){ return Array.prototype.slice.call((r||document).querySelectorAll(s)); };

  var quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var WHATSAPP = '56977512219';

  /* Seguro: si algo de acá abajo revienta, la página igual se ve completa. */
  var seguro = setTimeout(function(){
    document.documentElement.classList.remove('js');
  }, 2500);

  /* ── A · BARRA QUE SE POSA ──────────────────────────────────────────────
     Un solo listener de scroll, pasivo y limitado a un fotograma. No lee
     posiciones de elementos: solo window.scrollY, que es barato.          */
  var barra = $('#barra');
  var pendiente = false;
  function alScroll(){
    if(pendiente) return;
    pendiente = true;
    requestAnimationFrame(function(){
      barra.classList.toggle('posada', window.scrollY > 24);
      pendiente = false;
    });
  }
  window.addEventListener('scroll', alScroll, {passive:true});
  alScroll();

  /* ── B · MENÚ MÓVIL ─────────────────────────────────────────────────── */
  var abrir = $('#abrir');
  var panel = $('#panel');

  function cerrarPanel(){
    panel.classList.remove('abierto');
    abrir.setAttribute('aria-expanded','false');
    abrir.setAttribute('aria-label','Abrir menú');
    document.body.classList.remove('trabado');
  }
  abrir.addEventListener('click', function(){
    var abierto = panel.classList.toggle('abierto');
    abrir.setAttribute('aria-expanded', String(abierto));
    abrir.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
    document.body.classList.toggle('trabado', abierto);
  });
  $$('#panel a').forEach(function(a){ a.addEventListener('click', cerrarPanel); });

  /* ── C · ENLACE ACTIVO EN EL MENÚ ───────────────────────────────────── */
  var enlaces = $$('#menu a');
  var vistas = enlaces.map(function(a){ return $(a.getAttribute('href')); }).filter(Boolean);
  if('IntersectionObserver' in window && vistas.length){
    var obsMenu = new IntersectionObserver(function(entradas){
      entradas.forEach(function(e){
        if(!e.isIntersecting) return;
        enlaces.forEach(function(a){
          a.setAttribute('aria-current', a.getAttribute('href') === '#' + e.target.id ? 'true' : 'false');
        });
      });
    }, {rootMargin:'-45% 0px -50% 0px'});
    vistas.forEach(function(v){ obsMenu.observe(v); });
  }

  /* ── D · ENTRADA AL SCROLL ──────────────────────────────────────────────
     Doce líneas en vez de una librería de scroll. Cada elemento se observa
     una sola vez y después se deja de observar.                          */
  var suben = $$('.sube');
  if('IntersectionObserver' in window && !quieto){
    var obsSube = new IntersectionObserver(function(entradas, obs){
      entradas.forEach(function(e){
        if(!e.isIntersecting) return;
        e.target.classList.add('dentro');
        obs.unobserve(e.target);
      });
    }, {rootMargin:'0px 0px -8% 0px', threshold:.08});
    suben.forEach(function(el){ obsSube.observe(el); });
  }else{
    suben.forEach(function(el){ el.classList.add('dentro'); });
  }

  /* ── D2 · CONGELAR LO QUE NO SE VE ──────────────────────────────────────
     Fuera de pantalla no hay nada que animar. Se observa la SECCIÓN y nunca
     la capa: el telón lleva mask-image y las capas de fondo van dentro de
     contenedores recortados, y un elemento enmascarado o recortado no
     dispara jamás al IntersectionObserver — se queda colgado en "no visible"
     para siempre.                                                         */
  if('IntersectionObserver' in window){
    var obsQuieta = new IntersectionObserver(function(es){
      es.forEach(function(e){ e.target.classList.toggle('quieta', !e.isIntersecting); });
    }, {rootMargin:'15% 0px'});
    $$('.portada, .bloque').forEach(function(s){ obsQuieta.observe(s); });
  }

  /* ── D3 · TILT 3D EN LOS PLANES ─────────────────────────────────────────
     La tarjeta se inclina siguiendo al cursor. Solo con mouse fino: en
     táctil no hay hover y el efecto solo estorbaría.

     El centro se mide UNA vez, al entrar. La receta original lo leía en cada
     pointermove con getBoundingClientRect, y eso obliga al navegador a
     resolver el layout pendiente antes de contestar — con un mouse moderno
     son más de cien veces por segundo, sobre el mismo elemento que se está
     transformando. Es leer justo después de escribir.                     */
  if(window.matchMedia('(hover:hover) and (pointer:fine)').matches && !quieto){
    $$('.plan').forEach(function(el){
      var MAX = 4, cx = 0, cy = 0, an = 0;
      el.addEventListener('pointerenter', function(){
        var r = el.getBoundingClientRect();
        cx = r.left + r.width / 2;
        cy = r.top  + r.height / 2;
      });
      el.addEventListener('pointermove', function(e){
        if(an) return;                       // como mucho una vez por fotograma
        var px = e.clientX, py = e.clientY;
        an = requestAnimationFrame(function(){
          an = 0;
          var rx = ((py - cy) / el.offsetHeight) * -2 * MAX;
          var ry = ((px - cx) / el.offsetWidth)  *  2 * MAX;
          el.style.transform = 'rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
        });
      }, {passive:true});
      el.addEventListener('pointerleave', function(){
        if(an){ cancelAnimationFrame(an); an = 0; }
        el.style.transform = '';
      });
    });
  }

  /* ── E · ABIERTO O CERRADO, CON LA HORA DE CHILE ────────────────────────
     El horario del gimnasio no depende del reloj del visitante: alguien que
     abre la página desde España tiene que ver si está abierto ACÁ. Por eso
     la hora se pide en la zona de Santiago en vez de usar la local.       */
  var HORARIO = {1:[9,23], 2:[9,23], 3:[9,23], 4:[9,23], 5:[9,23], 6:[9,15], 0:null};
  var NOMBRE_DIA = ['domingo','lunes','martes','miércoles','jueves','viernes','sábado'];

  function ahoraEnChile(){
    try{
      var f = new Intl.DateTimeFormat('es-CL', {
        timeZone:'America/Santiago', weekday:'short', hour:'2-digit', minute:'2-digit', hour12:false
      }).formatToParts(new Date());
      var o = {};
      f.forEach(function(p){ o[p.type] = p.value; });
      var mapa = {dom:0, lun:1, mar:2, mié:3, mie:3, jue:4, vie:5, sáb:6, sab:6};
      var clave = (o.weekday || '').toLowerCase().replace('.','').slice(0,3);
      var d = mapa[clave];
      if(d === undefined) throw new Error('día');
      return { dia:d, min: parseInt(o.hour,10) * 60 + parseInt(o.minute,10) };
    }catch(e){
      var n = new Date();
      return { dia:n.getDay(), min:n.getHours() * 60 + n.getMinutes() };
    }
  }

  function dosDigitos(n){ return (n < 10 ? '0' : '') + n; }

  function pintarEstado(){
    var t = ahoraEnChile();
    var hoy = HORARIO[t.dia];
    var caja = $('#estado');
    var txt  = $('#estado-txt');
    if(!caja || !txt) return;

    var abiertoAhora = !!hoy && t.min >= hoy[0]*60 && t.min < hoy[1]*60;
    caja.setAttribute('data-abierto', abiertoAhora ? 'si' : 'no');

    if(abiertoAhora){
      txt.textContent = 'Abierto ahora · cierra ' + dosDigitos(hoy[1]) + ':00';
    }else{
      // Busca el próximo día con horario, empezando por hoy si aún no abre
      var salto = (hoy && t.min < hoy[0]*60) ? 0 : 1;
      for(var i = salto; i <= 7; i++){
        var d = (t.dia + i) % 7;
        var h = HORARIO[d];
        if(!h) continue;
        txt.textContent = i === 0
          ? 'Cerrado · abre hoy ' + dosDigitos(h[0]) + ':00'
          : 'Cerrado · abre ' + NOMBRE_DIA[d] + ' ' + dosDigitos(h[0]) + ':00';
        break;
      }
    }

    // Marca el día de hoy en la tabla de horarios
    $$('#dias li').forEach(function(li){
      li.classList.toggle('hoy', parseInt(li.getAttribute('data-dia'), 10) === t.dia);
    });
  }
  pintarEstado();
  setInterval(pintarEstado, 60000);

  /* ── F · TOUR EN VIDEO, BAJO DEMANDA ────────────────────────────────────
     Son 13 MB. No se tocan hasta que alguien pulsa play.                  */
  var tour = $('#tour');
  var tourPlay = $('#tour-play');
  var tourTapa = $('#tour-tapa');
  if(tour && tourPlay){
    tourPlay.addEventListener('click', function(){
      tour.src = 'imagenes/tour-gimnasio.mp4';
      tour.classList.remove('oculto-visual');
      tourTapa.hidden = true;
      tourPlay.hidden = true;
      tour.play().catch(function(){ /* si el navegador lo bloquea, quedan los controles */ });
    });
  }

  /* ── G · VISOR DE FOTOS ─────────────────────────────────────────────── */
  var visor = $('#visor');
  var visorImg = $('#visor-img');
  var visorPie = $('#visor-pie');
  var ultimoBoton = null;

  function abrirVisor(boton){
    ultimoBoton = boton;
    visorImg.src = boton.getAttribute('data-foto');
    visorImg.alt = boton.querySelector('img').alt;
    visorPie.textContent = boton.getAttribute('data-pie') || '';
    visor.classList.add('abierto');
    document.body.classList.add('trabado');
    $('#visor-cerrar').focus();
  }
  function cerrarVisor(){
    visor.classList.remove('abierto');
    document.body.classList.remove('trabado');
    if(ultimoBoton) ultimoBoton.focus();
  }
  $$('.galeria button').forEach(function(b){
    b.addEventListener('click', function(){ abrirVisor(b); });
  });
  $('#visor-cerrar').addEventListener('click', cerrarVisor);
  visor.addEventListener('click', function(e){ if(e.target === visor) cerrarVisor(); });

  document.addEventListener('keydown', function(e){
    if(e.key !== 'Escape') return;
    if(visor.classList.contains('abierto')) cerrarVisor();
    else if(panel.classList.contains('abierto')) cerrarPanel();
  });

  /* ── H · FORMULARIO → WHATSAPP ──────────────────────────────────────── */
  var form = $('#formulario');
  if(form){
    /* El error aparece bajo su propio campo y dice qué hacer, no solo qué
       está mal. El foco se va al primero que falla. */
    function marcar(id, texto){
      var campo = $('#campo-' + id);
      var error = $('#err-' + id);
      if(texto){ campo.setAttribute('data-mal',''); error.textContent = texto; }
      else     { campo.removeAttribute('data-mal');  error.textContent = ''; }
      $('#' + id).setAttribute('aria-invalid', texto ? 'true' : 'false');
      return !texto;
    }
    // Al corregir, el error se va solo
    ['nombre','telefono'].forEach(function(id){
      $('#' + id).addEventListener('input', function(){
        if(this.value.trim()) marcar(id, '');
      });
    });

    form.addEventListener('submit', function(e){
      e.preventDefault();
      var nombre   = $('#nombre').value.trim();
      var telefono = $('#telefono').value.trim();
      var objetivo = $('#objetivo').value;
      var mensaje  = $('#mensaje').value.trim();

      var okNombre = marcar('nombre',   nombre   ? '' : 'Escribe tu nombre para poder saludarte.');
      var okFono   = marcar('telefono', telefono ? '' : 'Escribe tu teléfono: es por donde te respondemos.');
      if(!okNombre || !okFono){
        $(okNombre ? '#telefono' : '#nombre').focus();
        return;
      }

      var texto =
        '¡Hola The Temple! 👋\n\n' +
        'Nombre: ' + nombre + '\n' +
        'Teléfono: ' + telefono + '\n' +
        'Objetivo: ' + objetivo +
        (mensaje ? '\nMensaje: ' + mensaje : '') +
        '\n\nMe gustaría agendar una clase.';

      window.open('https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(texto), '_blank', 'noopener');
    });
  }

  /* ── I · AÑO DEL PIE ────────────────────────────────────────────────── */
  var anio = $('#anio');
  if(anio) anio.textContent = new Date().getFullYear();

  /* Todo salió bien: se cancela el seguro y quedan las animaciones. */
  clearTimeout(seguro);
  document.documentElement.classList.add('listo');
})();

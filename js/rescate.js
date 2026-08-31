/* Marca que el JS esta vivo: los estados ocultos previos a animar
   cuelgan de .js. Va SIN defer y arriba del todo para que no haya
   parpadeo. Estaba en linea; se movio por la CSP (30-08-2026). */
document.documentElement.classList.add('js');

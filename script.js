/* script.js — script mínimo para evitar errores y dibujar en el canvas */

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('tulipCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  function resizeCanvas() {
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(rect.height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw();
  }

  function draw() {
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);
    ctx.clearRect(0, 0, w, h);

    // Fondo suave
    ctx.fillStyle = '#fff9fb';
    ctx.fillRect(0, 0, w, h);

    // Coordenadas base
    const cx = w / 2;
    const cy = h / 2 + 40;

    // Tallo
    ctx.fillStyle = '#2b8a3e';
    ctx.fillRect(cx - 6, cy, 12, 120);

    // Hoja
    ctx.beginPath();
    ctx.ellipse(cx - 30, cy + 80, 20, 40, -0.6, 0, Math.PI * 2);
    ctx.fill();

    // Pétalos - forma simple
    ctx.fillStyle = '#ff7fb3';
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.bezierCurveTo(cx + 60, cy - 60, cx + 20, cy - 140, cx, cy - 80);
    ctx.bezierCurveTo(cx - 20, cy - 140, cx - 60, cy - 60, cx, cy);
    ctx.fill();

    // Centro claro
    ctx.fillStyle = '#fff1f8';
    ctx.beginPath();
    ctx.arc(cx, cy - 30, 12, 0, Math.PI * 2);
    ctx.fill();

    // Texto de verificación
    ctx.fillStyle = '#333';
    ctx.font = '16px system-ui, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Script funcionando', cx, h - 20);
  }

  window.addEventListener('resize', resizeCanvas);
  // pequeña espera para asegurar que estilos se apliquen
  setTimeout(resizeCanvas, 50);
});

/* --------- Nueva versión: 3 tulipanes con animación más natural --------- */
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('tulipCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  function fitCanvas() {
    const rect = canvas.getBoundingClientRect();
    const ratio = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * ratio);
    canvas.height = Math.round(rect.height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  // Parámetros de las flores: ubicamos los brotes cerca uno del otro
  // y añadimos un control 'cpX' para curvar los tallos hacia el centro.
  const tulips = [
    { xPct: 0.45, stemH: 120, color: '#ff7fb3', offset: 0, cpX: 18 }, // izquierda curva a la derecha
    { xPct: 0.5, stemH: 140, color: '#ffb3e0', offset: 0.6, cpX: 0 },  // centro recto
    { xPct: 0.55, stemH: 110, color: '#ff4f9a', offset: 1.2, cpX: -18 } // derecha curva a la izquierda
  ];

  let lastTime = 0;

  // drawTulip ahora dibuja solo la cabeza (pétalos) en la posición dada.
  // Los tallos se dibujan después para asegurar que terminen en un punto común.
  function drawTulip(headX, headY, stemH, color, t) {
    const sway = Math.sin(t * 1.5) * 6 + Math.sin(t * 2.7) * 2; // balanceo suave
    const bloom = 1 + 0.03 * Math.sin(t * 3 + headX);
    const bloomH = Math.min(60, Math.round(stemH * 0.45));

    ctx.save();
    ctx.translate(headX, headY);
    ctx.rotate((sway * Math.PI) / 180);
    ctx.scale(bloom, bloom);

    // pétalos principales (3 piezas) — ahora anclados alrededor de (0,0)
    ctx.fillStyle = color;

    // pétalo central (más puntiagudo para parecer tulipán)
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(bloomH * 0.36, -bloomH * 0.12, bloomH * 0.36, -bloomH * 0.9, 0, -bloomH);
    ctx.bezierCurveTo(-bloomH * 0.36, -bloomH * 0.9, -bloomH * 0.36, -bloomH * 0.12, 0, 0);
    ctx.fill();

    // pétalo izquierdo
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-bloomH * 0.6, -bloomH * 0.04, -bloomH * 0.8, -bloomH * 0.7, -bloomH * 0.24, -bloomH * 0.86);
    ctx.bezierCurveTo(-bloomH * 0.12, -bloomH * 0.4, -bloomH * 0.06, -bloomH * 0.2, 0, 0);
    ctx.fill();

    // pétalo derecho
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(bloomH * 0.6, -bloomH * 0.04, bloomH * 0.8, -bloomH * 0.7, bloomH * 0.24, -bloomH * 0.86);
    ctx.bezierCurveTo(bloomH * 0.12, -bloomH * 0.4, bloomH * 0.06, -bloomH * 0.2, 0, 0);
    ctx.fill();

    // detalle central
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.beginPath();
    ctx.ellipse(0, -bloomH * 0.6, bloomH * 0.12, bloomH * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function render(timeMs) {
    const dt = (timeMs - lastTime) / 1000 || 0;
    lastTime = timeMs;
    fitCanvas();
    const w = canvas.width / (window.devicePixelRatio || 1);
    const h = canvas.height / (window.devicePixelRatio || 1);

    // fondo
    ctx.clearRect(0, 0, w, h);
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#fff6fb');
    grad.addColorStop(0.5, '#fff1f7');
    grad.addColorStop(1, '#fff');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    const t = timeMs / 1000;

    // calcular posiciones base
    const centerX = Math.round(w * 0.5);
    const bouquetBaseY = Math.round(h * 0.7);
    const maxStem = Math.max(...tulips.map(tp => tp.stemH));

    // dimensiones del florero (relativas al canvas)
    const vaseWidth = Math.min(200, Math.round(w * 0.24));
    const vaseHeight = Math.min(200, Math.round(h * 0.28));
    // colocamos la parte superior del florero bajo la base del ramo,
    // y permitimos que los tallos entren hasta la mitad del florero
    let vaseTopY = bouquetBaseY + maxStem - Math.round(vaseHeight * 0.6);
    let vaseBottomY = vaseTopY + vaseHeight;
    // Asegurarnos de que el florero quepa dentro del canvas (no se salga por abajo)
    if (vaseBottomY > h - 12) {
      vaseBottomY = h - 12;
      vaseTopY = vaseBottomY - vaseHeight;
    }
    const stemEndpointY = Math.round(vaseTopY + vaseHeight * 0.5); // mitad del florero

    // dibujar tallos: desde la cabeza de cada flor hasta (centerX, stemEndpointY)
    ctx.strokeStyle = '#2b8a3e';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    tulips.forEach((tp) => {
      const headX = Math.round(w * tp.xPct);
      const headY = bouquetBaseY - tp.stemH; // cabeza por encima de la base
      const cpX = headX + tp.cpX; // control point para curvar hacia el centro
      const midY = headY + Math.max(20, (stemEndpointY - headY) * 0.45);

      ctx.beginPath();
      ctx.moveTo(headX, headY);
      ctx.quadraticCurveTo(cpX, midY, centerX, stemEndpointY);
      ctx.stroke();
    });

    // Dibujar el florero: color sólido azul, apertura ancha arriba, base delgada.
    ctx.save();
    
    // Forma del florero: abertura ancha arriba, cuerpo redondeado, base muy delgada
    const vasePath = new Path2D();
    // inicio en base izquierda (delgada)
    vasePath.moveTo(centerX - 8, vaseBottomY);
    // curva izquierda hacia arriba (amplía el cuerpo)
    vasePath.quadraticCurveTo(centerX - vaseWidth * 0.5, vaseBottomY - vaseHeight * 0.5, centerX - vaseWidth * 0.52, vaseTopY);
    // línea superior izquierda de la apertura
    vasePath.lineTo(centerX - vaseWidth * 0.48, vaseTopY - 8);
    // línea superior derecha de la apertura
    vasePath.lineTo(centerX + vaseWidth * 0.48, vaseTopY - 8);
    // curva derecha hacia abajo (amplía el cuerpo)
    vasePath.quadraticCurveTo(centerX + vaseWidth * 0.5, vaseBottomY - vaseHeight * 0.5, centerX + 8, vaseBottomY);
    // cierra en la base (delgada)
    vasePath.closePath();

    // sombra bajo el florero (más pequeña para la base delgada)
    ctx.fillStyle = 'rgba(20,30,60,0.15)';
    ctx.beginPath();
    ctx.ellipse(centerX, vaseBottomY + 6, 20, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Relleno del florero: color azul sólido (no translúcido)
    ctx.fillStyle = '#5a8dd9';
    ctx.strokeStyle = '#3a5fa0';
    ctx.lineWidth = 2.5;
    ctx.fill(vasePath);
    ctx.stroke(vasePath);

    // Añadir agua dentro (línea horizontal que indica el nivel del agua)
    const waterLevel = Math.round(vaseTopY + vaseHeight * 0.55);
    ctx.strokeStyle = 'rgba(100,160,220,0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(centerX - vaseWidth * 0.4, waterLevel);
    ctx.lineTo(centerX + vaseWidth * 0.4, waterLevel);
    ctx.stroke();

    ctx.restore();

    // dibujar cabezas florales por encima del lazo (para que no queden cubiertas)
    tulips.forEach((tp) => {
      const headX = Math.round(w * tp.xPct);
      const headY = bouquetBaseY - tp.stemH;
      drawTulip(headX, headY, tp.stemH, tp.color, t + tp.offset);
    });

    requestAnimationFrame(render);
  }

  window.addEventListener('resize', fitCanvas);
  fitCanvas();
  requestAnimationFrame(render);
});

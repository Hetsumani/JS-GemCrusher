/* ================== TIMER 1 “also the ugly way” ================== */

// -------- estructura común a after / every / tween --------------
const timers = [];

/*---------- helpers de usuario ----------*/
function after(delay, cb) {
  timers.push({ kind:'after', time:delay, callback:cb, loop:false });
}

function every(interval, cb) {
  timers.push({ kind:'every', time:interval, callback:cb, loop:true, interval });
}

/*---------- tween (1 prop, easing lineal por defecto) ------------*/
const linear = t => t;          //  t ∈ [0,1] → t
function tween(duration, obj, prop, to, easing=linear, onFinish){
  timers.push({
    kind:'tween', obj, prop,
    from: obj[prop],
    to, time:duration, duration, easing,
    onFinish
  });
}

/*---------- bucle principal ----------*/
let last = performance.now();
function loop(now){
  const dt = (now - last)/1000;  // en segundos
  last = now;
  updateTimers(dt); // actualiza los temporizadores
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);

/*---------- motor de timers ----------*/
function updateTimers(dt){
  for (let i = timers.length-1; i>=0; i--){
    const t = timers[i];
    if (t.cancel) { timers.splice(i,1); continue; }

    t.time -= dt;

    if (t.kind === 'tween'){
      // progreso 0-1, clamp para no pasarnos
      const p = Math.max(0, 1 - t.time/t.duration);
      const eased = t.easing(p);
      t.obj[t.prop] = t.from + (t.to - t.from) * eased;
      console.log(`Tween ${t.prop}:`, t.obj[t.prop].toFixed(2));
    }

    if (t.time <= 0){
      if (t.kind === 'after' || t.kind === 'every') t.callback();
      if (t.kind === 'tween' && t.onFinish)        t.onFinish();

      if (t.kind === 'every')        t.time += t.interval; // recarga
      else                           timers.splice(i,1);   // elimina
    }
  }
}

/* ===================== DEMO EN CONSOLA ========================= */

// /* 1. after: quitar mensaje tras 1,5 s */
// console.log('[0.00] ¡Match!');
// after(1.5, ()=> console.log(`[${elapsed()}] Mensaje oculto`));

// /* 2. every: tic visual 4 veces por segundo */
// let blink = false;
// every(0.25, ()=>{
//   blink = !blink;
//   console.log(`[${elapsed()}] highlight ${blink? 'ON':'off'}`);
// });

// /* 3. tween: mover cuadrito en el eje X 0 → 96 px en 2 s */
const tile = { x:0, y:0 };
// tween(2, tile, 'x', 96, linear, ()=> console.log(`[${elapsed()}] tween x terminado`));

// /* 4. limitación: intento de animar X e Y *simultáneos* */
// console.log('— Limitación: dos tweens independientes (pueden desfasarse) —');
// tween(1.5, tile, 'x',  48, linear, ()=> console.log(`[${elapsed()}] X done`));
// tween(1.5, tile, 'y', 128, linear, ()=> console.log(`[${elapsed()}] Y done`));

function elapsed(){ return ((performance.now()-start)/1000).toFixed(2); }
const start = performance.now();

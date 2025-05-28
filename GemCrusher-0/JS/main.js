/*----------timer0 (“The Simple Way”)-----------*/

/* ---------- 1. Almacén de temporizadores activos ---------- */
const temporizadores = [];   // cada elemento: {time, callback, loop, interval}

/* ---------- 2. after: ejecutar 1 vez tras 'delay' s ---------- */
function after(delay, callback) {
    temporizadores.push({ time: delay, callback, loop: false });
}

/* ---------- 3. every: ejecutar en bucle cada 'interval' s ---- */
function every(interval, callback) {
    temporizadores.push({ time: interval, callback, loop: true, interval });
}

/* ---------- 4. actualizador: se llama en cada frame ---------- */
function updateTimers(dt) {
    for (let i = temporizadores.length - 1; i >= 0; i--) {
        const tiempoPasado = temporizadores[i];
        tiempoPasado.time -= dt;                 // ⬅️ restamos el tiempo pasado
        if (tiempoPasado.time <= 0) {
            tiempoPasado.callback();               // ⬅️ ¡se dispara!
            if (tiempoPasado.loop) {
                tiempoPasado.time += tiempoPasado.interval;     // rearmar para el siguiente ciclo
            } else {
                temporizadores.splice(i, 1);      // eliminar el after
            }
        }
    }
}
/* ---------- 5. Funciones de actualización y dibujo ---------- */
function update(dt) {
    // Actualizar el estado del juego
    
}


function draw() {
    // Dibujar el estado del juego
}
/* ---------- 6. Iniciar el bucle de juego -------------------- */
let tiempoInicial = 0;

function gameLoop(time) {
    if (tiempoInicial === 0) {
        tiempoInicial = time;
    }

    const deltaTime = time - tiempoInicial;
    tiempoInicial = time;

    updateTimers(deltaTime / 1000); // Convertir a segundos

    // Actualizar el juego
    update(deltaTime);

    // Dibujar el juego
    draw();

    // Solicitar el siguiente frame
    requestAnimationFrame(gameLoop);
}

after(2, ()=> console.log('Han pasado 2 s'));
every(1, ()=> console.log('tic…'));

// Iniciar el bucle de juego
requestAnimationFrame(gameLoop);
import { Gema } from "./gema.js";
const tablero = document.getElementById("tablero");

const FILAS = 8;
const COLUMNAS = 8;

let colores = ["gema--red", "gema--purple", "gema--yellow", "gema--blue", "gema--green", "gema--orange"];

let tableroLogico = [];
let seleccionada = null;

let combos = [];

do {
    for (let i = 0; i < FILAS; i++) {
        tableroLogico[i] = [];
        for (let j = 0; j < COLUMNAS; j++) {
            let color = Math.floor(Math.random() * colores.length);
            tableroLogico[i][j] = colores[color];
        }
    }
} while (buscarCombos().length > 0); // Asegurarse de que no haya combos al inicio

// Crear las gemas (DIV) y agregarlas al tablero
// Cada gema es un objeto Gema
// y se le asigna un evento de click para manejar la selección y el cambio
for (let i = 0; i < FILAS; i++) {
    for (let j = 0; j < COLUMNAS; j++) {
        let gema = new Gema(i, j, tableroLogico[i][j]);
        gema.elDiv.addEventListener('click', clickGema);
        tablero.appendChild(gema.elDiv);
    }
}

/**
 * Manejador principal de clic sobre una gema
 * ───────────────────────────────────────────
 *  Flujo general:
 *   1. Detecta si el clic fue sobre una gema ya seleccionada → des-selecciona.
 *   2. Si ya hay otra gema previamente seleccionada → intenta intercambiarlas,
 *      busca combos resultantes y los elimina si existen.
 *   3. Si no hay gema previa → marca la gema actual como seleccionada.
 *
 *  Globals usados:
 *    • `seleccionada` : HTMLElement | null
 *        Guarda la gema que el jugador tiene “en la mano”.
 *    • `combos`       : Array<[fila, col]>
 *        Coordenadas de gemas que forman parte de un match.
 *    • `cambiarGemas(a, b)` : Función que intercambia lógicamente dos gemas.
 *    • `buscarCombos()`     : Devuelve un arreglo de coordenadas de matches.
 *    • `borrarCombos()`     : Marca en la lógica y refresca el DOM.
 */
function clickGema(event) {
  const gema = event.target; // Nodo HTML sobre el que se hizo clic

  /*────────────────────────────────────────────────────────────
   * 1. Caso: el jugador hace clic en la misma gema por segunda vez
   *    → se cancela la selección.
   *───────────────────────────────────────────────────────────*/
  if (gema.classList.contains("seleccionada")) {
    gema.classList.remove("seleccionada");
    seleccionada = null;          // Nada está seleccionado

  /*────────────────────────────────────────────────────────────
   * 2. Caso: ya hay una gema seleccionada distinta
   *    → intentamos intercambiar y resolver el turno.
   *───────────────────────────────────────────────────────────*/
  } else if (seleccionada) {
    // ❶ Intercambio de posiciones (en DOM y en matriz lógica)
    cambiarGemas(seleccionada, gema);

    // ❷ Detección de combos tras el intercambio
    combos = buscarCombos();

    // ❸ Si hubo matches, procede a borrarlos
    if (combos.length > 0) {
      console.log("Se borrarán combos");
      borrarCombos();
    }

    // ❹ Limpieza de estado de selección tras efectuar la jugada
    seleccionada.classList.remove("seleccionada");
    seleccionada = null;

  /*────────────────────────────────────────────────────────────
   * 3. Caso: no había gema previa seleccionada
   *    → marcamos la actual para un posible intercambio posterior.
   *───────────────────────────────────────────────────────────*/
  } else {
    gema.classList.add("seleccionada");
    seleccionada = gema;
  }
}


/**
 * Intercambia los **colores** de dos gemas (visual + lógica)
 * ───────────────────────────────────────────────────────────
 *  ↳ No mueve los nodos en el DOM ni cambia sus coordenadas,
 *    solo “pinta” cada gema con el color de la otra y actualiza
 *    la matriz `tableroLogico` para que ambas fuentes de verdad
 *    permanezcan sincronizadas.
 *
 *  Parámetros:
 *    @param {HTMLElement} gema1 – Primer nodo .gema seleccionado
 *    @param {HTMLElement} gema2 – Segundo nodo .gema seleccionado
 *
 *  Flujo:
 *    1. Leer fila, columna y color actuales de ambas gemas (data-*).
 *    2. Hacer swap de clases CSS de color con `classList.replace`.
 *    3. Actualizar `data-color` de cada gema.
 *    4. Reflejar el cambio en la matriz lógica (`tableroLogico`).
 *
 *  Importante:
 *   • Elegimos **“swap de colores”** en vez de mover nodos porque
 *     el grid CSS posiciona cada gema según data-fila/columna;
 *     así evitamos reflows y mantenemos la cuadrícula estable.
 */
function cambiarGemas(gema1, gema2) {

  /*───────────────────────────────────
   * 1. Extraer posiciones y colores
   *───────────────────────────────────*/
  const fila1  = gema1.dataset.fila;       // Índice de fila (string → OK para acceso)
  const col1   = gema1.dataset.columna;    // Índice de columna
  const color1 = gema1.dataset.color;      // Clase CSS de color actual

  const fila2  = gema2.dataset.fila;
  const col2   = gema2.dataset.columna;
  const color2 = gema2.dataset.color;

  /*───────────────────────────────────
   * 2. Intercambiar colores en el DOM
   *───────────────────────────────────*/
  //   gema1 toma el color de gema2
  gema1.classList.replace(color1, color2); // quita color1 y pone color2 en un solo paso
  gema1.dataset.color = color2;            // actualiza atributo data-color

  //   gema2 toma el color de gema1
  gema2.classList.replace(color2, color1);
  gema2.dataset.color = color1;

  /*───────────────────────────────────
   * 3. Sincronizar la matriz lógica
   *───────────────────────────────────*/
  tableroLogico[fila1][col1] = color2;     // Posición (fila1,col1) ahora es color2
  tableroLogico[fila2][col2] = color1;     // Posición (fila2,col2) ahora es color1
}


function buscarCombos() {
    let combos = []; // Almacena todos los combos encontrados

    // Búsqueda de combos horizontales
    busquedaHorizontal(combos);

    // Búsqueda de combos verticales
    busquedaVertical(combos);

    // Eliminar duplicados: convertimos a JSON para comparar y luego de vuelta a objeto
    // Esto asegura que cada combo sea único en el arreglo final   
    // Más eficiente que dejar los duplicados, aunque estos no afecten la lógica del juego.
    const unicos = [...new Set(combos.map(JSON.stringify))].map(JSON.parse);
    return unicos;
}

function busquedaVertical(combos) {
    // Iteramos por cada COLUMNA primero
    for (let j = 0; j < COLUMNAS; j++) {
        // Inicializamos la referencia y la longitud de la cadena para la COLUMNA actual
        let referencia = null;
        let cadena = 0;

        // Luego, iteramos por cada FILA dentro de la columna actual (de arriba hacia abajo)
        for (let i = 0; i < FILAS; i++) {
            if (i == 0) {
                // Es el primer elemento de la columna actual (fila superior)
                referencia = tableroLogico[i][j];
                cadena = 1;
                // console.log(`Columna ${j}: Referencia inicial: ${referencia} en [${i},${j}]`);
            } else {
                // Elementos subsiguientes en la columna actual
                if (tableroLogico[i][j] == referencia) {
                    // El elemento actual coincide con el de arriba, la cadena vertical aumenta
                    cadena++;
                    // console.log(`Cadena V incrementada: ${cadena} en [${i},${j}]`);
                } else {
                    // El elemento no coincide, la cadena vertical se rompió.
                    // Verificamos si la cadena que acaba de terminar era un combo.
                    if (cadena >= 3) {
                        // console.log(`Combo V (por cambio) detectado en columna ${j}, terminando en fila ${i-1}. Longitud: ${cadena}`);
                        for (let k = 0; k < cadena; k++) {
                            // La cadena terminó en la fila i-1.
                            // Los elementos son [i-1, j], [i-2, j], ..., [(i-1)-(cadena-1), j]
                            const elemento = [(i - 1) - k, j]; // (filaAnterior - k, columnaActual)
                            combos.push(elemento);
                            console.log(`Combo V añadido: ${elemento}`);
                        }
                    }
                    // Reiniciamos la referencia y la cadena para el nuevo elemento
                    referencia = tableroLogico[i][j];
                    cadena = 1;
                    // console.log(`Nueva referencia V: ${referencia} en [${i},${j}]`);
                }
            }
        }

        // Al finalizar la iteración de todas las filas en la columna actual,
        // verificamos si la última cadena formada llegó al final de la columna y es un combo.
        if (cadena >= 3) {
            // console.log(`Combo V (fin de columna) detectado en columna ${j}, terminando en fila ${FILAS-1}. Longitud: ${cadena}`);
            for (let k = 0; k < cadena; k++) {
                // La cadena terminó en la última fila (FILAS-1).
                // Los elementos son [FILAS-1, j], [FILAS-2, j], ..., [(FILAS-1)-(cadena-1), j]
                const elemento = [(FILAS - 1) - k, j]; // (ultimaFila - k, columnaActual)
                combos.push(elemento);
                console.log(`Combo V añadido (fin de columna): ${elemento}`);
            }
        }
    }
}

function busquedaHorizontal(combos) {
    for (let i = 0; i < FILAS; i++) {
        // Inicializar referencia y cadena para CADA fila
        let referencia = null;
        let cadena = 0;

        for (let j = 0; j < COLUMNAS; j++) {
            if (j == 0) {
                // Primer elemento de la fila
                referencia = tableroLogico[i][j];
                cadena = 1;
                // console.log(`Fila ${i}: Referencia inicial: ${referencia}`);
            } else {
                // Elementos subsiguientes de la fila
                if (tableroLogico[i][j] == referencia) {
                    cadena++;
                    // console.log(`Cadena incrementada: ${cadena} en [${i},${j}]`);
                } else {
                    // El color cambió, la cadena se rompió.
                    // ¿La cadena anterior era un combo?
                    if (cadena >= 3) {
                        // console.log(`Combo H (por cambio) detectado en fila ${i}, terminando en columna ${j-1}. Longitud: ${cadena}`);
                        for (let k = 0; k < cadena; k++) {
                            // La cadena terminó en j-1. Los elementos son (j-1), (j-2), ..., (j-cadena)
                            const elemento = [i, (j - 1) - k];
                            combos.push(elemento);
                            console.log(`Combo H añadido: ${elemento}`);
                        }
                    }
                    // Reiniciar para la nueva referencia
                    referencia = tableroLogico[i][j];
                    cadena = 1;
                    // console.log(`Nueva referencia: ${referencia} en [${i},${j}]`);
                }
            }
        }

        // Al finalizar la fila, verificar si la última cadena formó un combo
        // Esto es crucial si la fila termina con un combo (ej: A A A)
        if (cadena >= 3) {
            // console.log(`Combo H (fin de fila) detectado en fila ${i}, terminando en columna ${COLUMNAS-1}. Longitud: ${cadena}`);
            for (let k = 0; k < cadena; k++) {
                // La cadena terminó en COLUMNAS-1. Los elementos son (COLUMNAS-1), (COLUMNAS-2), ...
                const elemento = [i, (COLUMNAS - 1) - k];
                combos.push(elemento);
                console.log(`Combo H añadido (fin de fila): ${elemento}`);
            }
        }
    }
}

/**
 * Elimina las gemas marcadas en el arreglo global `combos`
 * ─────────────────────────────────────────────────────────
 *  1. Recorre cada coordenada almacenada en `combos`.  
 *  2. Para cada par [fila, columna]:
 *       • Cambia el valor de la celda en `tableroLogico`
 *         a la constante "gema--matada", que indica una casilla vacía
 *         o lista para animación de desaparición.  
 *  3. Al finalizar la actualización de la lógica, invoca `actualizarTablero()`
 *     para que la vista (DOM) refleje el nuevo estado.
 *
 *  Notas:
 *  ──────
 *  • Se asume que `combos` ya no contiene duplicados; de lo contrario,
 *    la misma gema se “mataría” varias veces (inofensivo pero innecesario).
 *  • Si planeas animar la caída de nuevas gemas antes de refrescar el DOM,
 *    podrías retrasar la llamada a `actualizarTablero()` o encadenarla a una
 *    promesa que espere la animación de fade-out.
 *  • Devuelve void porque la función actúa por efectos secundarios
 *    (modifica `tableroLogico` y el DOM indirectamente).
 */
function borrarCombos() {
    // ❶ Iteramos sobre cada combo detectado (par de coordenadas [fila, columna])
    combos.forEach((combo) => {
        const fila = combo[0];   // Índice de fila en la matriz lógica
        const columna = combo[1];   // Índice de columna en la matriz lógica

        // ❷ Marcar la celda como eliminada en la lógica del juego
        tableroLogico[fila][columna] = "gema--matada";
        //       ↑ Esta cadena especial servirá para que 'actualizarTablero'
        //         aplique la clase CSS correspondiente y/o lance la animación
    });

    // ❸ Reflejar visualmente los cambios en el tablero
    actualizarTablero();
}

/**
 * Sincroniza el DOM con la matriz lógica `tableroLogico`.
 * ────────────────────────────────────────────────────────
 *   1. Recorre todas las gemas que existen en el tablero (nodos .gema).
 *   2. Para cada gema:
 *        a. Lee su posición lógica (data-fila, data-columna).
 *        b. Busca el color “real” en la matriz `tableroLogico`.
 *        c. Actualiza las clases CSS y el atributo data-color
 *           para que la representación visual coincida con la lógica.
 *   3. Si la gema está marcada como "gema--matada", se le asigna esa clase
 *      para desencadenar la animación de destrucción (opacidad, escala, etc.).
 *      En caso contrario, se asegura de que la gema tenga el color correcto.
 */
function actualizarTablero() {
    // ❶ Selecciona todas las gemas del DOM dentro del contenedor `tablero`
    const gemas = tablero.querySelectorAll(".gema");

    // ❷ Recorre Nodelist con forEach: una iteración por cada gema
    gemas.forEach((gema) => {
        // ❷a. Posición de la gema en la matriz lógica (strings → se usan como índices)
        const fila = gema.dataset.fila;
        const columna = gema.dataset.columna;

        // ❷b. Color “verdadero” de la gema según la lógica del juego
        const color = tableroLogico[fila][columna];

        /* ❷c. Sincronización visual
           ────────────────────────
           Si la gema fue marcada como "gema--matada" en la lógica, significa:
             • Debe mostrarse como eliminada (por ejemplo, con fade-out).
             • Se conserva en el DOM hasta que termine la animación o cascada.
           De lo contrario, se asegura que luzca con su color actual.
        */
        if (color === "gema--matada") {
            // -- Estado de gema eliminada --
            gema.classList.remove(gema.dataset.color); // quita color anterior
            gema.classList.add("gema--matada");        // aplica estilo de muerte
            gema.dataset.color = "gema--matada";       // persiste el nuevo estado
        } else {
            // -- Estado normal: colorear correctamente --
            gema.classList.remove("gema--matada");     // por si estaba marcada antes
            gema.classList.replace(gema.dataset.color, color); // swap de clase de color
            gema.dataset.color = color;                // actualiza el atributo de color
        }
    });
}

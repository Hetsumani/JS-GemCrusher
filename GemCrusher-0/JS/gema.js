export class Gema {
    constructor(fila, columna, color) {
        this.fila = fila;
        this.columna = columna;
        this.color = color;

        // Generar elementos
        this.elDiv = document.createElement("div");
        this.elDiv.classList.add("gema");
        this.elDiv.style.backgroundColor = color;
        this.elDiv.dataset.fila = fila;
        this.elDiv.dataset.columna = columna;
        this.elDiv.dataset.color = color;
    }

    /**
 * Actualiza la posición lógica y visual de la gema.
 * Se usa cuando la ficha “viaja” a otra casilla (swap, caída, relleno).
 *
 * @param {number} fila - Índice de fila en la matriz (0-based).
 * @param {number} col  - Índice de columna en la matriz (0-based).
 */
    setPos(fila, col) {
        /* ---------- 1. Actualizar MODELO ---------- */
        this.fila = fila;   // Coordenada lógica en la matriz gemas[][]
        this.columna = col;

        /* ---------- 2. Sincronizar DATASET ---------- */
        // Útil para depuración en DevTools y para búsquedas rápidas en el DOM
        this.elDiv.dataset.fila = fila;
        this.elDiv.dataset.columna = col;

        /* ---------- 3. Posicionar en la cuadrícula CSS ---------- */
        // CSS Grid usa índices 1-based, por eso sumamos 1
        // De esta forma NO cambiamos el orden real del nodo en el DOM,
        // sólo le decimos a la cuadrícula dónde debe pintarse.
        this.elDiv.style.gridRowStart = fila + 1;
        this.elDiv.style.gridColumnStart = col + 1;
    }

}
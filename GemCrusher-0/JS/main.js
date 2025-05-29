import { Gema } from "./gema.js";
const tablero = document.getElementById("tablero");

const FILAS = 8;
const COLUMNAS = 8;

let gemas = []
let colores = ["red", "purple", "yellow", "blue", "green"];

let gemaSeleccionada = null;

for (let i = 0; i < FILAS; i++) {
    gemas[i] = []
    for (let j = 0; j < COLUMNAS; j++) {
        const color = Math.floor(Math.random() * colores.length);
        gemas[i][j] = new Gema(i, j, colores[color]);
        tablero.appendChild(gemas[i][j].elDiv);
        // El contenido de la tabla se pasa por referencia, no se copia como tal
        gemas[i][j].elDiv.gemaObj = gemas[i][j]; // <--- Esto es clave

        //Agregamos el eventListener
        gemas[i][j].elDiv.addEventListener("click", clickGema);
    }
}

function clickGema(event) {
    const gemaClicada = event.currentTarget.gemaObj; // <- accede al objeto Gema
    if (gemaClicada.elDiv.classList.contains("seleccionada")) {
        gemaClicada.elDiv.classList.remove("seleccionada");
        gemaSeleccionada = null;
    } else if (!gemaSeleccionada) {
        gemaClicada.elDiv.classList.add("seleccionada");
        gemaSeleccionada = gemaClicada;
    } else {
        cambiarGemas(gemaSeleccionada, gemaClicada);

        // Limpiamos los elementos
        gemaSeleccionada.elDiv.classList.remove("seleccionada");
        gemaClicada.elDiv.classList.remove("seleccionada");
        gemaSeleccionada = null;
    }
}

function cambiarGemas(gemaA, gemaB) {
    // Guarda sus posiciones originales
    const filaA = gemaA.fila;
    const colA = gemaA.columna;
    const filaB = gemaB.fila;
    const colB = gemaB.columna;

    // Swap en la matriz lógica
    gemas[filaA][colA] = gemaB;
    gemas[filaB][colB] = gemaA;

    // Intercambia propiedades internas
    [gemaA.fila, gemaB.fila] = [filaB, filaA];
    [gemaA.columna, gemaB.columna] = [colB, colA];

    // Actualiza los datasets y colores en el DOM
    gemaA.elDiv.dataset.fila = gemaA.fila;
    gemaA.elDiv.dataset.columna = gemaA.columna;
    gemaB.elDiv.dataset.fila = gemaB.fila;
    gemaB.elDiv.dataset.columna = gemaB.columna;

    // Intercambia los colores visualmente
    const colorA = gemaA.color;
    gemaA.color = gemaB.color;
    gemaB.color = colorA;

    gemaA.elDiv.style.backgroundColor = gemaA.color;
    gemaB.elDiv.style.backgroundColor = gemaB.color;
    gemaA.elDiv.dataset.color = gemaA.color;
    gemaB.elDiv.dataset.color = gemaB.color;
}

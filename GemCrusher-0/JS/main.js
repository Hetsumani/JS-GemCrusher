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
        
        const combos = buscarCombos();
        if (combos) {
            // Aquí eliminas las gemas en los combos, las “caes” y rellenas
            console.log("¡Hay combos!", combos);
        } else {
            // Si no hay match, puedes revertir el swap
            console.log("No hubo match");
        }

        // Limpiamos los elementos
        gemaSeleccionada.elDiv.classList.remove("seleccionada");
        gemaClicada.elDiv.classList.remove("seleccionada");
        gemaSeleccionada = null;
    }
}

function cambiarGemas(gemaA, gemaB) {
  // Guarda posiciones originales
  const [filaA, colA] = [gemaA.fila, gemaA.columna];
  const [filaB, colB] = [gemaB.fila, gemaB.columna];

  // 1. Intercambia posiciones en la matriz
  [gemas[filaA][colA], gemas[filaB][colB]] = [gemas[filaB][colB], gemas[filaA][colA]];

  // 2. Actualiza coordenadas internas
  [gemaA.fila, gemaB.fila] = [filaB, filaA];
  [gemaA.columna, gemaB.columna] = [colB, colA];

  // 3. Sincroniza datasets (solo fila/columna)
  gemaA.elDiv.dataset.fila = gemaA.fila;
  gemaA.elDiv.dataset.columna = gemaA.columna;
  gemaB.elDiv.dataset.fila = gemaB.fila;
  gemaB.elDiv.dataset.columna = gemaB.columna;

  // ¡Nada de intercambiar colores!
}

function buscarCombos() {
    const FILAS = gemas.length;
    const COLUMNAS = gemas[0].length;
    let matches = [];

    // ----- 1. Horizontales -----
    for (let fila = 0; fila < FILAS; fila++) {
        let colorToMatch = gemas[fila][0].color;
        let matchNum = 1;
        for (let col = 1; col < COLUMNAS; col++) {
            if (gemas[fila][col].color === colorToMatch) {
                matchNum++;
            } else {
                if (matchNum >= 3) {
                    let match = [];
                    for (let c = col - matchNum; c < col; c++) {
                        match.push(gemas[fila][c]);
                    }
                    matches.push(match);
                }
                colorToMatch = gemas[fila][col].color;
                matchNum = 1;
            }
        }
        // Caso especial: la fila termina con un match
        if (matchNum >= 3) {
            let match = [];
            for (let c = COLUMNAS - matchNum; c < COLUMNAS; c++) {
                match.push(gemas[fila][c]);
            }
            matches.push(match);
        }
    }

    // ----- 2. Verticales -----
    for (let col = 0; col < COLUMNAS; col++) {
        let colorToMatch = gemas[0][col].color;
        let matchNum = 1;
        for (let fila = 1; fila < FILAS; fila++) {
            if (gemas[fila][col].color === colorToMatch) {
                matchNum++;
            } else {
                if (matchNum >= 3) {
                    let match = [];
                    for (let f = fila - matchNum; f < fila; f++) {
                        match.push(gemas[f][col]);
                    }
                    matches.push(match);
                }
                colorToMatch = gemas[fila][col].color;
                matchNum = 1;
            }
        }
        // Caso especial: la columna termina con un match
        if (matchNum >= 3) {
            let match = [];
            for (let f = FILAS - matchNum; f < FILAS; f++) {
                match.push(gemas[f][col]);
            }
            matches.push(match);
        }
    }

    // Si hay matches, regresa el arreglo, si no, regresa false
    return matches.length > 0 ? matches : false;
}

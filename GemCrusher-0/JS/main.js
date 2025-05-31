import { Gema } from "./gema.js";
const tablero = document.getElementById("tablero");

const FILAS = 8;
const COLUMNAS = 8;

let gemas = [];
let colores = ["gema--red", "gema--purple", "gema--yellow", "gema--blue", "gema--green", "gema--orange"];
let coloresGenerados = [];

let gemaSeleccionada = null;

do {
    coloresGenerados = [];
    for (let i = 0; i < FILAS; i++) {
        coloresGenerados[i] = [];
        for (let j = 0; j < COLUMNAS; j++) {
            const color = Math.floor(Math.random() * colores.length);
            coloresGenerados[i][j] = colores[color];
        }
    }
} while (buscarStarterCombos())

for (let i = 0; i < FILAS; i++) {
    gemas[i] = [];
    for (let j = 0; j < COLUMNAS; j++) {
        gemas[i][j] = new Gema(i, j, coloresGenerados[i][j]);
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
            const gemsToRemove = [...new Set(combos.flat())];
            borrarGemas(gemsToRemove);
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

    // 3. actualiza cada objeto y su div
    gemas[filaA][colA].setPos(filaA, colA);
    gemas[filaB][colB].setPos(filaB, colB);
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

function buscarStarterCombos() {
    // 1. Horizontales
    for (let fila = 0; fila < FILAS; fila++) {
        let streak = 1;
        for (let col = 1; col < COLUMNAS; col++) {
            if (coloresGenerados[fila][col] === coloresGenerados[fila][col - 1]) {
                if (++streak >= 3) return true;   // match encontrado
            } else {
                streak = 1;
            }
        }
    }

    // 2. Verticales
    for (let col = 0; col < COLUMNAS; col++) {
        let streak = 1;
        for (let fila = 1; fila < FILAS; fila++) {
            if (coloresGenerados[fila][col] === coloresGenerados[fila - 1][col]) {
                if (++streak >= 3) return true;
            } else {
                streak = 1;
            }
        }
    }

    // Si llegamos aquí, no hay tríos
    return false;
}

function borrarGemas(gemasBorrar) {
    // 1. Remove matched gems from the board (logically and visually)
    gemasBorrar.forEach(gema => {
        if (gema && gema.elDiv) {
            gema.elDiv.remove(); // Remove the gem's HTML element from the DOM
        }
        // Ensure gema and its properties (fila, columna) are valid
        // and that the gem exists at that position in the gemas array
        if (gema && typeof gema.fila === 'number' && typeof gema.columna === 'number' &&
            gemas[gema.fila] && gemas[gema.fila][gema.columna]) {
            gemas[gema.fila][gema.columna] = null; // Mark the spot as empty in the logical grid
        }
    });

    // 2. Make remaining gems fall down in each column
    for (let col = 0; col < COLUMNAS; col++) { // Iterate through each column
        // For each column, iterate from the bottom row upwards
        for (let row = FILAS - 1; row >= 0; row--) {
            // If the current cell at [row][col] is empty (a "hole")
            if (gemas[row][col] === null) {
                let k = row - 1; // Start looking for a gem from the cell directly above the hole

                // Search upwards from the hole (k) to find the nearest gem in the same column
                while (k >= 0 && gemas[k][col] === null) {
                    k--; // Move one row up
                }

                // If a gem was found (k is a valid row index)
                if (k >= 0) {
                    // Move the found gem (gemas[k][col]) into the current hole (gemas[row][col])
                    gemas[row][col] = gemas[k][col];
                    gemas[k][col] = null; // The original spot of the moved gem is now empty

                    // Update the gem's internal state and its visual position on the CSS grid
                    gemas[row][col].setPos(row, col);
                }
                // If k < 0, it means all cells above this hole in this column are also empty.
                // These empty cells at the top would typically be filled by new gems in a separate "refill" step.
            }
        }
    }

    // 3. (Next Step, not in original problem scope)
    // After gems fall, you would typically add logic here to refill the empty
    // cells at the top of the columns with new gems.
}
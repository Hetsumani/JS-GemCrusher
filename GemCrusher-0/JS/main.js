import { Gema } from "./gema.js";
const tablero = document.getElementById("tablero");

const FILAS = 8;
const COLUMNAS = 8;

let gemas = []

for(let i = 0; i < FILAS; i++) {
    gemas[i] = []
    for (let j = 0; j < COLUMNAS; j++){
        gemas[i][j] = new Gema(i, j, "red");
        tablero.appendChild(gemas[i][j].elDiv);
    }
}
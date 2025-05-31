import { Gema } from "./gema.js";
const tablero = document.getElementById("tablero");

const FILAS = 8;
const COLUMNAS = 8;

let colores = ["gema--red", "gema--purple", "gema--yellow", "gema--blue", "gema--green", "gema--orange"];

let tableroLogico = [];
let seleccionada = null;

let combos = [];

for (let i = 0; i < FILAS; i++) {
    tableroLogico[i] = [];
    for (let j = 0; j < COLUMNAS; j++) {
        let color = Math.floor(Math.random() * colores.length);
        tableroLogico[i][j] = colores[color];
    }
}

for (let i = 0; i < FILAS; i++) {
    for (let j = 0; j < COLUMNAS; j++) {
        let gema = new Gema(i, j, tableroLogico[i][j]);
        gema.elDiv.addEventListener('click', clickGema);
        tablero.appendChild(gema.elDiv);
    }
}

function clickGema(event) {
    const gema = event.target;
    if (gema.classList.contains("seleccionada")) {
        gema.classList.remove("seleccionada")
        seleccionada = null;
    } else if (seleccionada) {
        cambiarGemas(seleccionada, gema);

        buscarCombos();

        seleccionada.classList.remove("seleccionada");
        seleccionada = null;
    }
    else {
        gema.classList.add("seleccionada");
        seleccionada = gema;
    }
}

function cambiarGemas(gema1, gema2) {
    let fila1 = gema1.dataset.fila;
    let col1 = gema1.dataset.columna;
    let color1 = gema1.dataset.color;
    let fila2 = gema2.dataset.fila;
    let col2 = gema2.dataset.columna;
    let color2 = gema2.dataset.color;

    gema1.classList.replace(color1, color2);
    gema1.dataset.color = color2;
    tableroLogico[fila1][col1] = color2;

    gema2.classList.replace(color2, color1);
    gema2.dataset.color = color1;
    tableroLogico[fila2][col2] = color1;
}

function buscarCombos() {
    // Empezamos con la fila
    // Tomamos ese elemento como referencia
    // si el que sigue es igual, cadena aumenta en 1
    // si no, se copia como referencia
    // si cadena llega a 3 o más, se guarda en combos 
    // en cuanto cambiemos de color

    // Chequeo horizontal
    let referencia = null;
    let cadena = 1;
    let combos = [];
    for (let i = 0; i < FILAS; i++) {
        for (let j = 0; j < COLUMNAS; j++) {
            if (j == 0) {
                referencia = tableroLogico[i][j];
            } else if (referencia == tableroLogico[i][j]) {
                cadena++;
            } else if (referencia != tableroLogico[i][j] && cadena >= 3) {
                for (let k = 0; k < cadena; k++) {
                    const elemento = [i, j - k]
                    combos.push(elemento);
                }
                referencia = tableroLogico[i][j];
            } else {
                referencia = tableroLogico[i][j];
            }
            cadena = 1;
        }
    }
}

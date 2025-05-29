import { Gema } from "./gema.js";
const tablero = document.getElementById("tablero");

const FILAS = 8;
const COLUMNAS = 8;

let gemas = []

let colores = ["red", "purple", "yellow", "blue", "green"];

for(let i = 0; i < FILAS; i++) {
    gemas[i] = []
    for (let j = 0; j < COLUMNAS; j++){
        const color = Math.floor(Math.random() * colores.length);        
        gemas[i][j] = new Gema(i, j, colores[color]);
        tablero.appendChild(gemas[i][j].elDiv);

        //Agregamos el eventListener
        gemas[i][j].elDiv.addEventListener("click", clickGema);
    }
}

function clickGema(event){
    const gemaClicada = event.target;
    gemaClicada.classList.add("seleccionada");
}
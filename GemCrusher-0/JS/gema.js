export class Gema {
    constructor(fila, columna, color) {
        this.fila = fila;
        this.columna = columna;
        this.color = color;

        // Generar elementos
        this.elDiv = document.createElement("div");
        this.elDiv.classList.add("gema");
        this.elDiv.style.backgroundColor = color;
    }
}
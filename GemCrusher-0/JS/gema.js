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
}
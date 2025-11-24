document.addEventListener("DOMContentLoaded", () => {

    const productosTemporada = [
        { id: 9001, nombre: "Short Hombre Verano", precio: 49.90, genero: "hombre", PreviewImage: "../imagenes/hombre/Poleras/Polera Canguro Algodón Denimlab Hombre Manga Larga.jpg" },
        { id: 9002, nombre: "Camisa Hombre Primavera", precio: 89.90, genero: "hombre", PreviewImage: "../imagenes/hombre/Poleras/Polera Canguro Algodón Denimlab Hombre Manga Larga.jpg" },
        { id: 9003, nombre: "Polo Hombre Floral", precio: 69.90, genero: "hombre", PreviewImage: "../imagenes/hombre/Poleras/Polera Canguro Algodón Denimlab Hombre Manga Larga.jpg" },

        { id: 9101, nombre: "Blusa Mujer Estampada", precio: 79.90, genero: "mujer", PreviewImage: "../imagenes/hombre/Poleras/Polera Canguro Algodón Denimlab Hombre Manga Larga.jpg" },
        { id: 9102, nombre: "Falda Mujer Primavera", precio: 59.90, genero: "mujer", PreviewImage:"../imagenes/hombre/Poleras/Polera Canguro Algodón Denimlab Hombre Manga Larga.jpg" },
        { id: 9103, nombre: "Vestido Mujer Floral", precio: 119.90, genero: "mujer", PreviewImage: "../imagenes/hombre/Poleras/Polera Canguro Algodón Denimlab Hombre Manga Larga.jpg" }
    ];

    // 👉 usar los contenedores reales del HTML
    const contHombre = document.getElementById("tempHombre");
    const contMujer  = document.getElementById("tempMujer");

    productosTemporada.forEach(prod => {
        const tarjeta = crearTarjeta(prod);

        if (prod.genero === "hombre") {
            contHombre.appendChild(tarjeta);
        } else {
            contMujer.appendChild(tarjeta);
        }
    });
});


function crearTarjeta(p) {
    const div = document.createElement("div");
    div.classList.add("tarjeta-producto");  

    div.innerHTML = `
        <img src="${p.PreviewImage}" alt="${p.nombre}">
        <div class="precio">S/.${p.precio.toFixed(2)}</div>
        <div class="nombre">${p.nombre}</div>
        <div class="marca-sybilla">Sybilla</div> 
        <button onclick="verDetalle(${p.id})">Ver detalle</button>
    `;

    return div;
}


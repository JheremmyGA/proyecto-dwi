import * as HTTPS_Request from '../Utils/HTTPRequest.js';
import * as PERSISTENT_DATA from '../Utils/PersistentData.js';

document.addEventListener("DOMContentLoaded", () => {
    InitData();
});

async function InitData() {
    //const productosTemporada = [
    //    { id: 9001, nombre: "Short Hombre Verano", precio: 49.90, genero: "hombre", PreviewImage: "../imagenes/hombre/Poleras/Polera Canguro Algodón Denimlab Hombre Manga Larga.jpg" },
    //    { id: 9002, nombre: "Camisa Hombre Primavera", precio: 89.90, genero: "hombre", PreviewImage: "../imagenes/hombre/Poleras/Polera Canguro Algodón Denimlab Hombre Manga Larga.jpg" },
    //    { id: 9003, nombre: "Polo Hombre Floral", precio: 69.90, genero: "hombre", PreviewImage: "../imagenes/hombre/Poleras/Polera Canguro Algodón Denimlab Hombre Manga Larga.jpg" },
//
    //    { id: 9101, nombre: "Blusa Mujer Estampada", precio: 79.90, genero: "mujer", PreviewImage: "../imagenes/hombre/Poleras/Polera Canguro Algodón Denimlab Hombre Manga Larga.jpg" },
    //    { id: 9102, nombre: "Falda Mujer Primavera", precio: 59.90, genero: "mujer", PreviewImage:"../imagenes/hombre/Poleras/Polera Canguro Algodón Denimlab Hombre Manga Larga.jpg" },
    //    { id: 9103, nombre: "Vestido Mujer Floral", precio: 119.90, genero: "mujer", PreviewImage: "../imagenes/hombre/Poleras/Polera Canguro Algodón Denimlab Hombre Manga Larga.jpg" }
    //];

    let productosTemporada = await HTTPS_Request.GetCatalogTemporada();

    // 👉 usar los contenedores reales del HTML
    const contHombre = document.getElementById("tempHombre");
    const contMujer  = document.getElementById("tempMujer");

    productosTemporada.forEach(prod => {
        const tarjeta = crearTarjetaProducto(prod);
        contHombre.appendChild(tarjeta);
        //if (prod.genero === "hombre") {
        //    contHombre.appendChild(tarjeta);
        //} else {
        //    contMujer.appendChild(tarjeta);
        //}
    });
}


function crearTarjetaProducto(producto) {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta-producto';
    tarjeta.setAttribute('data-marca', producto.marca);
    tarjeta.setAttribute('data-temporada', producto.temporada);
    tarjeta.setAttribute('data-categoria', producto.categoria);

    // Aseguramos que el precio sea válido para la visualización
    const precioNumerico = producto.precio !== null && producto.precio !== undefined ? producto.precio : 0;
    const precioReal = parseFloat(precioNumerico);
    const precioFormateado = `S/.${precioReal.toFixed(2)}`;

    // Si PreviewImage está vacío o es null, usar una imagen placeholder/por defecto
    const imagenSrc = producto.PreviewImage
        ? producto.PreviewImage
        : '/images/7892db09-c21a-4bc9-84c2-295fe6800ab5.png';

    tarjeta.innerHTML = `
        <img class="producto-imagen-principal" 
             src="${imagenSrc}" 
             alt="${producto.nombre}">
        <p class="precio">${precioFormateado}</p>
        <p class="nombre">${producto.nombre}</p>
        <p class="marca">${producto.marca}</p>
        
        <div class="botones-tarjeta">
            <button class="ver-detalle">Ver detalle</button>
        </div>
    `;

    const btnDetalle = tarjeta.querySelector('.ver-detalle');
    btnDetalle.addEventListener('click', () => {
        PERSISTENT_DATA.SelectProductDetails(producto.id);
        redirigirDetalle();
    });

    return tarjeta;
}

function redirigirDetalle() {
    window.location.href = `detalle_producto_prenda.html`;
}


import * as HTTPS_Request from './HTTPRequest.js';
import * as PERSISTENT_DATA from './PersistentData.js';

// 1. Datos de Productos (Simulación)
const datosProductos = [
    // La imagen 'product_black.png' y 'product_white.png' son placeholders
    { id: 1, nombre: 'Chaleco de traje', marca: 'University Club', temporada: 'Verano', categoria: 'Chaleco', precio: 'S/12.00', imagen: 'Zapatillas Urbanas Hombre New Balance.png', color: 'Negro' },
    { id: 2, nombre: 'Chaleco de traje', marca: 'Basement', temporada: 'Otoño', categoria: 'Chaleco', precio: 'S/12.00', imagen: 'Zapatillas Urbanas Hombre New Balance.png', color: 'Blanco' },
    { id: 3, nombre: 'Casaca en lona de algodón', marca: 'Levis', temporada: 'Invierno', categoria: 'Casaca', precio: 'S/12.00', imagen: 'Zapatillas Urbanas Hombre New Balance.png', color: 'Beige oscuro' },
];

const cuadriculaProductos = document.getElementById('cuadricula-productos');
const filtroTemporada = document.getElementById('filtro-temporada');
const filtroMarca = document.getElementById('filtro-marca');
const filtroCategoria = document.getElementById('filtro-categoria');
const botonAplicarFiltros = document.getElementById('boton-aplicar-filtros');
const botonResetFiltros = document.getElementById('boton-reset-filtros');

// 2. Función para crear la tarjeta de producto HTML
function crearTarjetaProducto(producto) {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta-producto';
    tarjeta.setAttribute('data-marca', producto.marca);
    tarjeta.setAttribute('data-temporada', producto.temporada);
    tarjeta.setAttribute('data-categoria', producto.categoria);

    tarjeta.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <p class="precio">${producto.precio}</p>
        <p class="nombre">${producto.nombre}</p>
        <p class="marca">${producto.marca}</p>
        <p class="color">${producto.color}</p>
    `;
    return tarjeta;
}

// 3. Función para renderizar todos los productos
function renderizarProductos(productos) {
    cuadriculaProductos.innerHTML = ''; // Limpia el grid
    productos.forEach(producto => {
        cuadriculaProductos.appendChild(crearTarjetaProducto(producto));
    });
}

// 4. Lógica de Filtrado Múltiple
function aplicarFiltros() {
    // Obtener valores seleccionados (listas múltiples)
    const temporadasSeleccionadas = Array.from(filtroTemporada.selectedOptions).map(opcion => opcion.value);
    const marcasSeleccionadas = Array.from(filtroMarca.selectedOptions).map(opcion => opcion.value);
    const categoriasSeleccionadas = Array.from(filtroCategoria.selectedOptions).map(opcion => opcion.value);

    const tarjetasProductos = document.querySelectorAll('.tarjeta-producto');

    tarjetasProductos.forEach(tarjeta => {
        const productoTemporada = tarjeta.getAttribute('data-temporada');
        const productoMarca = tarjeta.getAttribute('data-marca');
        const productoCategoria = tarjeta.getAttribute('data-categoria');

        // Lógica de "pasa si no hay filtro seleccionado O si el valor del producto está en la lista de seleccionados"
        let pasaTemporada = temporadasSeleccionadas.length === 0 || temporadasSeleccionadas.includes(productoTemporada);
        let pasaMarca = marcasSeleccionadas.length === 0 || marcasSeleccionadas.includes(productoMarca);
        let pasaCategoria = categoriasSeleccionadas.length === 0 || categoriasSeleccionadas.includes(productoCategoria);

        // Si el producto pasa todos los filtros, se muestra
        if (pasaTemporada && pasaMarca && pasaCategoria) {
            tarjeta.classList.remove('oculto');
        } else {
            tarjeta.classList.add('oculto');
        }
    });
}

// ============ UTILIDADES Y NAVEGACIÓN ============
function redirigir(nombre) {
    window.location.href = nombre;
}

// ============ CONFIGURACION DE GENEROS ============
async function MostrarGeneroSelected(){
    const genero = await HTTPS_Request.GetGenero(PERSISTENT_DATA.GetSelectedGenero());

    console.error(PERSISTENT_DATA.GetSelectedGenero());
    if (!genero) return;

    const titulo = document.getElementById("titulo-seccion");
    titulo.innerHTML = "";
    titulo.innerHTML = genero.nombre;

    const descripcion = document.getElementById("descripcion-seccion");
    descripcion.innerHTML = "";
    descripcion.innerHTML = genero.descripcion;
}

// 5. Inicialización y Evento del Botón
document.addEventListener('DOMContentLoaded', () => {
    MostrarGeneroSelected();
    // 1. Inicializar la cuadrícula con todos los productos al cargar
    renderizarProductos(datosProductos);

    // 2. Asignar el evento al botón de filtrar
    botonAplicarFiltros.addEventListener('click', aplicarFiltros);

    // 3. Evento para el botón reset: vuelve a "Todo" y muestra todos los productos
    botonResetFiltros?.addEventListener('click', () => {
        if (filtroTemporada) filtroTemporada.value = '';
        if (filtroMarca) filtroMarca.value = '';
        if (filtroCategoria) filtroCategoria.value = '';
        renderizarProductos(datosProductos);
    });
});
import * as HTTPS_Request from '../Utils/HTTPRequest.js';
import * as PERSISTENT_DATA from '../Utils/PersistentData.js';

// 1. Datos de Productos (Simulación)
const datosProductos = [
    // La imagen 'product_black.png' y 'product_white.png' son placeholders
    { id: 1, nombre: 'Camisa Oxford Slim Fit', marca: 'University Club', temporada: 'Verano', categoria: 'Camisas', precio: 'S/89.00', imagen: 'camisa_oxford.png'},
    { id: 2, nombre: 'Polo Básico de Algodón', marca: 'Basement', temporada: 'Primavera', categoria: 'Polos', precio: 'S/59.00', imagen: 'polo_basico.png'},
    { id: 3, nombre: 'Pantalón Chino Stretch', marca: 'University Club', temporada: 'Otoño', categoria: 'Pantalones', precio: 'S/119.00', imagen: 'pantalon_chino.png'},
    { id: 4, nombre: 'Casaca Denim Clásica', marca: 'University Club', temporada: 'Invierno', categoria: 'Casacas', precio: 'S/149.00', imagen: 'casaca_denim.png'},
    { id: 5, nombre: 'Camisa de Lino Casual', marca: 'University Club', temporada: 'Verano', categoria: 'Camisas', precio: 'S/99.00', imagen: 'camisa_lino.png'},
    { id: 6, nombre: 'Polo con Cuello Redondo', marca: 'University Club', temporada: 'Primavera', categoria: 'Polos', precio: 'S/65.00', imagen: 'polo_redondo.png'},
    { id: 7, nombre: 'Pantalón Jogger Urbano', marca: 'Levis', temporada: 'Otoño', categoria: 'Pantalones', precio: 'S/109.00', imagen: 'pantalon_jogger.png'},
    { id: 8, nombre: 'Casaca Bomber Minimal', marca: 'Basement', temporada: 'Invierno', categoria: 'Casacas', precio: 'S/159.00', imagen: 'casaca_bomber.png'},
    { id: 9, nombre: 'Camisa Oxford Slim Fit', marca: 'Levis', temporada: 'Verano', categoria: 'Camisas', precio: 'S/89.00', imagen: 'camisa_oxford.png'},
    { id: 10, nombre: 'Polo Básico de Algodón', marca: 'Basement', temporada: 'Primavera', categoria: 'Polos', precio: 'S/59.00', imagen: 'polo_basico.png'},
    { id: 11, nombre: 'Pantalón Chino Stretch', marca: 'University Club', temporada: 'Otoño', categoria: 'Pantalones', precio: 'S/119.00', imagen: 'pantalon_chino.png'},
    { id: 12, nombre: 'Casaca Denim Clásica', marca: 'Newport', temporada: 'Invierno', categoria: 'Casacas', precio: 'S/149.00', imagen: 'casaca_denim.png'},
    { id: 13, nombre: 'Camisa de Lino Casual', marca: 'Newport', temporada: 'Verano', categoria: 'Camisas', precio: 'S/99.00', imagen: 'camisa_lino.png'},
    { id: 14, nombre: 'Polo con Cuello Redondo', marca: 'University Club', temporada: 'Primavera', categoria: 'Polos', precio: 'S/65.00', imagen: 'polo_redondo.png'},
    { id: 15, nombre: 'Pantalón Jogger Urbano', marca: 'Levis', temporada: 'Otoño', categoria: 'Pantalones', precio: 'S/109.00', imagen: 'pantalon_jogger.png'},
    { id: 16, nombre: 'Casaca Bomber Minimal', marca: 'Newport', temporada: 'Invierno', categoria: 'Casacas', precio: 'S/159.00', imagen: 'casaca_bomber.png'}
];

// DOM elements will be looked up when DOM is ready to avoid nulls.
let cuadriculaProductos = null;
let filtroTemporada = null;
let filtroMarca = null;
let filtroCategoria = null;
let botonAplicarFiltros = null;
let botonResetFiltros = null;

// Helper: get selected values from a <select>. Treat empty string ("") as no selection.
function getSelectedValues(select) {
    if (!select) return [];
    // For single-selects, selectedOptions will contain one option; for 'Todo' value=='' we ignore it.
    const values = Array.from(select.selectedOptions).map(o => (o.value || '').trim()).filter(v => v !== '');
    return values;
}

// 2. Función para crear la tarjeta de producto HTML
function crearTarjetaProducto(producto) {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'tarjeta-producto';
    tarjeta.setAttribute('data-marca', producto.marca);
    tarjeta.setAttribute('data-temporada', producto.temporada);
    tarjeta.setAttribute('data-categoria', producto.categoria);
    // Extraer precio numérico para data-precio (ej: 'S/89.00' -> '89.00')
    const precioData = String(producto.precio || '').replace(/[^\d.]/g, '').trim();

    tarjeta.innerHTML = `
        <img src="${producto.imagen}" alt="${producto.nombre}">
        <p class="precio">${producto.precio}</p>
        <p class="nombre">${producto.nombre}</p>
        <p class="marca">${producto.marca}</p>
        <p class="color">${producto.color}</p>
        <a href="#" class="agregar-carrito" data-id="${producto.id}" data-nombre="${producto.nombre}" data-precio="${precioData}" data-imagen="${producto.imagen}">Agregar al carrito</a>
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
    // Obtener valores seleccionados, ignorando la opción por defecto ("Todo" que tiene value="")
    const temporadasSeleccionadas = getSelectedValues(filtroTemporada);
    const marcasSeleccionadas = getSelectedValues(filtroMarca);
    const categoriasSeleccionadas = getSelectedValues(filtroCategoria);

    const tarjetasProductos = document.querySelectorAll('.tarjeta-producto');

    tarjetasProductos.forEach(tarjeta => {
        const productoTemporada = tarjeta.getAttribute('data-temporada');
        const productoMarca = tarjeta.getAttribute('data-marca');
        const productoCategoria = tarjeta.getAttribute('data-categoria');

        // Si no hay valores seleccionados en una categoría, se considera que no hay filtro para esa categoría
        const pasaTemporada = temporadasSeleccionadas.length === 0 || temporadasSeleccionadas.includes(productoTemporada);
        const pasaMarca = marcasSeleccionadas.length === 0 || marcasSeleccionadas.includes(productoMarca);
        const pasaCategoria = categoriasSeleccionadas.length === 0 || categoriasSeleccionadas.includes(productoCategoria);

        // Mostrar/ocultar
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

    if (!genero) return;

    const titulo = document.getElementById("titulo-seccion");
    titulo.innerHTML = "";
    titulo.innerHTML = genero.nombre;

    const descripcion = document.getElementById("descripcion-seccion");
    descripcion.innerHTML = "";
    descripcion.innerHTML = genero.descripcion;
    // Actualizar el título del bloque de filtros (sidebar) para reflejar la sección seleccionada
    const tituloFiltro = document.querySelector('.titulo-filtro');
    if (tituloFiltro) tituloFiltro.textContent = genero.nombre;
}

// 5. Inicialización y Evento del Botón
document.addEventListener('DOMContentLoaded', () => {
    MostrarGeneroSelected();
    // 1. Inicializar la cuadrícula con todos los productos al cargar
    // Lookup DOM elements now (safe)
    cuadriculaProductos = document.getElementById('cuadricula-productos');
    filtroTemporada = document.getElementById('filtro-temporada');
    filtroMarca = document.getElementById('filtro-marca');
    filtroCategoria = document.getElementById('filtro-categoria');
    botonAplicarFiltros = document.getElementById('boton-aplicar-filtros');
    botonResetFiltros = document.getElementById('boton-reset-filtros');

    renderizarProductos(datosProductos);

    // Asignar el evento al botón de filtrar
    botonAplicarFiltros?.addEventListener('click', aplicarFiltros);

    // Evento para el botón reset: vuelve a "Todo" y muestra todos los productos
    botonResetFiltros?.addEventListener('click', () => {
        if (filtroTemporada) filtroTemporada.value = '';
        if (filtroMarca) filtroMarca.value = '';
        if (filtroCategoria) filtroCategoria.value = '';
        // Re-renderizamos todas las tarjetas y quitamos la clase oculto por si quedó alguna
        renderizarProductos(datosProductos);
    });

    // (Opcional) aplicar filtros al cambiar selects para experiencia en vivo
    filtroTemporada?.addEventListener('change', aplicarFiltros);
    filtroMarca?.addEventListener('change', aplicarFiltros);
    filtroCategoria?.addEventListener('change', aplicarFiltros);
});
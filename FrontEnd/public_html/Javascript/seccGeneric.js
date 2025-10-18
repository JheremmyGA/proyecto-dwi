import * as HTTPS_Request from '../Utils/HTTPRequest.js';
import * as PERSISTENT_DATA from '../Utils/PersistentData.js';

// Los elementos del DOM se buscarán cuando el DOM esté listo para evitar valores nulos.
let cuadriculaProductos = null;
let filtroTemporada = null;
let filtroMarca = null;
let filtroCategoria = null;
let botonAplicarFiltros = null;
let botonResetFiltros = null;

// Ayuda: obtener valores seleccionados de un <select>. Tratar la cadena vacía ("") como sin selección.
function getSelectedValues(select) {
    if (!select) return [];
    // Para selects simples, selectedOptions contendrá una opción; para 'Todo' value=='' lo ignoramos.
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

    tarjeta.innerHTML = `
        <img src="${producto.PreviewImage}" alt="${producto.nombre}">
        <p class="precio">S/.${producto.precio}</p>
        <p class="nombre">${producto.nombre}</p>
        <p class="marca">${producto.marca}</p>
        <button class="ver-detalle">Ver detalle</button>
    `;

    const btnDetalle = tarjeta.querySelector('.ver-detalle');
    btnDetalle.addEventListener('click', () => {
        PERSISTENT_DATA.SelectProductDetails(producto.id);
        redirigirDetalle();
    });
    
    return tarjeta;
}

// Función para redirigir a la página de detalle del producto
function redirigirDetalle(productId) {
    window.location.href = `detalle_producto_prenda.html`;
}

// Exponer la función redirigirDetalle al ámbito global
window.redirigirDetalle = redirigirDetalle;

// 3. Función para renderizar todos los productos
async function renderizarProductos() {

    const productos = await HTTPS_Request.GetCatalogByGenger(PERSISTENT_DATA.GetSelectedGenero());
    if (!productos) return;

    cuadriculaProductos.innerHTML = ''; // Limpia la cuadrícula
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

// ============ CONFIGURACIÓN DE GÉNEROS ============
async function MostrarGeneroSelected(){
    const genero = await HTTPS_Request.GetGenero(PERSISTENT_DATA.GetSelectedGenero());

    if (!genero) return;

    const titulo = document.getElementById("titulo-seccion");
    titulo.innerHTML = "";
    titulo.innerHTML = genero.nombre;

    const descripcion = document.getElementById("descripcion-seccion");
    descripcion.innerHTML = "";
    descripcion.innerHTML = genero.descripcion;
    // Actualizar el título del bloque de filtros (barra lateral) para reflejar la sección seleccionada
    const tituloFiltro = document.querySelector('.titulo-filtro');
    if (tituloFiltro) tituloFiltro.textContent = genero.nombre;
}

// ============ CONFIGURACIÓN FILTROS ============
async function MostrarFiltros(){
    const temporadas = await HTTPS_Request.GetTemporadas();
    if (!temporadas) return;
    crearFiltros("filtro-temporada", temporadas);

    const categorias = await HTTPS_Request.GetCategorias();
    if (!categorias) return;
    crearFiltros("filtro-categoria", categorias);

    const marcas = await HTTPS_Request.GetMarcas();
    if (!marcas) return;
    crearFiltros("filtro-marca", marcas);
}

function crearFiltros(id, data){
    const filtro = document.getElementById(id);
    filtro.innerHTML = ''; // Limpia la cuadrícula
    filtro.appendChild(crearFiltro("","Todo"));
    data.forEach(data => {
        filtro.appendChild(crearFiltro(data.nombre, data.nombre));
    });
}

function crearFiltro(value, text){
    const optionTodo = document.createElement("option");
        optionTodo.value = value; // valor vacío
        optionTodo.text = text;

    return optionTodo;
}

// 5. Inicialización y Evento del Botón
document.addEventListener('DOMContentLoaded', () => {
    MostrarFiltros();
    MostrarGeneroSelected();
    // 1. Inicializar la cuadrícula con todos los productos al cargar
    // Buscar elementos del DOM ahora (seguro)
    cuadriculaProductos = document.getElementById('cuadricula-productos');
    filtroTemporada = document.getElementById('filtro-temporada');
    filtroMarca = document.getElementById('filtro-marca');
    filtroCategoria = document.getElementById('filtro-categoria');
    botonAplicarFiltros = document.getElementById('boton-aplicar-filtros');
    botonResetFiltros = document.getElementById('boton-reset-filtros');

    renderizarProductos();

    // Asignar el evento al botón de filtrar
    botonAplicarFiltros?.addEventListener('click', aplicarFiltros);

    // Evento para el botón reset: vuelve a "Todo" y muestra todos los productos
    botonResetFiltros?.addEventListener('click', () => {
        if (filtroTemporada) filtroTemporada.value = '';
        if (filtroMarca) filtroMarca.value = '';
        if (filtroCategoria) filtroCategoria.value = '';
        // Re-renderizamos todas las tarjetas y quitamos la clase oculto por si quedó alguna
        renderizarProductos();
    });

    // (Opcional) aplicar filtros al cambiar selects para experiencia en vivo
    filtroTemporada?.addEventListener('change', aplicarFiltros);
    filtroMarca?.addEventListener('change', aplicarFiltros);
    filtroCategoria?.addEventListener('change', aplicarFiltros);
});
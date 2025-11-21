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

    // Aseguramos que el precio sea válido para la visualización
    const precioNumerico = producto.precio !== null && producto.precio !== undefined ? producto.precio : 0;
    const precioFormateado = `S/.${precioNumerico.toFixed(2)}`;

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
async function MostrarGeneroSelected() {
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
async function MostrarFiltros() {
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

function crearFiltros(id, data) {
    const filtro = document.getElementById(id);
    filtro.innerHTML = ''; // Limpia la cuadrícula
    filtro.appendChild(crearFiltro("", "Todo"));
    data.forEach(data => {
        filtro.appendChild(crearFiltro(data.nombre, data.nombre));
    });
}

function crearFiltro(value, text) {
    const optionTodo = document.createElement("option");
    optionTodo.value = value; // valor vacío
    optionTodo.text = text;

    return optionTodo;
}

// 5. Inicialización y Evento del Botón
document.addEventListener('DOMContentLoaded', () => {
    // Lógica para la página de Catálogo (SeccGeneric.html)
    if (document.getElementById('cuadricula-productos')) {
        MostrarFiltros();
        MostrarGeneroSelected();

        cuadriculaProductos = document.getElementById('cuadricula-productos');
        filtroTemporada = document.getElementById('filtro-temporada');
        filtroMarca = document.getElementById('filtro-marca');
        filtroCategoria = document.getElementById('filtro-categoria');
        botonAplicarFiltros = document.getElementById('boton-aplicar-filtros');
        botonResetFiltros = document.getElementById('boton-reset-filtros');

        renderizarProductos();

        botonAplicarFiltros?.addEventListener('click', aplicarFiltros);


        botonResetFiltros?.addEventListener('click', () => {
            if (filtroTemporada) filtroTemporada.value = '';
            if (filtroMarca) filtroMarca.value = '';
            if (filtroCategoria) filtroCategoria.value = '';

            renderizarProductos();
        });


        filtroTemporada?.addEventListener('change', aplicarFiltros);
        filtroMarca?.addEventListener('change', aplicarFiltros);
        filtroCategoria?.addEventListener('change', aplicarFiltros);
    }
});


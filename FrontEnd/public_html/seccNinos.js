// 1. Datos de Productos (Simulación)
const datosProductos = [
    // Los nombres de imagen son placeholders, se recomienda usar nombres más específicos si existen.
    { id: 1, nombre: 'Casaca Niño Algodón Federation', marca: 'KIVORA', temporada: 'Invierno', categoria: 'Casacas Niño', precio: 'S/129.00', imagen: 'casaca_nino_federation.png', color: 'Gris' },
    { id: 2, nombre: 'Casaca Niño Coniglio', marca: 'KIVORA', temporada: 'Invierno', categoria: 'Casacas Niño', precio: 'S/135.00', imagen: 'casaca_nino_coniglio.png', color: 'Rojo' },
    { id: 3, nombre: 'Casaca Niño Federation', marca: 'KIVORA', temporada: 'Invierno', categoria: 'Casacas Niño', precio: 'S/115.00', imagen: 'casaca_nino_federation_2.png', color: 'Azul' },
    { id: 4, nombre: 'Chaleco Niño Coniglio', marca: 'KIVORA', temporada: 'Otoño', categoria: 'Chalecos Niño', precio: 'S/85.00', imagen: 'chaleco_nino_coniglio.png', color: 'Negro' },
    { id: 5, nombre: 'Polo Niño Algodón Doo Australia', marca: 'KIVORA', temporada: 'Verano', categoria: 'Polos Niño', precio: 'S/45.00', imagen: 'polo_nino_doo_australia.png', color: 'Blanco' },
    { id: 6, nombre: 'Polo Niño Algodón Doo Australia2', marca: 'KIVORA', temporada: 'Verano', categoria: 'Polos Niño', precio: 'S/49.00', imagen: 'polo_nino_doo_australia2.png', color: 'Verde' },
    { id: 7, nombre: 'Polo Niño Algodón Yamp', marca: 'KIVORA', temporada: 'Verano', categoria: 'Polos Niño', precio: 'S/55.00', imagen: 'polo_nino_yamp.png', color: 'Amarillo' },
    { id: 8, nombre: 'Polo Niño Coniglio', marca: 'KIVORA', temporada: 'Verano', categoria: 'Polos Niño', precio: 'S/52.00', imagen: 'polo_nino_coniglio.png', color: 'Celeste' }
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

// 5. Inicialización y Evento del Botón
document.addEventListener('DOMContentLoaded', () => {
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
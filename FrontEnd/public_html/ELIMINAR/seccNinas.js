// 1. Datos de Productos (Simulación)
const datosProductos = [
    // Los nombres de imagen son placeholders, se recomienda usar nombres más específicos si existen.
    { id: 1, nombre: 'Polo Cafarena Negro Niña 100 Algodón - Le Petit Company', marca: 'KIVORA', temporada: 'Otoño', categoria: 'Polos Unisex', precio: 'S/69.00', imagen: 'polo_cafarena_unisex.png', color: 'Negro' },
    { id: 2, nombre: 'Polo Niña Algodón Eleven', marca: 'KIVORA', temporada: 'Verano', categoria: 'Polos Niña', precio: 'S/45.00', imagen: 'polo_nina_eleven.png', color: 'Rosado' },
    { id: 3, nombre: 'Polo Niña Algodón Yamp', marca: 'KIVORA', temporada: 'Verano', categoria: 'Polos Niña', precio: 'S/49.00', imagen: 'polo_nina_yamp.png', color: 'Lila' },
    { id: 4, nombre: 'Polo Niña Eleven', marca: 'KIVORA', temporada: 'Verano', categoria: 'Polos Niña', precio: 'S/55.00', imagen: 'polo_nina_eleven_2.png', color: 'Blanco' },
    { id: 5, nombre: 'Polera Niña Algodón Eleven 3', marca: 'KIVORA', temporada: 'Invierno', categoria: 'Poleras Niña', precio: 'S/99.00', imagen: 'polera_nina_eleven_3.png', color: 'Gris oscuro' },
    { id: 6, nombre: 'Polera Niña Algodón Eleven', marca: 'KIVORA', temporada: 'Invierno', categoria: 'Poleras Niña', precio: 'S/105.00', imagen: 'polera_nina_eleven.png', color: 'Melón' },
    { id: 7, nombre: 'Polera Niña Algodón Doo Australia', marca: 'KIVORA', temporada: 'Invierno', categoria: 'Poleras Niña', precio: 'S/110.00', imagen: 'polera_nina_doo_australia.png', color: 'Fucsia' },
    { id: 8, nombre: 'Polera Niña Eleven', marca: 'KIVORA', temporada: 'Invierno', categoria: 'Poleras Niña', precio: 'S/95.00', imagen: 'polera_nina_eleven_2.png', color: 'Azul claro' }
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
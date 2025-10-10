// 1. Datos de Productos (Simulación)
const datosProductos = [
    // La imagen 'product_black.png' y 'product_white.png' son placeholders
    { id: 1, nombre: 'Camisa Oxford Slim Fit', marca: 'KIVORA', temporada: 'Verano', categoria: 'Camisas', precio: 'S/89.00', imagen: 'camisa_oxford.png', color: 'Celeste' },
    { id: 2, nombre: 'Polo Básico de Algodón', marca: 'KIVORA', temporada: 'Primavera', categoria: 'Polos', precio: 'S/59.00', imagen: 'polo_basico.png', color: 'Blanco' },
    { id: 3, nombre: 'Pantalón Chino Stretch', marca: 'KIVORA', temporada: 'Otoño', categoria: 'Pantalones', precio: 'S/119.00', imagen: 'pantalon_chino.png', color: 'Beige' },
    { id: 4, nombre: 'Casaca Denim Clásica', marca: 'KIVORA', temporada: 'Invierno', categoria: 'Casacas', precio: 'S/149.00', imagen: 'casaca_denim.png', color: 'Azul oscuro' },
    { id: 5, nombre: 'Camisa de Lino Casual', marca: 'KIVORA', temporada: 'Verano', categoria: 'Camisas', precio: 'S/99.00', imagen: 'camisa_lino.png', color: 'Blanco' },
    { id: 6, nombre: 'Polo con Cuello Redondo', marca: 'KIVORA', temporada: 'Primavera', categoria: 'Polos', precio: 'S/65.00', imagen: 'polo_redondo.png', color: 'Gris claro' },
    { id: 7, nombre: 'Pantalón Jogger Urbano', marca: 'KIVORA', temporada: 'Otoño', categoria: 'Pantalones', precio: 'S/109.00', imagen: 'pantalon_jogger.png', color: 'Negro' },
    { id: 8, nombre: 'Casaca Bomber Minimal', marca: 'KIVORA', temporada: 'Invierno', categoria: 'Casacas', precio: 'S/159.00', imagen: 'casaca_bomber.png', color: 'Verde oliva' }
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
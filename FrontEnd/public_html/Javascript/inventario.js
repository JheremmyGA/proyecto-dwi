const datosProductos = [
    { sku: '378291', nombre: 'Camiseta de algodón V-Neck XL', stock: 40 },
    { sku: '904562', nombre: 'Pantalón chino Slim Fit 34', stock: 56 },
    { sku: '125078', nombre: 'Saco de lana Herringbone L', stock: 19 },
    { sku: '639145', nombre: 'Polo de piqué Regular Fit S', stock: 79 },
    { sku: '852730', nombre: 'Vestido de flores A-Line M', stock: 19 },
    { sku: '416893', nombre: 'Blusa de seda con lazo XS', stock: 35 },
    { sku: '770514', nombre: 'Falda de mezclilla High-Waist 28', stock: 64 },
    { sku: '293687', nombre: 'Chaqueta de cuero Biker L', stock: 88 },
    { sku: '501429', nombre: 'Playera con estampado dino 8', stock: 10 }, // Stock límite (Advertencia)
    { sku: '184963', nombre: 'Sudadera con capucha y cierre 10', stock: 26 },
    { sku: '957302', nombre: 'Pijama de franela de cuadros 6', stock: 28 },
    { sku: '621058', nombre: 'Zapatillas deportivas Air Max 42', stock: 10 } // Stock límite (Advertencia)
];

// Stock máximo para mostrar advertencia (de 10 a menos)
const UMBRAL_ADVERTENCIA = 10;

// ==============================================
// LÓGICA DEL INVENTARIO (inventario.js)
// ==============================================

/**
 * Renderiza las filas de la tabla de productos a partir de los datos.
 */
function renderizarProductos(productos) {
    const cuerpoTabla = document.getElementById('cuerpo-tabla-productos');
    cuerpoTabla.innerHTML = ''; // Limpiar la tabla antes de renderizar

    productos.forEach(producto => {
        // Determinar si el producto tiene bajo stock
        const necesitaAdvertencia = producto.stock <= UMBRAL_ADVERTENCIA;
        
        // Crear la fila
        const fila = document.createElement('tr');
        
        // Contenido de la fila
        fila.innerHTML = `
            <td class="sku">${producto.sku}</td>
            <td class="nombre">${producto.nombre}</td>
            <td class="stock">
                ${producto.stock}
                ${necesitaAdvertencia ? `<i class='bx bxs-error-alt icono-advertencia' onclick="mostrarModal(this)"></i>` : ''}
            </td>
            <td class="acciones">
                <button class="boton-tabla boton-actualizar">ACTUALIZAR</button>
                <button class="boton-tabla boton-eliminar">ELIMINAR</button>
            </td>
        `;
        
        cuerpoTabla.appendChild(fila);
    });
}

/**
 * Maneja la aparición del modal de advertencia al hacer clic en el ícono.
 */
function mostrarModal(icono) {
    const modal = document.getElementById('modal-advertencia');
    modal.style.display = 'flex'; // Mostrar el modal
}

/**
 * Cierra el modal de advertencia.
 */
function cerrarModal() {
    const modal = document.getElementById('modal-advertencia');
    modal.style.display = 'none'; // Ocultar el modal
}


// ==============================================
// LÓGICA DEL MENÚ LATERAL (menu.js)
// ==============================================

/**
 * Maneja el toggle (colapsar/expandir) del menú lateral.
 */
function inicializarMenuToggle() {
    const botonToggle = document.getElementById('boton-toggle-menu');
    const menuLateral = document.getElementById('menu-lateral');
    const contenedorPrincipal = document.querySelector('.contenedor-principal');

    botonToggle.addEventListener('click', () => {
        // Toggle de la clase para colapsar/expandir el menú
        menuLateral.classList.toggle('colapsado');
        
        // Ajustar el margen del contenido principal (solo en desktop)
        if (window.innerWidth > 768) {
            if (menuLateral.classList.contains('colapsado')) {
                contenedorPrincipal.style.marginLeft = '70px';
            } else {
                contenedorPrincipal.style.marginLeft = 'var(--ancho-menu-abierto)';
            }
        } else {
            // En móviles, el menú se superpone, no se ajusta el margen
            menuLateral.classList.toggle('-translate-x-full'); // Simula ocultar/mostrar en móvil si se implementa
        }
    });

    // Ajuste inicial para el contenedor principal
    if (window.innerWidth > 768) {
            contenedorPrincipal.style.marginLeft = 'var(--ancho-menu-abierto)';
    }
}

// ==============================================
// INICIALIZACIÓN DE LA VISTA
// ==============================================
document.addEventListener('DOMContentLoaded', () => {
    renderizarProductos(datosProductos);
    inicializarMenuToggle();
});
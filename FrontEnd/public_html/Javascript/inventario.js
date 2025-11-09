// ==============================================
// DATOS DUMMY Y VARIABLES GLOBALES
// ==============================================
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
let productoSeleccionadoSKU = null; // NUEVA VARIABLE: Para guardar el SKU del producto en acción.

// ==============================================
// LÓGICA DEL INVENTARIO
// ==============================================

/**
 * Renderiza las filas de la tabla de productos a partir de los datos.
 */
function renderizarProductos(productos) {
    const cuerpoTabla = document.getElementById('cuerpo-tabla-productos');
    if (!cuerpoTabla) return; // Validación básica

    cuerpoTabla.innerHTML = ''; // Limpiar la tabla antes de renderizar

    productos.forEach(producto => {
        // Determinar si el producto tiene bajo stock
        const necesitaAdvertencia = producto.stock <= UMBRAL_ADVERTENCIA;
        
        // Crear la fila
        const fila = document.createElement('tr');
        
        // Contenido de la fila (LÍNEAS MODIFICADAS: Se añade data-sku y onclick para los nuevos modales)
        fila.innerHTML = `
            <td class="sku">${producto.sku}</td>
            <td class="nombre">${producto.nombre}</td>
            <td class="stock">
                ${producto.stock}
                ${necesitaAdvertencia ? `<i class='bx bxs-error-alt icono-advertencia' onclick="mostrarModal('modal-advertencia')"></i>` : ''}
            </td>
            <td class="acciones">
                <button class="boton-tabla boton-actualizar" data-sku="${producto.sku}" onclick="mostrarModalActualizar(this)">ACTUALIZAR</button>
                <button class="boton-tabla boton-eliminar" data-sku="${producto.sku}" onclick="mostrarModalEliminar(this)">ELIMINAR</button>
            </td>
        `;
        
        cuerpoTabla.appendChild(fila);
    });
}

/**
 * Muestra un modal por su ID. (MODIFICADA: Acepta un ID para ser genérica)
 * @param {string} idModal - ID del elemento modal a mostrar.
 */
function mostrarModal(idModal) {
    const modal = document.getElementById(idModal);
    if (modal) {
        modal.style.display = 'flex'; // Mostrar el modal
    }
}

/**
 * Cierra un modal por su ID. (MODIFICADA: Acepta un ID para ser genérica)
 * @param {string} idModal - ID del elemento modal a cerrar.
 */
function cerrarModal(idModal) {
    const modal = document.getElementById(idModal);
    if (modal) {
        modal.style.display = 'none'; // Ocultar el modal
    }
}


// ==============================================
// NUEVAS FUNCIONES DE MODAL ESPECÍFICO
// ==============================================

/**
 * NUEVA FUNCIÓN: Muestra el modal de Actualizar Producto, precargando los datos.
 * @param {HTMLElement} boton - El botón que disparó el evento (contiene data-sku).
 */
function mostrarModalActualizar(boton) {
    const sku = boton.getAttribute('data-sku');
    const producto = datosProductos.find(p => p.sku === sku);
    
    if (producto) {
        productoSeleccionadoSKU = sku; // Guarda el SKU para su uso posterior en la actualización
        
        // Cargar datos en el formulario del modal
        document.getElementById('update-sku').value = producto.sku;
        document.getElementById('update-nombre').value = producto.nombre;
        document.getElementById('update-stock').value = producto.stock;
        
        mostrarModal('modal-actualizar');
    }
}

/**
 * NUEVA FUNCIÓN: Muestra el modal de Confirmación de Eliminación.
 * @param {HTMLElement} boton - El botón que disparó el evento (contiene data-sku).
 */
function mostrarModalEliminar(boton) {
    const sku = boton.getAttribute('data-sku');
    const producto = datosProductos.find(p => p.sku === sku);
    
    if (producto) {
        productoSeleccionadoSKU = sku; // Guarda el SKU para su uso posterior en la eliminación
        // Actualiza el nombre del producto en el texto del modal
        document.getElementById('nombre-producto-eliminar').textContent = producto.nombre; 
        mostrarModal('modal-eliminar');
    }
}

/**
 * NUEVA FUNCIÓN: Maneja el envío del formulario de actualización (simulado).
 * Se llama desde el event listener del formulario.
 */
function manejarActualizacion(evento) {
    evento.preventDefault();
    
    const sku = document.getElementById('update-sku').value;
    // Asegura que el stock sea un número entero
    const nuevoStock = parseInt(document.getElementById('update-stock').value);
    if (isNaN(nuevoStock) || nuevoStock < 0) {
        alert('Por favor ingresa un valor numérico válido para el stock (0 o mayor).');
        return false;
    }
    
    // Buscar y actualizar el producto en los datos dummy
    const indice = datosProductos.findIndex(p => p.sku === sku);
    if (indice !== -1) {
        datosProductos[indice].stock = nuevoStock;
        
        console.log(`Producto ${sku} actualizado a stock: ${nuevoStock}`);
        cerrarModal('modal-actualizar');
        renderizarProductos(datosProductos); // Refrescar la tabla con los nuevos datos
    } else {
        console.error("Error: Producto no encontrado.");
    }
    return false;
}

/**
 * NUEVA FUNCIÓN: Simula la ejecución de la eliminación del producto.
 * Se llama al presionar 'Aceptar' en el modal de eliminación.
 */
function ejecutarEliminacion() {
    if (productoSeleccionadoSKU) {
        // Encontrar el índice del producto por su SKU
        const indice = datosProductos.findIndex(p => p.sku === productoSeleccionadoSKU);
        if (indice !== -1) {
            // Eliminar el producto del array usando splice
            datosProductos.splice(indice, 1);
            
            console.log(`Producto ${productoSeleccionadoSKU} eliminado.`);
            cerrarModal('modal-eliminar');
            renderizarProductos(datosProductos); // Refrescar la tabla
        } else {
            console.error("Error: Producto no encontrado durante la eliminación.");
        }
    }
}


// ==============================================
// LÓGICA DEL MENÚ LATERAL (menu.js - Sin cambios funcionales)
// ==============================================

/**
 * Maneja el toggle (colapsar/expandir) del menú lateral.
 */
function inicializarMenuToggle() {
    const botonToggle = document.getElementById('boton-toggle-menu');
    const menuLateral = document.getElementById('menu-lateral') || document.querySelector('.menu-dashboard');
    const contenedorPrincipal = document.querySelector('.contenedor-principal');

    // Si no existe el botón toggle, no hacemos nada (evita errores en páginas que no lo tienen)
    if (!botonToggle || !menuLateral) {
        // Aplicar ajuste inicial si existe contenedorPrincipal y menuLateral tiene ancho por CSS
        if (contenedorPrincipal && window.innerWidth > 768) {
            contenedorPrincipal.style.marginLeft = 'var(--ancho-menu-abierto)';
        }
        return;
    }

    botonToggle.addEventListener('click', () => {
        // Toggle de la clase para colapsar/expandir el menú
        menuLateral.classList.toggle('colapsado');
        
        // Ajustar el margen del contenido principal (solo en desktop)
        if (window.innerWidth > 768) {
            if (menuLateral.classList.contains('colapsado')) {
                if (contenedorPrincipal) contenedorPrincipal.style.marginLeft = '70px';
            } else {
                if (contenedorPrincipal) contenedorPrincipal.style.marginLeft = 'var(--ancho-menu-abierto)';
            }
        } else {
            // En móviles, el menú se superpone, no se ajusta el margen
            menuLateral.classList.toggle('-translate-x-full'); // Simula ocultar/mostrar en móvil si se implementa
        }
    });

    // Ajuste inicial para el contenedor principal
    if (contenedorPrincipal && window.innerWidth > 768) {
         contenedorPrincipal.style.marginLeft = 'var(--ancho-menu-abierto)';
    }
}

// ==============================================
// INICIALIZACIÓN DE LA VISTA (MODIFICADA: Agrega listener al formulario)
// ==============================================
document.addEventListener('DOMContentLoaded', () => {
    // Renderizar la tabla de productos
    renderizarProductos(datosProductos);
    
    // Inicializar el reloj (si la tienes fuera de la inicialización de menú)
    // updateDateTime();
    // setInterval(updateDateTime, 1000); 
    
    inicializarMenuToggle();

    // NUEVA LÍNEA: Asignar el manejador de eventos al formulario de actualización
    const formActualizar = document.getElementById('formulario-actualizar');
    if (formActualizar) {
        formActualizar.addEventListener('submit', manejarActualizacion);
    }
});
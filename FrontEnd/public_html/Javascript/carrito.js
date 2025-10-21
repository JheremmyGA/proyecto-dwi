// ============ Variables Globales ============
const listaCarrito = document.querySelector("#lista-carrito tbody");
// Estos elementos existen en carrito.html
const vaciarCarritoBtn = document.getElementById("vaciar-carrito"); 
const btnCheckout = document.getElementById('img-carrito'); 

// Nuevo elemento para el contador en el header (debe existir en index.html y otras páginas)
const contadorCarrito = document.getElementById('contador-carrito'); 

let articulosCarrito = []; 

// Modales de Pago
const modalPago = document.getElementById('modal-pago');
const cerrarModalPago = document.getElementById('cerrar-modal'); 
const formularioPago = document.getElementById('formulario-pago');


// ============ FUNCIONES DE PERSISTENCIA ============

function guardarCarrito() {
    localStorage.setItem('articulosCarrito', JSON.stringify(articulosCarrito));
}

function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('articulosCarrito');
    articulosCarrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];
}

// ============ FUNCIONES DE CONTADOR ============

/**
 * Calcula el número total de ítems (sumando cantidades) y actualiza el icono.
 */
function actualizarContadorCarrito() {
    if (!contadorCarrito) return; // Salir si el elemento no existe

    // Calcula el total sumando la propiedad 'cantidad' de todos los artículos
    const totalItems = articulosCarrito.reduce((total, articulo) => {
        return total + (parseInt(articulo.cantidad) || 0); 
    }, 0);

    // Muestra/Oculta el contador y actualiza el valor
    if (totalItems > 0) {
        contadorCarrito.textContent = totalItems;
        contadorCarrito.style.display = 'block'; 
    } else {
        contadorCarrito.textContent = 0;
        contadorCarrito.style.display = 'none'; 
    }
}


// ============ Funciones del Carrito ============

/**
 * Agrega un producto al carrito.
 */
function agregarProductoAlCarrito(e) {
    // Permitir la ejecución si es el botón de detalle de producto ('agregarCarrito') 
    // O si tiene la clase que usas en otras páginas ('agregar-carrito').
    if (e.target.classList.contains('agregar-carrito') || e.target.id === 'agregarCarrito') {
        
        e.preventDefault(); 
        
        const btn = e.target;
        let infoProducto = {};

        // Lógica para obtener los datos.
        // Si el evento tiene una propiedad 'detail' (usado en llamadas directas o eventos custom)
        if (e.detail && e.detail.producto) {
            infoProducto = e.detail.producto;
        } else {
             // Caso por defecto (productos de catálogo/carrusel que usan data-attributes)
            // Esto cubre tanto el fakeEvent de detalle_producto_prenda.js como los botones de catálogo
            infoProducto = {
                imagen: btn.getAttribute("data-imagen"),
                nombre: btn.getAttribute("data-nombre"),
                precio: btn.getAttribute("data-precio"),
                id: btn.getAttribute("data-id"),
                // Si viene del detalle, data-cantidad existe. Si viene de catálogo, será null o 1 (se usa 1 por defecto)
                cantidad: parseInt(btn.getAttribute("data-cantidad")) || 1 
            };
        }
        
        // Convertir el precio a float (es importante para que los cálculos sean correctos)
        const precioLimpio = String(infoProducto.precio).replace('S/.', '').trim();
        infoProducto.precio = parseFloat(precioLimpio);

        // Si vienes de la página de detalle y no se configuró bien la llamada:
        if (!infoProducto.id || !infoProducto.nombre || isNaN(infoProducto.precio)) {
            console.error("No se pudo obtener la información completa del producto.");
            alert("Error: No se pudo agregar el producto. Información incompleta o precio inválido.");
            return;
        }

        // El resto de la lógica de sumar/añadir se mantiene:
        const existe = articulosCarrito.some(articulo => articulo.id === infoProducto.id);
        
        if (existe) {
            articulosCarrito = articulosCarrito.map(articulo => {
                if (articulo.id === infoProducto.id) {
                    // Sumar la cantidad proporcionada (en detalle es selectedQuantity)
                    articulo.cantidad += (infoProducto.cantidad || 1); 
                }
                return articulo;
            });
        } else {
            // Asegurarse de que el nuevo producto tiene una cantidad.
            infoProducto.cantidad = infoProducto.cantidad || 1; 
            articulosCarrito = [...articulosCarrito, infoProducto];
        }

        guardarCarrito(); // GUARDAR en localStorage
        carritoHTML(); // Llamar a esto para actualizar el mini-carrito en la misma página
        actualizarContadorCarrito(); // <--- ACTUALIZAR CONTADOR
        alert(`"${infoProducto.nombre}" agregado al carrito.`);
    }
}


/**
 * Elimina un producto del carrito.
 */
function eliminarProducto(e) {
    if (e.target.classList.contains("eliminar-producto") || e.target.classList.contains("borrar-curso")) {
        e.preventDefault();
        const productoId = e.target.getAttribute('data-id');
        
        articulosCarrito = articulosCarrito.filter(articulo => articulo.id !== productoId);

        guardarCarrito();
        carritoHTML();
        actualizarContadorCarrito(); // <--- ACTUALIZAR CONTADOR
    }
}

/**
 * Actualiza la cantidad de un artículo y recalcula.
 */
function actualizarCantidad(e) {
    if (e.target.classList.contains('cantidad-producto')) {
        const input = e.target;
        const productoId = input.getAttribute('data-id');
        let nuevaCantidad = parseInt(input.value);

        if (isNaN(nuevaCantidad) || nuevaCantidad < 1) {
            nuevaCantidad = 1;
            input.value = 1; 
        }

        articulosCarrito = articulosCarrito.map(articulo => {
            if (articulo.id === productoId) {
                articulo.cantidad = nuevaCantidad;
            }
            return articulo;
        });

        guardarCarrito();
        carritoHTML();
        actualizarContadorCarrito(); // <--- ACTUALIZAR CONTADOR
    }
}


/**
 * Genera el HTML del carrito basándose en el array articulosCarrito.
 */
function carritoHTML() {
    if (!listaCarrito) return; 

    vaciarCarritoDOM(); 

    let totalCompra = 0; 
    
    articulosCarrito.forEach(articulo => {
        // Manejamos el caso de que el precio pueda venir sin formato 'S/. '
        const precioStr = String(articulo.precio).replace('S/. ', '').trim();
        const precioUnitario = parseFloat(precioStr);
        
        if (isNaN(precioUnitario)) {
            console.error(`Precio inválido para el producto ID ${articulo.id}: ${articulo.precio}`);
            return; 
        }
        
        const subtotal = (precioUnitario * articulo.cantidad).toFixed(2);
        totalCompra += parseFloat(subtotal);

        const row = document.createElement('tr');
        row.setAttribute("data-id", articulo.id);
        row.innerHTML = `
            <td><img src="${articulo.imagen}" width="80" height="60" style="object-fit: cover;"></td>
            <td>${articulo.nombre}</td>
            <td class="precio-subtotal">S/. ${subtotal}</td>
            <td>
                <input 
                    type="number" 
                    min="1" 
                    value="${articulo.cantidad}" 
                    class="cantidad-producto" 
                    data-id="${articulo.id}" 
                    style="width: 60px; text-align: center;"
                >
            </td>
            <td><a href="#" class="eliminar-producto" data-id="${articulo.id}">X</a></td>
        `;
        listaCarrito.appendChild(row);
    });
    
    const totalFinalElement = document.getElementById('total-final');
    if (totalFinalElement) {
        totalFinalElement.textContent = `S/. ${totalCompra.toFixed(2)}`;
    }
}

/**
 * Vacía el contenido del carrito en el DOM.
 */
function vaciarCarritoDOM() {
    while (listaCarrito && listaCarrito.firstChild) {
        listaCarrito.removeChild(listaCarrito.firstChild);
    }
}

/**
 * Vacía el array de artículos y el DOM.
 */
function vaciarCarrito() {
    articulosCarrito = []; 
    guardarCarrito();
    carritoHTML();
    actualizarContadorCarrito(); // <--- ACTUALIZAR CONTADOR
    alert("Se ha vaciado el carrito.");
}


// ============ Funciones de Pago ============

function realizarPago(e) {
    e.preventDefault();
    const metodo = document.querySelector('input[name="metodo"]:checked');
    const tarjeta = document.getElementById('numero-tarjeta').value.trim();

    if (metodo && tarjeta !== "") {
        alert("¡Tu compra está realizada! Redirigiendo a inicio...");
        modalPago.style.display = 'none';
        formularioPago.reset();
        vaciarCarrito(); // Vacía el carrito después de la compra exitosa
        window.location.href = "index.html";
    } else {
        alert("Por favor, selecciona un método y escribe un número de tarjeta.");
    }
}

// ============ Expose Functions Globally ============
window.agregarProductoAlCarrito = agregarProductoAlCarrito;
window.eliminarProducto = eliminarProducto;
window.vaciarCarrito = vaciarCarrito;
window.carritoHTML = carritoHTML;
window.actualizarCantidad = actualizarCantidad;
// Exponer la función de actualización del contador globalmente si es necesario
window.actualizarContadorCarrito = actualizarContadorCarrito; 

// ============ Initialization ============
document.addEventListener('DOMContentLoaded', () => {
    // Load carrito from localStorage
    cargarCarrito();
    actualizarContadorCarrito(); // LLAMADA INICIAL al cargar la página

    // Check if carrito elements exist before initializing
    if (listaCarrito) {
        carritoHTML();
        listaCarrito.addEventListener("click", eliminarProducto);
        listaCarrito.addEventListener('change', actualizarCantidad);
        vaciarCarritoBtn?.addEventListener('click', vaciarCarrito);
    }

    // CORRECCIÓN CLAVE: Restablecer listener para los botones de catálogo/inicio.

    document.body.addEventListener('click', (e) => {
         if (e.target.classList.contains('agregar-carrito')) {
            agregarProductoAlCarrito(e);
         }
    });

    // Initialize modal-related events if modal elements exist
    if (btnCheckout && modalPago && cerrarModalPago) {
        btnCheckout.addEventListener('click', () => {
            if (articulosCarrito.length > 0) {
                modalPago.style.display = 'flex';
            } else {
                alert("El carrito está vacío. Agrega productos para pagar.");
            }
        });

        cerrarModalPago.addEventListener('click', () => {
            modalPago.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modalPago) {
                modalPago.style.display = 'none';
            }
        });

        formularioPago?.addEventListener('submit', realizarPago);
    }

    // ============ Add Event Listener for Carrito Icon ============
    // Asumo que el ícono principal del carrito tiene el ID 'carrito-icono'
    const carritoIcono = document.getElementById('carrito-icono'); 

    if (carritoIcono) {
        carritoIcono.addEventListener('click', (e) => {
            e.preventDefault(); 
            window.location.href = 'carrito.html'; 
        });
    }
});





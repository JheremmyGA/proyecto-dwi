// ============ Variables Globales ============
const listaCarrito = document.querySelector("#lista-carrito tbody");
// Estos elementos existen en carrito.html
const vaciarCarritoBtn = document.getElementById("vaciar-carrito"); 
const btnCheckout = document.getElementById('img-carrito'); 

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


// ============ Funciones del Carrito ============

/**
 * Agrega un producto al carrito.
 */
function agregarProductoAlCarrito(e) {
    if (e.target.classList.contains('agregar-carrito')) {
        // *** CORRECCIÓN CLAVE: Prevenir el comportamiento por defecto (el salto a #) ***
        e.preventDefault(); 
        
        const btn = e.target;
        
        // Lee los data-attributes del elemento clickeado (enlace de carrusel o botón de modal)
        const infoProducto = {
            imagen: btn.getAttribute("data-imagen"),
            nombre: btn.getAttribute("data-nombre"),
            precio: btn.getAttribute("data-precio"),
            id: btn.getAttribute("data-id"),
            cantidad: 1
        };

        if (!infoProducto.id || !infoProducto.nombre || !infoProducto.precio) {
            console.error("No se pudo obtener la información completa del producto/curso.");
            alert("Error: No se pudo agregar el producto. Información incompleta.");
            return;
        }

        const existe = articulosCarrito.some(articulo => articulo.id === infoProducto.id);
        
        if (existe) {
            articulosCarrito = articulosCarrito.map(articulo => {
                if (articulo.id === infoProducto.id) {
                    articulo.cantidad++;
                }
                return articulo;
            });
        } else {
            articulosCarrito = [...articulosCarrito, infoProducto];
        }

        guardarCarrito(); // GUARDAR en localStorage
        alert(`"${infoProducto.nombre}" agregado al carrito. Ve a carrito.html para revisar.`);
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

// ============ Improved Initialization ============
document.addEventListener('DOMContentLoaded', () => {
    // Load carrito from localStorage
    cargarCarrito();

    // Check if carrito elements exist before initializing
    if (listaCarrito) {
        carritoHTML();
        listaCarrito.addEventListener("click", eliminarProducto);
        listaCarrito.addEventListener('change', actualizarCantidad);
        vaciarCarritoBtn?.addEventListener('click', vaciarCarrito);
    }

    // Add global event listener for adding products
    document.body.addEventListener('click', agregarProductoAlCarrito);

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
    const carritoIcono = document.getElementById('carrito-icono');

    if (carritoIcono) {
        carritoIcono.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default link behavior
            window.location.href = 'carrito.html'; // Redirect to carrito.html
        });
    }
});
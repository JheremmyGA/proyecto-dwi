import * as HTTPS_Request from '../Utils/HTTPRequest.js';
import * as PERSISTENT_DATA from '../Utils/PersistentData.js';

// --- DATOS SIMULADOS PARA SECCIONES INFERIORES ---
const productosPrueba = [
    { nombre: "Loose Jeans", marca: "Basement", precio: 12.00, imagen: "imagenes/hombre/Poleras/Poleron Doo.png" },
    { nombre: "Chaleco de traje", marca: "Basement", precio: 12.00, imagen: "imagenes/mujer/Polo/Polo Casual Mujer Sybilla.png"},
    { nombre: "Casaca en lona de algodón", marca: "Basement", precio: 12.00, imagen: "imagenes/hombre/Poleras/Poleron Doo.png" },
    { nombre: "Zapatos Derby", marca: "Basement", precio: 12.00, imagen: "imagenes/mujer/Polo/Polo Casual Mujer Sybilla.png" }
];

const productData = {
    imagenes: {
        Negro: "imagenes/hombre/Polo/Polo Petit Piqué Hombre Lacoste.png",
        Blanco: "imagenes/mujer/Polo/Polo Casual Mujer Sybilla.png",
    }
};


// --- ESTADO GLOBAL ---
let selectedColor;
let selectedSize;
let selectedQuantity = 1;
let detalleProducto;


async function MostrarDetalleProducto(){

    detalleProducto = await HTTPS_Request.GetDetalleProducto(PERSISTENT_DATA.GetSelectedProductDetails());
    if (!detalleProducto) return;
    
    // Asegurarse de que detalleProducto.id exista
    if (!detalleProducto.id) {
         detalleProducto.id = 'prod-' + Date.now().toString(); // Asigna un ID temporal si no existe
    }

    selectedColor = detalleProducto.tallasColores[0].color;
    selectedSize = detalleProducto.tallasColores[0].talla;

    // Encabezado y precio
    const nameEl = document.getElementById('product-name');
    const brandEl = document.getElementById('product-brand');
    const priceEl = document.getElementById('product-price');

    if (nameEl) nameEl.textContent = detalleProducto.nombre;
    if (brandEl) brandEl.textContent = detalleProducto.marca;
    if (priceEl) priceEl.textContent = `S/ ${detalleProducto.precio.toFixed(2)}`;

    renderCurrentColorTitle();
    renderColorSelector();
    updateMainImage(productData.imagenes[selectedColor]);
    renderSizeButtons();
    updateStockDisplay();
    updateQuantityButtons();
}

function MostrarVistaProductos() {
    
    // Secciones inferiores
    renderProductosPrueba('loMasVendidos', productosPrueba);
    renderProductosPrueba('liquidacion', productosPrueba);

    // Selectores y UI
    const selColorEl = document.getElementById('selected-color-name');
    if (selColorEl) selColorEl.textContent = selectedColor;
}

/* Color selector */
function renderColorSelector() {
    const colorSwatchesDiv = document.getElementById('color-swatches');
    if (!colorSwatchesDiv) return;
    colorSwatchesDiv.innerHTML = '';

    const uniqueColors = [...new Set(detalleProducto.tallasColores.map(item => item.color))];

    uniqueColors.forEach(color => {
        const colorHex = color === 'Negro' ? '000000' : 'FFFFFF';
        const textColor = color === 'Negro' ? 'FFFFFF' : '000000';
        const swatch = document.createElement('img');

        swatch.alt = color;
        swatch.className = `swatch-color w-10 h-10 rounded-full border-2 transition-all cursor-pointer ${color === selectedColor ? 'border-red-600 shadow-md' : 'border-gray-300'}`;
        swatch.src = `https://placehold.co/40x40/${colorHex}/${textColor}?text=`;

        swatch.onclick = () => handleColorChange(color);
        colorSwatchesDiv.appendChild(swatch);
    });
}


function renderSizeButtons() {
    const sizeButtonsDiv = document.getElementById('size-buttons');
    if (!sizeButtonsDiv) return;
    sizeButtonsDiv.innerHTML = '';

    const allSizes = [...new Set(detalleProducto.tallasColores.map(item => item.talla))];
    const colorOptions = detalleProducto.tallasColores.filter(item => item.color === selectedColor);

    allSizes.forEach(talla => {
        const option = colorOptions.find(item => item.talla === talla);
        const stock = option ? option.stock : 0;
        const isDisabled = stock === 0;

        const button = document.createElement('button');
        button.textContent = talla;
        let buttonClass = `size-button ${talla === selectedSize ? 'selected talla-seleccionada' : 'border-gray-300'} ${isDisabled ? 'disabled' : ''}`;
        
        button.className = buttonClass;
        button.disabled = isDisabled;

        button.onclick = () => {
            if (!isDisabled) {
                handleSizeChange(talla);
            }
        };

        sizeButtonsDiv.appendChild(button);
    });

    const currentOption = colorOptions.find(item => item.talla === selectedSize);
    if (!currentOption || currentOption.stock === 0) {
           const firstAvailableOption = colorOptions.find(item => item.stock > 0);
           if (firstAvailableOption) {
             selectedSize = firstAvailableOption.talla;
           } else {
             selectedSize = '';
           }
           renderSizeButtons();
    }
}

/* Stock display and add-to-cart state */
function updateStockDisplay() {
    const currentOption = detalleProducto.tallasColores.find(item =>
        item.color === selectedColor && item.talla === selectedSize
    );
    const stock = currentOption ? currentOption.stock : 0;

    const stockEl = document.getElementById('stock-disponible');
    if (stockEl) {
        stockEl.textContent = stock;
        stockEl.className = `font-bold ${stock > 0 ? 'text-green-600' : 'text-red-600'}`;
    }

    const agregarCarrito = document.getElementById('agregarCarrito');
    if (agregarCarrito) {
        if (stock > 0) {
            agregarCarrito.disabled = false;
            agregarCarrito.textContent = 'Añadir al carrito';
        } else {
            agregarCarrito.disabled = true;
            agregarCarrito.textContent = 'Agotado';
        }
    }

    // Reset quantity and controls
    selectedQuantity = 1;
    const qtyInput = document.getElementById('cantidad-seleccionada');
    if (qtyInput) qtyInput.value = selectedQuantity;
    updateQuantityButtons();
}

/* Handlers */
function handleColorChange(newColor) {
    if (newColor === selectedColor) return;
    selectedColor = newColor;

    const newImageUrl = productData.imagenes[newColor];
    updateMainImage(newImageUrl);
    renderCurrentColorTitle();
    renderColorSelector();
    renderSizeButtons();
    updateStockDisplay();
}

function renderCurrentColorTitle(){
    const selColorEl = document.getElementById('selected-color-name');
    if (selColorEl) selColorEl.textContent = selectedColor;

}

function handleSizeChange(newSize) {
    selectedSize = newSize;
    renderSizeButtons();
    updateStockDisplay();
}

function handleQuantityChange(change) {
    const currentOption = detalleProducto.tallasColores.find(item =>
        item.color === selectedColor && item.talla === selectedSize
    );
    const maxStock = currentOption ? currentOption.stock : 0;

    let newQuantity = selectedQuantity + change;

    if (newQuantity < 1) newQuantity = 1;
    else if (newQuantity > maxStock) newQuantity = maxStock;

    selectedQuantity = newQuantity;
    const qtyInput = document.getElementById('cantidad-seleccionada');
    if (qtyInput) qtyInput.value = selectedQuantity;
    updateQuantityButtons(maxStock);
}

function updateQuantityButtons(maxStock) {
    const stockVal = (typeof maxStock === 'number' && maxStock >= 0) ? maxStock : parseInt(document.getElementById('stock-disponible')?.textContent || '0', 10);
    const btnDecrement = document.getElementById('btn-decremento');
    const btnIncrement = document.getElementById('btn-incremento');

    if (btnDecrement) btnDecrement.disabled = selectedQuantity <= 1;
    if (btnIncrement) btnIncrement.disabled = selectedQuantity >= stockVal || stockVal === 0;
}

function updateMainImage(newUrl) {
    const mainImage = document.getElementById('imagen-producto-principal');
    if (mainImage && newUrl) mainImage.src = newUrl;
}


function renderProductosPrueba(containerId, products) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    products.forEach(product => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'contenedor-prendas';
        tarjeta.innerHTML = `
            <img src="${product.imagen}" alt="${product.nombre}">
                <p class="precio">S/ ${product.precio.toFixed(2)}</p>
            <p class="nombre">${product.nombre}</p>
            <p class="marca">${product.marca}</p>
        `;
        container.appendChild(tarjeta);
    });
}

/* Simple redirect util kept as in original */
function redirigir(nombre) {
    window.location.href = nombre;
}

/* Expose certain functions to window so inline onclick works (keeps compatibility) */
window.handleQuantityChange = handleQuantityChange;
window.handleSizeChange = handleSizeChange;
window.handleColorChange = handleColorChange;
window.redirigir = redirigir;

/* Initialize when DOM ready */
document.addEventListener('DOMContentLoaded', ()=>{
    
    // --- Carga inicial de datos (Se ejecuta solo una vez al inicio) ---
    MostrarDetalleProducto();
    MostrarVistaProductos();
    
    // --- LÓGICA DE AÑADIR AL CARRITO CORREGIDA ---
    const botonAgregar = document.getElementById('agregarCarrito');
    if (botonAgregar) {
        botonAgregar.addEventListener('click', (e) => {
            // CORRECCIÓN CLAVE 1: Detener la propagación para evitar doble ejecución
            e.stopPropagation(); 
            e.preventDefault();

            if (!detalleProducto) {
                alert("Error: Datos del producto no cargados. Inténtalo de nuevo.");
                return;
            }

            // Validación de la variante actual seleccionada
            const currentOption = detalleProducto.tallasColores.find(item =>
                item.color === selectedColor && item.talla === selectedSize
            );
            
            if (!currentOption || selectedQuantity < 1) {
                alert("Por favor, selecciona una talla y un color disponibles, e ingresa una cantidad válida.");
                return;
            }
            
            // 1. Crear la información del producto con variante
            const infoProducto = {
                // Generar un ID ÚNICO por variante
                id: `${detalleProducto.id || 'p'}-${selectedSize}-${selectedColor}`, 
                
                // Incluir la variante en el nombre para mostrar en el carrito
                nombre: `${detalleProducto.nombre} - ${selectedColor} (${selectedSize})`, 
                
                // Precio como cadena formateada (o número) para que lo maneje carrito.js
                precio: detalleProducto.precio.toFixed(2), 
                
                imagen: productData.imagenes[selectedColor], 
                cantidad: selectedQuantity,
            };

            // 2. Simular el objeto de evento (fakeEvent) con los 'data-attributes' que carrito.js espera.
            const fakeEvent = {
                target: {
                    // CLASES y ID DE BOTÓN: Esencial para que carrito.js ejecute la función
                    classList: { contains: (cls) => cls === 'agregar-carrito' }, 
                    id: 'agregarCarrito', 
                    
                    // Los atributos que lee la función en carrito.js
                    getAttribute: (attr) => {
                        switch (attr) {
                            case 'data-imagen': return infoProducto.imagen;
                            case 'data-nombre': return infoProducto.nombre;
                            case 'data-precio': return infoProducto.precio;
                            case 'data-id': return infoProducto.id;
                            case 'data-cantidad': return infoProducto.cantidad.toString();
                            default: return null;
                        }
                    }
                },
                preventDefault: () => {}
            };
            
            // 3. Llamar a la función global del carrito
            if (typeof window.agregarProductoAlCarrito === 'function') {
                window.agregarProductoAlCarrito(fakeEvent); 
                
                // 🔥 CORRECCIÓN CLAVE 2: Forzar la actualización del contador en la pestaña de detalle
                if (typeof window.actualizarContadorCarrito === 'function') {
                    window.actualizarContadorCarrito();
                }
                
            } else {
                console.error("La función agregarProductoAlCarrito no está disponible globalmente. Asegúrate de que carrito.js se cargue correctamente.");
            }
        });
    }
});


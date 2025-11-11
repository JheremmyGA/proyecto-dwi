// ==============================================
// DATOS DUMMY Y VARIABLES GLOBALES
// ==============================================
const datosProductos = [
    { sku: '378291', nombre: 'Camiseta de algodón V-Neck', marca: 'Nike', temporada: 'Verano', categoria: 'Camisetas', precio: 49.99, talla: 'XL', color: 'Blanco', cantidad: 40, ruta: 'imagenes/camiseta-blanca-xl.jpg' },
    { sku: '904562', nombre: 'Pantalón chino Slim Fit', marca: 'Dockers', temporada: 'Invierno', categoria: 'Pantalones', precio: 89.99, talla: '34', color: 'Gris', cantidad: 56, ruta: 'imagenes/pantalon-gris-34.jpg' },
    { sku: '125078', nombre: 'Saco de lana Herringbone', marca: 'Hugo Boss', temporada: 'Invierno', categoria: 'Sacos', precio: 199.99, talla: 'L', color: 'Marrón', cantidad: 19, ruta: 'imagenes/saco-marron-l.jpg' },
    { sku: '639145', nombre: 'Polo de piqué Regular Fit', marca: 'Lacoste', temporada: 'Verano', categoria: 'Polos', precio: 79.99, talla: 'S', color: 'Verde', cantidad: 79, ruta: 'imagenes/polo-verde-s.jpg' },
    { sku: '852730', nombre: 'Vestido de flores A-Line', marca: 'Zara', temporada: 'Primavera', categoria: 'Vestidos', precio: 59.99, talla: 'M', color: 'Multicolor', cantidad: 19, ruta: 'imagenes/vestido-flores-m.jpg' },
    { sku: '416893', nombre: 'Blusa de seda con lazo', marca: 'Calvin Klein', temporada: 'Primavera', categoria: 'Blusas', precio: 69.99, talla: 'XS', color: 'Rosa', cantidad: 35, ruta: 'imagenes/blusa-rosa-xs.jpg' },
    { sku: '770514', nombre: 'Falda de mezclilla High-Waist', marca: 'Levi\'s', temporada: 'Verano', categoria: 'Faldas', precio: 44.99, talla: '28', color: 'Azul Oscuro', cantidad: 64, ruta: 'imagenes/falda-azul-28.jpg' },
    { sku: '293687', nombre: 'Chaqueta de cuero Biker', marca: 'Harley Davidson', temporada: 'Invierno', categoria: 'Chaquetas', precio: 299.99, talla: 'L', color: 'Negro', cantidad: 88, ruta: 'imagenes/chaqueta-negra-l.jpg' },
    { sku: '501429', nombre: 'Playera con estampado dino', marca: 'Disney', temporada: 'Verano', categoria: 'Playeras Niños', precio: 19.99, talla: '8', color: 'Verde', cantidad: 10, ruta: 'imagenes/playera-dino-8.jpg' },
    { sku: '184963', nombre: 'Sudadera con capucha y cierre', marca: 'Adidas', temporada: 'Invierno', categoria: 'Sudaderas', precio: 89.99, talla: '10', color: 'Gris', cantidad: 26, ruta: 'imagenes/sudadera-gris-10.jpg' },
    { sku: '957302', nombre: 'Pijama de franela de cuadros', marca: 'Hanes', temporada: 'Invierno', categoria: 'Pijamas', precio: 39.99, talla: '6', color: 'Azul/Blanco', cantidad: 28, ruta: 'imagenes/pijama-cuadros-6.jpg' },
    { sku: '621058', nombre: 'Polo deportivas Air Max', marca: 'Nike', temporada: 'Verano', categoria: 'Polos', precio: 59.99, talla: 'M', color: 'Negro', cantidad: 12, ruta: 'imagenes/polo-negro-m.jpg' },
    { sku: '917302', nombre: 'Pijama de franela de cuadros', marca: 'Hanes', temporada: 'Invierno', categoria: 'Pijamas', precio: 39.99, talla: '6', color: 'Rojo/Blanco', cantidad: 28, ruta: 'imagenes/pijama-rojo-6.jpg' },
    { sku: '911058', nombre: 'Pantalones deportivas', marca: 'Puma', temporada: 'Verano', categoria: 'Pantalones', precio: 49.99, talla: 'S', color: 'Azul', cantidad: 15, ruta: 'imagenes/pantalones-azul-s.jpg' }
];

// Stock máximo para mostrar advertencia (de 10 a menos)
const UMBRAL_ADVERTENCIA = 10;
let productoSeleccionadoSKU = null; // Para guardar el SKU del producto seleccionado

// ==============================================
// LÓGICA DEL INVENTARIO
// ==============================================

function renderizarProductos(productos) {
    const cuerpoTabla = document.getElementById('cuerpo-tabla-productos');
    if (!cuerpoTabla) return;

    cuerpoTabla.innerHTML = '';

    productos.forEach(producto => {
        const necesitaAdvertencia = producto.cantidad <= UMBRAL_ADVERTENCIA;

        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td class="sku">${producto.sku}</td>
            <td class="nombre">${producto.nombre}</td>
            <td class="stock">
                ${producto.cantidad}
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

// ==============================================
// FUNCIONES DE MODALES
// ==============================================
function mostrarModal(idModal) {
    const modal = document.getElementById(idModal);
    if (modal) modal.classList.add('mostrar');
}

function cerrarModal(idModal) {
    const modal = document.getElementById(idModal);
    if (modal) modal.classList.remove('mostrar');
}

// ==============================================
// MODALES DE ACTUALIZAR Y ELIMINAR
// ==============================================
function mostrarModalActualizar(boton) {
    const sku = boton.getAttribute('data-sku');
    const producto = datosProductos.find(p => p.sku === sku);

    if (producto) {
        productoSeleccionadoSKU = sku;
        
        // Llenar campos informativos (readonly)
        document.getElementById('update-nombre').value = producto.nombre || '';
        document.getElementById('update-marca').value = producto.marca || '';
        document.getElementById('update-temporada').value = producto.temporada || '';
        document.getElementById('update-categoria').value = producto.categoria || '';
        document.getElementById('update-precio').value = producto.precio || '';
        document.getElementById('update-sku').value = producto.sku || '';
        document.getElementById('update-talla').value = producto.talla || '';
        document.getElementById('update-color').value = producto.color || '';
        
        // Campo editable: Cantidad
        document.getElementById('update-cantidad').value = producto.cantidad || 0;
        
        mostrarModal('modal-actualizar');
    }
}

function mostrarModalEliminar(boton) {
    const sku = boton.getAttribute('data-sku');
    const producto = datosProductos.find(p => p.sku === sku);

    if (producto) {
        productoSeleccionadoSKU = sku;
        document.getElementById('nombre-producto-eliminar').textContent = producto.nombre;
        mostrarModal('modal-eliminar');
    }
}

function manejarActualizacion(evento) {
    evento.preventDefault();

    const sku = document.getElementById('update-sku').value;
    const nuevaCantidad = parseInt(document.getElementById('update-cantidad').value);

    if (isNaN(nuevaCantidad) || nuevaCantidad < 0) {
        alert('Por favor ingresa un valor válido para la cantidad (0 o mayor).');
        return false;
    }

    const indice = datosProductos.findIndex(p => p.sku === sku);
    if (indice !== -1) {
        datosProductos[indice].cantidad = nuevaCantidad;
        cerrarModal('modal-actualizar');
        renderizarProductos(datosProductos);
    } else {
        console.error("Error: Producto no encontrado.");
    }
}

function ejecutarEliminacion() {
    if (productoSeleccionadoSKU) {
        const indice = datosProductos.findIndex(p => p.sku === productoSeleccionadoSKU);
        if (indice !== -1) {
            datosProductos.splice(indice, 1);
            cerrarModal('modal-eliminar');
            renderizarProductos(datosProductos);
        } else {
            console.error("Error: Producto no encontrado durante la eliminación.");
        }
    }
}

// ==============================================
// FUNCIÓN: AGREGAR PRODUCTO
// ==============================================
function manejarAgregar(evento) {
    evento.preventDefault();

    // ===== INPUTS GENERALES =====
    const nombre = document.getElementById('add-nombre').value.trim();
    const marca = document.getElementById('add-marca').value.trim();
    const temporada = document.getElementById('add-temporada').value.trim();
    const categoria = document.getElementById('add-categoria').value.trim();
    const precio = parseFloat(document.getElementById('add-precio').value.trim());
    const imagenGeneral = document.getElementById('add-imagen-general').value.trim();

    if (!nombre || !marca || !temporada || !categoria || isNaN(precio) || precio < 0) {
        alert("Por favor completa todos los campos generales correctamente.");
        return;
    }

    // ===== INPUTS DE DETALLES ESPECÍFICOS (VARIACIONES) =====
    const variaciones = [];
    const contenedorVariaciones = document.getElementById('contenedor-variaciones');
    const itemsVariacion = contenedorVariaciones.querySelectorAll('.variacion-item');

    itemsVariacion.forEach((item) => {
        const sku = item.querySelector('.input-sku').value.trim();
        const talla = item.querySelector('.input-talla').value.trim();
        const color = item.querySelector('.input-color').value.trim();
        const cantidad = parseInt(item.querySelector('.input-stock').value.trim());
        const inputArchivo = item.querySelector('.input-imagen');
        const ruta = inputArchivo && inputArchivo.files.length > 0 ? inputArchivo.files[0].name : '';

        if (!sku || !talla || !color || isNaN(cantidad) || cantidad < 0) {
            alert("Por favor completa todos los campos de detalles específicos (SKU, Talla, Color, Cantidad).");
            return;
        }

        variaciones.push({
            sku,
            talla,
            color,
            cantidad,
            ruta
        });
    });

    if (variaciones.length === 0) {
        alert("Por favor agrega al menos una variación (SKU, Talla, Color, Cantidad).");
        return;
    }

    // ===== AGREGAR CADA VARIACIÓN COMO UNA FILA EN LA TABLA =====
    variaciones.forEach(variacion => {
        datosProductos.unshift({
            sku: variacion.sku,
            nombre: nombre,
            marca: marca,
            temporada: temporada,
            categoria: categoria,
            precio: precio,
            talla: variacion.talla,
            color: variacion.color,
            cantidad: variacion.cantidad,
            ruta: variacion.ruta
        });
    });

    // ===== MOSTRAR EN CONSOLA TODA LA INFORMACIÓN =====
    console.log('=== PRODUCTO AGREGADO ===');
    console.log('Detalles Generales:', { nombre, marca, temporada, categoria, precio });
    console.log('Detalles Específicos (Variaciones):', variaciones);

    cerrarModal('modal-agregar');
    renderizarProductos(datosProductos);

    evento.target.reset();
}

// ==============================================
// LÓGICA DE BÚSQUEDA Y FILTROS
// ==============================================

let filtrosActivos = {
    stockMin: null,
    stockMax: null
};

function buscarProductos(query) {
    query = query.toLowerCase().trim();
    
    let productosFiltrados = datosProductos;
    if (filtrosActivos.stockMin !== null || filtrosActivos.stockMax !== null) {
        productosFiltrados = productosFiltrados.filter(producto => {
            let cumpleFiltros = true;
            if (filtrosActivos.stockMin !== null) {
                cumpleFiltros = cumpleFiltros && producto.cantidad >= filtrosActivos.stockMin;
            }
            if (filtrosActivos.stockMax !== null) {
                cumpleFiltros = cumpleFiltros && producto.cantidad <= filtrosActivos.stockMax;
            }
            return cumpleFiltros;
        });
    }

    if (!query) {
        return productosFiltrados;
    }
    
    return productosFiltrados.filter(producto => 
        producto.sku.toLowerCase().includes(query) || producto.nombre.toLowerCase().includes(query)
    );
}

function limpiarFiltros() {
    document.getElementById('filtro-stock-min').value = '';
    document.getElementById('filtro-stock-max').value = '';
    
    filtrosActivos.stockMin = null;
    filtrosActivos.stockMax = null;

    const inputBuscador = document.querySelector('.input-buscador');
    const resultados = buscarProductos(inputBuscador ? inputBuscador.value : '');
    
    renderizarProductos(resultados);
    cerrarModal('modal-filtros');
}

function aplicarFiltros() {
    const stockMin = document.getElementById('filtro-stock-min').value;
    const stockMax = document.getElementById('filtro-stock-max').value;

    filtrosActivos.stockMin = stockMin === '' ? null : parseInt(stockMin);
    filtrosActivos.stockMax = stockMax === '' ? null : parseInt(stockMax);

    const inputBuscador = document.querySelector('.input-buscador');
    const resultados = buscarProductos(inputBuscador ? inputBuscador.value : '');
    
    renderizarProductos(resultados);
    cerrarModal('modal-filtros');
}

// ==============================================
// LÓGICA DEL MENÚ LATERAL
// ==============================================
function inicializarMenuToggle() {
    const botonToggle = document.getElementById('boton-toggle-menu');
    const menuLateral = document.getElementById('menu-lateral') || document.querySelector('.menu-dashboard');
    const contenedorPrincipal = document.querySelector('.contenedor-principal');

    // Si no hay botón explícito para toggle o no se encontró el menú, mantenemos
    // el contenedor principal sin margen (full-width) por defecto.
    if (!botonToggle || !menuLateral) {
        if (contenedorPrincipal && window.innerWidth > 768) {
            // Asegurar estado inicial collapsed -> margin 0
            contenedorPrincipal.style.marginLeft = '0';
        }
        return;
    }

    botonToggle.addEventListener('click', () => {
        menuLateral.classList.toggle('colapsado');

        if (window.innerWidth > 768) {
            // Cuando el menú está abierto (no colapsado) aplicamos el ancho definido,
            // cuando está colapsado dejamos margin 0 (full-width) o un pequeño offset si prefieres.
            contenedorPrincipal.style.marginLeft = menuLateral.classList.contains('colapsado') ? '0' : 'var(--ancho-menu-abierto)';
        } else {
            menuLateral.classList.toggle('-translate-x-full');
        }
    });

    // Estado inicial: content full-width (collapsed). JS will apply open margin when toggled.
    if (contenedorPrincipal && window.innerWidth > 768) {
        contenedorPrincipal.style.marginLeft = '0';
    }
}

// ==============================================
// LÓGICA DE VARIACIONES Y GESTIÓN DE ARCHIVOS (UNIFICADO Y CORREGIDO)
// ==============================================

// 1. Manejo Dinámico de Variaciones (CORREGIDO PARA EL BOTÓN)
document.getElementById('btn-agregar-variacion').addEventListener('click', () => {
    const contenedor = document.getElementById('contenedor-variaciones');
    const nueva = document.createElement('div');
    nueva.classList.add('variacion-item');
    // Generar un ID único para el input de archivo (necesario para el label)
    const uniqueId = `file-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    nueva.innerHTML = `
        <input type="text" placeholder="SKU (Ej. 204362)" class="input-sku" required>
        <input type="text" placeholder="Talla (Ej. M)" class="input-talla" required>
        <input type="text" placeholder="Color (Ej. Azul)" class="input-color" required>
        <input type="number" placeholder="Cantidad" min="0" class="input-stock" required>
        
        <div class="form-grupo-archivo" style="display:flex; flex-direction: column; align-items: center; justify-content: center;">
            
            <input type="file" id="${uniqueId}" class="input-hidden-file input-imagen" accept="image/*" title="Subir imagen">
            
            <label for="${uniqueId}" class="custom-file-upload">
                <i class="fas fa-image"></i> Subir Imagen
            </label>
            
            <img class="preview-imagen" src="" alt="Vista previa" style="display:none; margin-top: 5px; width: 50px; height: 50px;">
        </div>

        <button type="button" class="btn-eliminar-variacion" title="Eliminar variación">×</button>
    `;
    contenedor.appendChild(nueva);
});

// 2. Eliminar variación (se mantiene igual, asegurando la eliminación del padre)
document.addEventListener('click', e => {
    if (e.target.classList.contains('btn-eliminar-variacion')) {
        // Eliminar el contenedor principal de la variación
        e.target.closest('.variacion-item').remove();
    }
});


// ... (Toda la lógica anterior del JS)

// 3. Lógica de Previsualización de Imágenes (General y Variaciones - UNIFICADO)
document.addEventListener('change', function (event) {
    const target = event.target;
    
    // Función para manejar la previsualización
    const handleImagePreview = (fileInput, previewElement) => {
        const file = fileInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = e => {
                previewElement.src = e.target.result;
                previewElement.style.display = 'block';
                // Añadimos una verificación de tamaño si estás en el modal de variaciones
                if (previewElement.closest('.variacion-item')) {
                    previewElement.style.width = '50px';
                    previewElement.style.height = '50px';
                }
            };
            reader.readAsDataURL(file);
        } else {
            previewElement.src = '';
            previewElement.style.display = 'none';
        }
    };

    // Caso A: Imagen General
    if (target.id === 'add-imagen-general' && target.type === 'file') {
        // CORRECCIÓN: Usa 'preview-general' según tu HTML
        const preview = document.getElementById('preview-general'); 
        
        // Actualiza el texto en el span que muestra el nombre del archivo
        const nameDisplay = document.getElementById('nombre-archivo-general'); 
        
        if (nameDisplay && target.files.length > 0) {
            nameDisplay.textContent = target.files[0].name;
        } else if (nameDisplay) {
            nameDisplay.textContent = 'Ningún archivo seleccionado';
        }
        handleImagePreview(target, preview);
        
    // Caso B: Imágenes de Variaciones (Usamos la clase 'input-imagen' en el input[type="file"])
    } else if (target.classList.contains('input-imagen') && target.type === 'file') {
        const preview = target.closest('.form-grupo-archivo').querySelector('.preview-imagen');
        handleImagePreview(target, preview);
    }
});


// ==============================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ==============================================
document.addEventListener('DOMContentLoaded', () => {
    renderizarProductos(datosProductos);
    inicializarMenuToggle();

    // Inicializar botón de filtros
    const botonFiltros = document.querySelector('.boton-filtros');
    if (botonFiltros) {
        botonFiltros.addEventListener('click', () => mostrarModal('modal-filtros'));
    }

    // Inicializar búsqueda
    const inputBuscador = document.querySelector('.input-buscador');
    if (inputBuscador) {
        inputBuscador.addEventListener('input', (e) => {
            const resultados = buscarProductos(e.target.value);
            renderizarProductos(resultados);
        });
    }

    // Formulario actualizar
    const formActualizar = document.getElementById('formulario-actualizar');
    if (formActualizar) formActualizar.addEventListener('submit', manejarActualizacion);

    // Formulario agregar
    const formAgregar = document.getElementById('formulario-agregar');
    if (formAgregar) formAgregar.addEventListener('submit', manejarAgregar);

    // Botón "AGREGAR" para abrir el modal
    const botonAgregar = document.querySelector('.boton-accion-principal');
    if (botonAgregar) {
        botonAgregar.addEventListener('click', () => mostrarModal('modal-agregar'));
    }
});
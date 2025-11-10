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
let productoSeleccionadoSKU = null; // Para guardar el SKU del producto seleccionado

// ==============================================
// LÓGICA DEL INVENTARIO
// ==============================================

function renderizarProductos(productos) {
    const cuerpoTabla = document.getElementById('cuerpo-tabla-productos');
    if (!cuerpoTabla) return;

    cuerpoTabla.innerHTML = '';

    productos.forEach(producto => {
        const necesitaAdvertencia = producto.stock <= UMBRAL_ADVERTENCIA;

        const fila = document.createElement('tr');
        const nombreMostrar = producto.nombre + (producto.talla ? ` ${producto.talla}` : '');
        fila.innerHTML = `
            <td class="sku">${producto.sku}</td>
            <td class="nombre">${nombreMostrar}</td>
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
        document.getElementById('update-sku').value = producto.sku;
        document.getElementById('update-nombre').value = producto.nombre;
        document.getElementById('update-stock').value = producto.stock;
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
    const nuevoStock = parseInt(document.getElementById('update-stock').value);

    if (isNaN(nuevoStock) || nuevoStock < 0) {
        alert('Por favor ingresa un valor válido para el stock (0 o mayor).');
        return false;
    }

    const indice = datosProductos.findIndex(p => p.sku === sku);
    if (indice !== -1) {
        datosProductos[indice].stock = nuevoStock;
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

    const sku = document.getElementById('add-sku').value.trim();
    const nombre = document.getElementById('add-nombre').value.trim();
    const stock = parseInt(document.getElementById('add-stock').value.trim());

    if (!sku || !nombre || isNaN(stock) || stock < 0) {
        alert("Por favor completa los campos correctamente antes de agregar un producto.");
        return;
    }

    const existe = datosProductos.some(p => p.sku === sku);
    if (existe) {
        alert("El SKU ya existe. Usa otro SKU para agregar un nuevo producto.");
        return;
    }

    const talla = document.getElementById('add-talla').value.trim();
    const nuevoProducto = { sku, nombre, stock, talla };
    datosProductos.unshift(nuevoProducto);

    cerrarModal('modal-agregar');
    renderizarProductos(datosProductos);

    evento.target.reset();
    console.log(`Producto agregado: ${nombre} (SKU: ${sku}, Stock: ${stock})`);
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
                cumpleFiltros = cumpleFiltros && producto.stock >= filtrosActivos.stockMin;
            }
            if (filtrosActivos.stockMax !== null) {
                cumpleFiltros = cumpleFiltros && producto.stock <= filtrosActivos.stockMax;
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

    if (!botonToggle || !menuLateral) {
        if (contenedorPrincipal && window.innerWidth > 768) {
            contenedorPrincipal.style.marginLeft = 'var(--ancho-menu-abierto)';
        }
        return;
    }

    botonToggle.addEventListener('click', () => {
        menuLateral.classList.toggle('colapsado');

        if (window.innerWidth > 768) {
            contenedorPrincipal.style.marginLeft = menuLateral.classList.contains('colapsado') ? '70px' : 'var(--ancho-menu-abierto)';
        } else {
            menuLateral.classList.toggle('-translate-x-full');
        }
    });

    if (contenedorPrincipal && window.innerWidth > 768) {
        contenedorPrincipal.style.marginLeft = 'var(--ancho-menu-abierto)';
    }
}

// ==============================================
// 🛠️ LÓGICA DE VARIACIONES Y GESTIÓN DE ARCHIVOS (UNIFICADO Y CORREGIDO)
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
// ... (El resto de la inicialización se mantiene)





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
// ============ UTILIDADES Y NAVEGACIÓN ============
function redirigir(nombre) {
    window.location.href = nombre;
}

function regresarInicio() {
    mostrarSeccion("inicio");
}

// ============ CONTROL DE SECCIONES (SPA: Single Page Application) ============
// Nota: Esta lógica solo tiene efecto si las secciones están en el mismo HTML
// y no se usan archivos separados (como contacto.html, catalogo.html).

function ocultarTodasLasSecciones() {
    // Asegúrate de que los IDs aquí coincidan con tu HTML
    const secciones = ["inicio", "Mi-Tienda", "Nosotros", "catalogo", "Contacto"];
    secciones.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
    });
}

function mostrarSeccion(seccionId) {
    // Si tu menú usa enlaces a otros archivos (e.g., contacto.html),
    // esta función no se usará para la navegación principal, solo para la navegación interna.
    ocultarTodasLasSecciones();
    const seccion = document.getElementById(seccionId);
    if (seccion) seccion.style.display = "block";
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// ============ CARRUSEL HORIZONTAL DE PRODUCTOS ============
function scrollCarrusel(id, direccion) {
    const carrusel = document.getElementById(id);
    const desplazamiento = 250; // Ajusta este valor si los ítems son más grandes o pequeños
    if (carrusel) {
        carrusel.scrollBy({ left: direccion * desplazamiento, behavior: "smooth" });
    }
}

// ============ CARRUSEL HERO ============
const images = document.querySelectorAll(".hero img");
const leftArrow = document.querySelector(".arrow.left");
const rightArrow = document.querySelector(".arrow.right");

let current = 0;
function showImage(index) {
    images.forEach(img => img.classList.remove("active"));
    // Evita errores si no hay imágenes o la longitud es cero
    if (images.length > 0) {
        images[index].classList.add("active");
    }
}

// Inicialización del carrusel hero
if (rightArrow && leftArrow && images.length > 0) {
    rightArrow.addEventListener("click", () => {
        current = (current + 1) % images.length;
        showImage(current);
    });
    leftArrow.addEventListener("click", () => {
        current = (current - 1 + images.length) % images.length;
        showImage(current);
    });
    showImage(current); // Muestra la primera imagen al inicio
}


// ============ MODALES LOGIN / REGISTRO ============
function mostrarModalLogin() {
    document.getElementById("modalLogin").style.display = "flex";
    document.getElementById("modalRegistro").style.display = "none";
}

function cerrarModalLogin() {
    document.getElementById("modalLogin").style.display = "none";
}

function mostrarModalRegistro() {
    document.getElementById("modalLogin").style.display = "none";
    document.getElementById("modalRegistro").style.display = "flex";
}

function cerrarModalRegistro() {
    document.getElementById("modalRegistro").style.display = "none";
}

// ============ LÓGICA DE SESIÓN (SIMULADA CON localStorage) ============

function actualizarEstadoSesion() {
    const usuarioActivo = localStorage.getItem("usuarioActivo");
    const btnLoginDiv = document.querySelector(".btn-login"); 
    
    // El botón de logout siempre estará visible por el CSS.

    if (usuarioActivo) {
        // Si el usuario está activo, oculta el botón de Login (ya que no lo necesita)
        if (btnLoginDiv) btnLoginDiv.style.display = "none";    
    } else {
        // Si no hay sesión, muestra el botón de Login para que pueda entrar
        if (btnLoginDiv) btnLoginDiv.style.display = "block";
    }
}

function iniciarSesion() {
    const usuario = document.getElementById("loginUsuario").value;
    const clave = document.getElementById("loginClave").value;

    if (usuario && clave) {
        // *SIMULACIÓN* - En un caso real, verificarías credenciales en un servidor.
        localStorage.setItem("usuarioActivo", usuario);
        cerrarModalLogin();
        actualizarEstadoSesion();
        alert(`Bienvenido, ${usuario}!`);
    } else {
        alert("Por favor, ingresa tu usuario y contraseña.");
    }
}

function registrarUsuario() {
    const usuario = document.getElementById("registroUsuario").value;
    const clave = document.getElementById("registroClave").value;

    if (usuario && clave) {
        // *SIMULACIÓN* - En un caso real, guardarías en una base de datos.
        // Aquí simulamos que el registro es exitoso e inicia sesión automáticamente.
        localStorage.setItem("usuarioActivo", usuario);
        cerrarModalRegistro();
        actualizarEstadoSesion();
        alert(`¡Registro exitoso! Bienvenido, ${usuario}.`);
    } else {
        alert("Por favor, completa ambos campos para registrarte.");
    }
}

function cerrarSesion() {
    localStorage.removeItem("usuarioActivo");
    actualizarEstadoSesion();
    alert("Has cerrado sesión.");
}


// ============ LÓGICA DE PRODUCTOS Y MODAL DE DETALLE ============
const caracteristicasPorId = {
    "201": ["Material: Algodón Pima", "Corte: Slim Fit", "Color: Negro/Blanco", "Estilo: Casual"],
    "202": ["Material: Poliéster", "Estilo: Trench Clásico", "Color: Beige", "Detalles: Cinto ajustable"],
    "203": ["Material: Franela", "Diseño: Estampado", "Talla: S, M, L", "Ideal para invierno"],
    "204": ["Material: Nylon", "Corte: Regular", "Capucha: Desmontable", "Impermeable"],
    "301": ["Material: Piqué", "Marca: Lacoste", "Corte: Regular Fit", "Color: Múltiples"],
    "302": ["Material: Algodón", "Corte: Oversize", "Diseño: Rayas", "Cuello: Redondo"],
    "303": ["Material: Algodón", "Estilo: Básico", "Talla: 4 a 12", "Fácil de lavar"],
    "304": ["Material: Piqué", "Marca: Coniglio", "Detalle: Logo bordado", "Ideal para verano"],
    // Asegúrate de usar los IDs de tu HTML (201, 202, etc.)
};

let productoActual = {};

function cerrarModalProducto() {
    document.getElementById("modalProducto").style.display = "none";
}

// Maneja el clic en el botón "Comprar" dentro del modal de producto
document.addEventListener("DOMContentLoaded", () => {
    const btnComprarDesdeModal = document.getElementById("btnComprarDesdeModal");

    if (btnComprarDesdeModal) {
        btnComprarDesdeModal.addEventListener("click", () => {
            const carrito = document.querySelector("#lista-carrito tbody");
            const existe = carrito.querySelector(`tr[data-id='${productoActual.id}']`);

            if (!existe && productoActual.id) {
                const fila = document.createElement("tr");
                fila.setAttribute("data-id", productoActual.id);
                fila.innerHTML = `
                    <td><img src="${productoActual.imagen}" width="50" height="40" style="object-fit: cover;"></td>
                    <td>${productoActual.nombre}</td>
                    <td>S/. ${productoActual.precio}</td>
                    <td><a href="#" class="eliminar-producto" data-id="${productoActual.id}">X</a></td>
                `;
                carrito.appendChild(fila);
            }

            cerrarModalProducto();
            document.getElementById('carrito-contenido').style.display = 'block';
            alert("Producto agregado al carrito ✅");
        });
    }

    // Lógica para abrir el modal de producto al hacer clic en la imagen
    const imagenesProductos = document.querySelectorAll(".item img");
    imagenesProductos.forEach(img => {
        img.addEventListener("click", () => {
            const contenedor = img.closest(".item");
            const boton = contenedor.querySelector(".agregar-carrito");

            const nombre = boton.getAttribute("data-nombre");
            const precio = boton.getAttribute("data-precio");
            const imagen = boton.getAttribute("data-imagen");
            const id = boton.getAttribute("data-id");

            document.getElementById("modalNombre").textContent = nombre;
            document.getElementById("modalPrecioNum").textContent = `${precio}`;
            document.getElementById("modalImagen").src = imagen;

            // Almacena los datos del producto actual
            productoActual = { id, nombre, precio, imagen };

            const lista = document.getElementById("modalCaracteristicas");
            lista.innerHTML = "";

            const caracteristicas = caracteristicasPorId[id] || ["Sin información disponible"];
            caracteristicas.forEach(item => {
                const li = document.createElement("li");
                li.textContent = item;
                lista.appendChild(li);
            });

            document.getElementById("modalProducto").style.display = "flex";
        });
    });
});


// ============ LÓGICA COMPLETA DEL CARRITO (Unificada) ============
document.addEventListener('DOMContentLoaded', () => {
    // Inicialización al cargar la página
    mostrarSeccion("inicio");
    actualizarEstadoSesion();
    
    // Selectores del Carrito
    const carritoIcono = document.getElementById('carrito-icono');
    const carritoContenido = document.getElementById('carrito-contenido');
    const listaCarrito = document.querySelector("#lista-carrito tbody");
    const vaciarCarritoBtn = document.getElementById("vaciar-carrito");
    const agregarBtns = document.querySelectorAll(".agregar-carrito");

    // Función para mostrar/ocultar el carrito
    if (carritoIcono) {
        carritoIcono.addEventListener('click', () => {
            const isVisible = carritoContenido.style.display === 'block';
            carritoContenido.style.display = isVisible ? 'none' : 'block';
        });
    }

    // 1. Lógica para agregar productos (botones debajo de los ítems)
    agregarBtns.forEach(btn => {
        btn.addEventListener("click", e => {
            e.preventDefault();

            const imagen = btn.getAttribute("data-imagen");
            const nombre = btn.getAttribute("data-nombre");
            const precio = btn.getAttribute("data-precio");
            const id = btn.getAttribute("data-id");

            // Verifica si el producto ya existe en el carrito
            const existe = listaCarrito.querySelector(`tr[data-id='${id}']`);
            if (!existe) {
                const fila = document.createElement("tr");
                fila.setAttribute("data-id", id);
                fila.innerHTML = `
                    <td><img src="${imagen}" width="50" height="40" style="object-fit: cover;"></td>
                    <td>${nombre}</td>
                    <td>S/. ${precio}</td>
                    <td><a href="#" class="eliminar-producto" data-id="${id}">X</a></td>
                `;
                listaCarrito.appendChild(fila);
            }
            carritoContenido.style.display = 'block'; 
        });
    });

    // 2. Lógica para eliminar productos (delegación de eventos)
    if (listaCarrito) {
        listaCarrito.addEventListener("click", e => {
            if (e.target.classList.contains("eliminar-producto")) {
                e.preventDefault();
                e.target.closest("tr").remove();
            }
        });
    }

    // 3. Lógica para vaciar el carrito
    if (vaciarCarritoBtn) {
        vaciarCarritoBtn.addEventListener("click", e => {
            e.preventDefault();
            listaCarrito.innerHTML = ""; 
            carritoContenido.style.display = 'none';
        });
    }

    // 4. Lógica para cerrar el carrito al hacer clic fuera de él
    document.addEventListener('click', (e) => {
        if (carritoIcono && carritoContenido) {
            if (!carritoIcono.contains(e.target) && !carritoContenido.contains(e.target)) {
                carritoContenido.style.display = 'none';
            }
        }
    });
});
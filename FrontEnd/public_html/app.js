// Variables
const carrito = document.querySelector('#carrito');
const listaCursos = document.querySelector('#lista-cursos');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarritoBtn = document.querySelector('#vaciar-carrito');
let articulosCarrito = [];

// Modal Login
const loginModal = document.getElementById('login-modal');
const btnLogin = document.getElementById('btnLogin');
const cerrarModalPago = document.getElementById('cerrar-modal');
const crearUsuarioBtn = document.getElementById('crearUsuarioBtn');

// Listeners
cargarEventListeners();

function cargarEventListeners() {
    // Agregar cursos
    listaCursos.addEventListener('click', agregarCurso);

    // Eliminar cursos
    carrito.addEventListener('click', eliminarCurso);

    // Vaciar carrito
    vaciarCarritoBtn?.addEventListener('click', vaciarCarrito);

    // Abrir modal de inicio de sesión
    btnLogin?.addEventListener('click', () => {
        loginModal.style.display = 'block';
    });

    // Cerrar modal
    cerrarModal?.addEventListener('click', () => {
        loginModal.style.display = 'none';
    });

    // Cerrar modal al hacer clic fuera del contenido
    window.addEventListener('click', e => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });

    // Crear cuenta
    crearUsuarioBtn?.addEventListener('click', () => {
        alert('Aquí puedes redirigir al formulario de registro de usuario.');
    });
}

// Funciones del carrito
function agregarCurso(e) {
    e.preventDefault();
    if (e.target.classList.contains('agregar-carrito')) {
        const curso = e.target.closest('.card');
        leerDatosCurso(curso);
    }
}

function leerDatosCurso(curso) {
    const infoCurso = {
        imagen: curso.querySelector('img').src,
        titulo: curso.querySelector('h4').textContent,
        precio: curso.querySelector('.precio span').textContent,
        id: curso.querySelector('a').getAttribute('data-id'),
        cantidad: 1
    };

    const existe = articulosCarrito.some(curso => curso.id === infoCurso.id);
    if (existe) {
        articulosCarrito = articulosCarrito.map(curso => {
            if (curso.id === infoCurso.id) {
                curso.cantidad++;
            }
            return curso;
        });
    } else {
        articulosCarrito = [...articulosCarrito, infoCurso];
    }

    carritoHTML();
}

function eliminarCurso(e) {
    e.preventDefault();
    if (e.target.classList.contains('borrar-curso')) {
        const cursoId = e.target.getAttribute('data-id');
        articulosCarrito = articulosCarrito.filter(curso => curso.id !== cursoId);
        carritoHTML();
    }
}

function carritoHTML() {
    vaciarCarrito();

    articulosCarrito.forEach(curso => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${curso.imagen}" width="100"></td>
            <td>${curso.titulo}</td>
            <td>${curso.precio}</td>
            <td>${curso.cantidad}</td>
            <td><a href="#" class="borrar-curso" data-id="${curso.id}">X</a></td>
        `;
        contenedorCarrito.appendChild(row);
    });
}

function vaciarCarrito() {
    while (contenedorCarrito.firstChild) {
        contenedorCarrito.removeChild(contenedorCarrito.firstChild);
    }
}

// Modal de pago
const modalPago = document.getElementById('modal-pago');
const cerrarModal = document.querySelector('.cerrar-modal');
const formularioPago = document.getElementById('formulario-pago');

// Mostrar el modal (puedes conectarlo después de iniciar sesión)
document.getElementById('img-carrito').addEventListener('click', () => {
  modalPago.style.display = 'block';
});

// Cerrar el modal
cerrarModalPago.addEventListener('click', () => {
  modalPago.style.display = 'none';
});

window.addEventListener('click', (e) => {
  if (e.target === modalPago) {
    modalPago.style.display = 'none';
  }
});

// Formulario de pago
formularioPago.addEventListener('submit', function(e) {
  e.preventDefault();
  const metodo = document.querySelector('input[name="metodo"]:checked');
  const tarjeta = document.getElementById('numero-tarjeta').value.trim();

  if (metodo && tarjeta !== "") {
    alert("Tu compra está realizada");
    modalPago.style.display = 'none';
    formularioPago.reset();
  } else {
    alert("Por favor, selecciona un método y escribe un número de tarjeta.");
  }
});



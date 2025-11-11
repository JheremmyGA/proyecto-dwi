import * as HTTPS_Request from '../Utils/HTTPRequest.js';
import * as PERSISTENT_DATA from '../Utils/PersistentData.js';

/**
 * login.js actualizado FINAL
 * - Admin: admin@kivora.com / admin1234
 * - Ambos (admin y usuarios normales) redirigen a index.html
 * - Si es admin, al volver al index se muestra "Panel Admin"
 */

const MIN_LENGTH = 3;

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const mensajeError = document.getElementById('mensaje-error');

    // =========================================================
    // INICIO DE SESIÓN
    // =========================================================
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            Login();
        });
    }

    // =========================================================
    // MOSTRAR NOMBRE + MENÚ DESPLEGABLE + BOTÓN ADMIN SI APLICA
    // =========================================================
    const usuarioLogueado = JSON.parse(PERSISTENT_DATA.GetUsuarioLogeado());
    const contAnonimo = document.getElementById('contenedor-anonimo');
    const contLogueado = document.getElementById('contenedor-logueado');
    const nombreUsuario = document.getElementById('nombre-usuario');
    const menuUsuario = document.querySelector('.usuario-menu');

    if (usuarioLogueado && contAnonimo && contLogueado && nombreUsuario) {
        contAnonimo.style.display = 'none';
        contLogueado.style.display = 'flex';
        const logeado = PERSISTENT_DATA.GetUsuarioLogeado() === 'true';
        const nombre = PERSISTENT_DATA.GetNombreUsuario() || 'Usuario';
        const rol = PERSISTENT_DATA.GetRol() || 'usuario';
        nombreUsuario.textContent = `Hola, ${nombre} `;

        // Limpiar el menú antes de construirlo
        if (menuUsuario) {
            menuUsuario.innerHTML = `
                <a href="Usuario.html">Mi cuenta</a>
                <a href="carrito.html">Mi carrito</a>
                <a href="#" onclick="cerrarSesion()">Cerrar sesión</a>
            `;

            // 🔹 Si es administrador, agrega el botón "Panel Admin"
            if (PERSISTENT_DATA.GetRol() === 'Admin') {
                const enlaceAdmin = document.createElement('a');
                enlaceAdmin.href = 'menu.html';
                enlaceAdmin.textContent = 'Panel Admin';
                enlaceAdmin.id = 'boton-admin';
                menuUsuario.insertBefore(enlaceAdmin, menuUsuario.firstChild);
            }
        }
    }
});

async function Login(){
    const correoInput = document.getElementById('correo').value.trim();
    const contrasenaInput = document.getElementById('contrasena').value.trim();

    if (!correoInput || !contrasenaInput) {
        mensaje = 'Por favor, ingrese correo y contraseña.';
    } 
    
    const UserData = {
        correo: correoInput,
        contraseña: contrasenaInput
    };
    const TokenData = await HTTPS_Request.Login(UserData);

    if (TokenData === null) {
        console.log("Login fallido o incompleto. No se intentará iniciar sesión.");
        return; 
    }

    const nombre = correoInput.split('@')[0] || 'Usuario';
    PERSISTENT_DATA.SetNombreUsuario(nombre);
    PERSISTENT_DATA.SetTokenData(TokenData.access_token);
    PERSISTENT_DATA.SetUsuarioLogeado('true');
    PERSISTENT_DATA.SetRol(TokenData.role);

    window.location.href = 'index.html';
}

// =========================================================
// CERRAR SESIÓN
// =========================================================
function cerrarSesion() {
      
    PERSISTENT_DATA.SetNombreUsuario('');
    PERSISTENT_DATA.SetTokenData('');
    PERSISTENT_DATA.SetUsuarioLogeado('false');
    PERSISTENT_DATA.SetRol('');

    alert('Sesión cerrada correctamente');
    window.location.href = 'index.html';
}
window.cerrarSesion = cerrarSesion;

// =========================================================
// DESPLEGABLE DEL USUARIO
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    const dropdown = document.querySelector('.usuario-dropdown');
    const botonUsuario = document.querySelector('.usuario-btn');

    if (dropdown && botonUsuario) {
        botonUsuario.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('activo');
        });

        document.addEventListener('click', () => {
            dropdown.classList.remove('activo');
        });
    }
});

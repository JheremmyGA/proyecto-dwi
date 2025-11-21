import * as HTTPS_Request from '../Utils/HTTPRequest.js';
import * as PERSISTENT_DATA from '../Utils/PersistentData.js';

document.addEventListener("DOMContentLoaded", () => {
    setUserData();
});

async function setUserData() {
    // Verificar si hay sesión activa
    const usuarioGuardado = await HTTPS_Request.GetUserData(PERSISTENT_DATA.GetUserId());
    if (!usuarioGuardado) {
        alert("Debes iniciar sesión para acceder a esta página.");
        window.location.href = "Login.html";
        return;
    }

    // Obtener los datos del usuario almacenados
    const nombre = usuarioGuardado.nombre || "No especificado";
    const correo = usuarioGuardado.correo || "No especificado";
    const apellido = usuarioGuardado.apellido || "No especificado";
    //const celular = localStorage.getItem("celularUsuario") || "No especificado";

    // Mostrar los datos en la página
    document.getElementById("nombreUsuario").textContent = nombre;
    document.getElementById("apellidoUsuario").textContent = apellido;
    //document.getElementById("celularUsuario").textContent = celular;
    document.getElementById("correoUsuario").textContent = correo;
}

document.addEventListener("DOMContentLoaded", () => {
    // Verificar si hay sesión activa
    const usuarioGuardado = JSON.parse(localStorage.getItem("usuarioLogueado"));
    if (!usuarioGuardado) {
        alert("Debes iniciar sesión para acceder a esta página.");
        window.location.href = "Login.html";
        return;
    }

    // Obtener los datos del usuario almacenados
    const nombre = usuarioGuardado.nombre || "No especificado";
    const correo = usuarioGuardado.correo || "No especificado";
    const apellido = localStorage.getItem("apellidoUsuario") || "No especificado";
    const celular = localStorage.getItem("celularUsuario") || "No especificado";

    // Mostrar los datos en la página
    document.getElementById("nombreUsuario").textContent = nombre;
    document.getElementById("apellidoUsuario").textContent = apellido;
    document.getElementById("celularUsuario").textContent = celular;
    document.getElementById("correoUsuario").textContent = correo;
});

const toggle = document.querySelector(".toggle")
const menuDashboard = document.querySelector(".menu-dashboard")
const iconoMenu = toggle.querySelector("i")
const enlacesMenu = document.querySelectorAll(".enlace")

toggle.addEventListener("click", () => {
    menuDashboard.classList.toggle("open")
    document.querySelector('.main-content').classList.toggle('menu-open')

    if(iconoMenu.classList.contains("bx-menu")){
        iconoMenu.classList.replace("bx-menu", "bx-x")
    }else {
        iconoMenu.classList.replace("bx-x", "bx-menu")
    }
})

enlacesMenu.forEach(enlace => {
    enlace.addEventListener("click", () => {
        menuDashboard.classList.add("open")
        iconoMenu.classList.replace("bx-menu", "bx-x")
        
        // Obtener la URL del href del enlace
        const url = enlace.getAttribute('href')
        if (url && url !== '#') {
            // Redireccionar a la página correspondiente
            window.location.href = url
        }
    })
})


function updateDateTime() {
    const now = new Date();
    
    // Opciones de formato de fecha
    const dateOptions = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
    };
    
    // Opciones de formato de hora
    const timeOptions = { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit', 
        hour12: false // Formato de 24 horas
    };

    const dateStr = now.toLocaleDateString('es-ES', dateOptions);
    const timeStr = now.toLocaleTimeString('es-ES', timeOptions);

    //document.getElementById('datetime').textContent = `${dateStr} | ${timeStr}`;
}

// Ejecutar la función inmediatamente y luego cada segundo
updateDateTime();
setInterval(updateDateTime, 1000);
export function SelectedGenero(id_genero){
    localStorage.setItem("generoSeleccionado", id_genero);
}

export function GetSelectedGenero(){
    return localStorage.getItem("generoSeleccionado");
}

export function SelectProductDetails(id_producto){
    localStorage.setItem("productoSeleccionadoDetalle", id_producto);
}

export function GetSelectedProductDetails(){
    return localStorage.getItem("productoSeleccionadoDetalle");
}

export function GuardarCarrito(carrito){
    localStorage.setItem("articulosCarrito", carrito);
}

export function CargarCarrito(){
    return localStorage.getItem("articulosCarrito");
}

// =======================================================================
// ========================= CONFIGURACIÓN DE USUARIO =======================
// =======================================================================

export function SetNombreUsuario(nombre){
    if(nombre === null || nombre === undefined || nombre === ''){
        localStorage.removeItem("nombreUsuario");
        return;
    }
    localStorage.setItem("nombreUsuario", nombre);
}

export function GetNombreUsuario(){
    return localStorage.getItem("nombreUsuario");
}

export function SetUserId(id){
    if(id === null || id === undefined || id === ''){
        localStorage.removeItem("IdDataUser");
        return;
    }
    localStorage.setItem("IdDataUser", id);
}

export function GetUserId(){
    return localStorage.getItem("IdDataUser");
}

export function SetTokenData(tokenData){
    if(tokenData === null || tokenData === undefined || tokenData === ''){
        localStorage.removeItem("TokenDataUser");
        return;
    }
    localStorage.setItem("TokenDataUser", tokenData);
}

export function GetTokenData(){
    return localStorage.getItem("TokenDataUser");
}

export function SetRol(rol){
    if(rol === null || rol === undefined || rol === ''){
        localStorage.removeItem("RolUser");
        return;
    }
    localStorage.setItem("RolUser", rol);
}

export function GetRol(){
    return localStorage.getItem("RolUser");
}

export function SetUsuarioLogeado(usuarioLogeado){
    if(usuarioLogeado === null || usuarioLogeado === undefined || usuarioLogeado === ''){
        localStorage.removeItem("usuarioLogeado");
        return;
    }
    localStorage.setItem("usuarioLogeado", usuarioLogeado);
}

export function GetUsuarioLogeado(){
    return localStorage.getItem("usuarioLogeado");
}
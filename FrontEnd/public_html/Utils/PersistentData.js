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
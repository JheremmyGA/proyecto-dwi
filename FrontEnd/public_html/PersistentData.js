export function SelectedGenero(id_genero){
    localStorage.setItem("generoSeleccionado", id_genero);
}

export function GetSelectedGenero(){
    return localStorage.getItem("generoSeleccionado");
}
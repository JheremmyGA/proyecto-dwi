let generosCache = null;
const useBackEnd = false;

const generosStatic = [
    // La imagen 'product_black.png' y 'product_white.png' son placeholders
    { id_genero: 1, nombre: 'Caballeros', descripcion: 'Explora nuestra colección exclusiva para caballeros, creada para destacar tu estilo y confianza en cualquier ocasión. Desde looks casuales hasta conjuntos formales, descubre prendas que combinan elegancia, comodidad y carácter, reflejando una personalidad moderna y auténtica.' },
    { id_genero: 2, nombre: 'Damas', descripcion: 'Explora nuestra colección exclusiva para damas, diseñada para resaltar tu estilo y elegancia en cada ocasión. Desde prendas casuales hasta atuendos formales, encuentra la combinación perfecta que refleje tu personalidad y te haga sentir segura y hermosa.' },
    { id_genero: 3, nombre: 'Niños', descripcion: '¡La aventura comienza aquí! Explora nuestra colorida y resistente colección de ropa para niños. Diseñada para acompañar cada juego, salto y travesura, encontrarás prendas que combinan comodidad y estilo divertido. ¡Viste a tus pequeños con la calidad y la libertad que necesitan para crear sus propias historias!' },
    { id_genero: 4, nombre: 'Niñas', descripcion: '¡Sueña, juega y brilla! Explora nuestra mágica y cómoda colección de ropa para niñas. Diseñada para inspirar la creatividad y la libertad en cada aventura, encontrarás prendas que combinan tendencia y resistencia. ¡Viste a tus pequeñas con el estilo y la calidad que necesitan para expresarse y crear sus propias historias!' },
];


export async function GetGeneros() {

    if(!useBackEnd) return generosStatic;
    if (generosCache) return generosCache; 

    try {
      const response = await fetch("http://localhost:9530/api/genero", {
        method: "GET"
      });   

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor: " + response.status);
      } 

      const data = await response.json();  

      generosCache = data;

      return data; // solo retornas la data

    } catch (error) {
      console.error("Error:", error);
      return null; // opcional: retorna null si hay error
    }
}

export async function GetGenero(id){

    if(!useBackEnd){
      return generosStatic.find(x => x.id_genero == id);
    }

    try {
      const response = await fetch(`http://localhost:9530/api/genero/${id}?`, {
        method: "GET"
      });   

      if (!response.ok) {
        throw new Error("Error en la respuesta del servidor: " + response.status);
      } 

      const data = await response.json();  

      return data; // solo retornas la data

    } catch (error) {
      console.error("Error:", error);
      return null; // opcional: retorna null si hay error
    }
}


/*
export function CargarCategorias() {
    try {
      return fetch("http://localhost:9530/api/categoria", {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                    }).then(res => res.json());

      const lista = document.getElementById("productos");
      data.forEach(p => {
        const li = document.createElement("li");
        li.textContent = `${p.nombre} - $${p.precio}`;
        lista.appendChild(li);
      });
    } catch (error) {
      console.error("Error:", error);
    }
  }
  */
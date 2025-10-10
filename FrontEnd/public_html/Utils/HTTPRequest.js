let generosCache = null;


export async function GetGeneros() {

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
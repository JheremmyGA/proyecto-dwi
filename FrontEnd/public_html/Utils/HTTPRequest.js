let generosCache = null;
const useBackEnd = false;

const generosStatic = [
    // La imagen 'product_black.png' y 'product_white.png' son placeholders
    { id_genero: 1, nombre: 'Caballeros', descripcion: 'Explora nuestra colección exclusiva para caballeros, creada para destacar tu estilo y confianza en cualquier ocasión. Desde looks casuales hasta conjuntos formales, descubre prendas que combinan elegancia, comodidad y carácter, reflejando una personalidad moderna y auténtica.' },
    { id_genero: 2, nombre: 'Damas', descripcion: 'Explora nuestra colección exclusiva para damas, diseñada para resaltar tu estilo y elegancia en cada ocasión. Desde prendas casuales hasta atuendos formales, encuentra la combinación perfecta que refleje tu personalidad y te haga sentir segura y hermosa.' },
    { id_genero: 3, nombre: 'Niños', descripcion: '¡La aventura comienza aquí! Explora nuestra colorida y resistente colección de ropa para niños. Diseñada para acompañar cada juego, salto y travesura, encontrarás prendas que combinan comodidad y estilo divertido. ¡Viste a tus pequeños con la calidad y la libertad que necesitan para crear sus propias historias!' },
    { id_genero: 4, nombre: 'Niñas', descripcion: '¡Sueña, juega y brilla! Explora nuestra mágica y cómoda colección de ropa para niñas. Diseñada para inspirar la creatividad y la libertad en cada aventura, encontrarás prendas que combinan tendencia y resistencia. ¡Viste a tus pequeñas con el estilo y la calidad que necesitan para expresarse y crear sus propias historias!' },
];

const datosProductos = [
    // Las imágenes 'product_black.png' y 'product_white.png' son marcadores de posición
    { id: 1, nombre: 'Camisa Oxford Slim Fit', marca: 'University Club', temporada: 'Verano', categoria: 'Camisas', precio: 'S/89.00', imagen: 'camisa_oxford.png'},
    { id: 5, nombre: 'Camisa de Lino Casual', marca: 'University Club', temporada: 'Verano', categoria: 'Camisas', precio: 'S/99.00', imagen: 'camisa_lino.png'},
    { id: 4, nombre: 'Casaca Denim Clásica', marca: 'University Club', temporada: 'Invierno', categoria: 'Casacas', precio: 'S/149.00', imagen: 'casaca_denim.png'},
    { id: 11, nombre: 'Pantalón Chino Stretch', marca: 'University Club', temporada: 'Otoño', categoria: 'Pantalones', precio: 'S/119.00', imagen: 'pantalon_chino.png'},
    { id: 6, nombre: 'Polo con Cuello Redondo', marca: 'University Club', temporada: 'Primavera', categoria: 'Polos', precio: 'S/65.00', imagen: 'polo_redondo.png'},

    { id: 10, nombre: 'Polo Básico de Algodón', marca: 'Basement', temporada: 'Primavera', categoria: 'Polos', precio: 'S/59.00', imagen: 'polo_basico.png'},
    { id: 8, nombre: 'Casaca Bomber Minimal', marca: 'Basement', temporada: 'Invierno', categoria: 'Casacas', precio: 'S/159.00', imagen: 'casaca_bomber.png'},
    
    { id: 15, nombre: 'Pantalón Jogger Urbano', marca: 'Levis', temporada: 'Otoño', categoria: 'Pantalones', precio: 'S/109.00', imagen: 'pantalon_jogger.png'},
];

// --- DATOS SIMULADOS DEL PRODUCTO PRINCIPAL ---
const detalleProducto = {
    nombre: "Chaleco de traje",
    marca: "Basement",
    precio: 50.00,
    imagenes: {
        Negro: "imagenes/hombre/Polo/Polo Petit Piqué Hombre Lacoste.png",
        Blanco: "imagenes/mujer/Polo/Polo Casual Mujer Sybilla.png",
    },
    tallasColores: [
        { id: 1, talla: "S", color: "Negro", stock: 5, sku: "001N_S" },
        { id: 2, talla: "M", color: "Negro", stock: 12, sku: "001N_M" },
        { id: 3, talla: "L", color: "Negro", stock: 8, sku: "001N_L" },
        { id: 4, talla: "XL", color: "Negro", stock: 1, sku: "001N_XL" },
        { id: 5, talla: "S", color: "Blanco", stock: 20, sku: "001B_S" },
        { id: 6, talla: "M", color: "Blanco", stock: 15, sku: "001B_M" },
        { id: 7, talla: "L", color: "Blanco", stock: 0, sku: "001B_L" },
        { id: 8, talla: "XL", color: "Blanco", stock: 3, sku: "001B_XL" }
    ]
};

const datosInventario = [
  { SKU: '378291', nombre: 'Camiseta de algodón V-Neck', marca: 'Adidas', temporada: 'Verano', categoria: 'Camisa', precio: 49.99, genero: 'Caballeros', talla: 'XL', color: 'Blanco', cantidad: 40, ruta: 'imagenes/camiseta-blanca-xl.jpg' },
  { SKU: '904562', nombre: 'Pantalón chino Slim Fit', marca: 'Mossimo', temporada: 'Invierno', categoria: 'Pantalón', precio: 89.99, genero: 'Caballeros', talla: '34', color: 'Gris Melange', cantidad: 56, ruta: 'imagenes/pantalon-gris-34.jpg' },
  { SKU: '125078', nombre: 'Saco de lana Herringbone', marca: 'Tommy Hilfiger', temporada: 'Invierno', categoria: 'Abrigo', precio: 199.99, genero: 'Caballeros', talla: 'L', color: 'Burdeo', cantidad: 19, ruta: 'imagenes/saco-marron-l.jpg' },
  { SKU: '639145', nombre: 'Polo de piqué Regular Fit', marca: 'Lacoste', temporada: 'Verano', categoria: 'Polo', precio: 79.99, genero: 'Caballeros', talla: 'S', color: 'Verde Militar', cantidad: 79, ruta: 'imagenes/polo-verde-s.jpg' },
  { SKU: '852730', nombre: 'Vestido de flores A-Line', marca: 'Mango', temporada: 'Primavera', categoria: 'Vestido', precio: 59.99, genero: 'Damas', talla: 'M', color: 'Rojo', cantidad: 19, ruta: 'imagenes/vestido-flores-m.jpg' },
  { SKU: '416893', nombre: 'Blusa de seda con lazo', marca: 'Calvin Klein', temporada: 'Primavera', categoria: 'Blusa', precio: 69.99, genero: 'Damas', talla: 'S', color: 'Rosado Pastel', cantidad: 35, ruta: 'imagenes/blusa-rosa-xs.jpg' },
  { SKU: '770514', nombre: 'Falda de mezclilla High-Waist', marca: 'Denimlab', temporada: 'Verano', categoria: 'Falda', precio: 44.99, genero: 'Damas', talla: '28', color: 'Azul Marino', cantidad: 64, ruta: 'imagenes/falda-azul-28.jpg' },
  { SKU: '293687', nombre: 'Chaqueta de cuero Biker', marca: 'Lewis', temporada: 'Invierno', categoria: 'Chaqueta', precio: 299.99, genero: 'Caballeros', talla: 'L', color: 'Negro', cantidad: 88, ruta: 'imagenes/chaqueta-negra-l.jpg' },
  { SKU: '501429', nombre: 'Playera con estampado dino', marca: 'Puma', temporada: 'Verano', categoria: 'Polo', precio: 19.99, genero: 'Niños', talla: '8', color: 'Verde Militar', cantidad: 10, ruta: 'imagenes/playera-dino-8.jpg' },
  { SKU: '184963', nombre: 'Sudadera con capucha y cierre', marca: 'Adidas', temporada: 'Invierno', categoria: 'Ropa Deportiva', precio: 89.99, genero: 'Caballeros', talla: 'L', color: 'Gris Melange', cantidad: 26, ruta: 'imagenes/sudadera-gris-10.jpg' },
  { SKU: '957302', nombre: 'Pijama de franela de cuadros', marca: 'Hanes', temporada: 'Invierno', categoria: 'Pijama', precio: 39.99, genero: 'Niñas', talla: '6', color: 'Azul Marino', cantidad: 28, ruta: 'imagenes/pijama-cuadros-6.jpg' },
  { SKU: '621058', nombre: 'Polo deportivas Air Max', marca: 'Adidas', temporada: 'Verano', categoria: 'Polo', precio: 59.99, genero: 'Caballeros', talla: 'M', color: 'Negro', cantidad: 12, ruta: 'imagenes/polo-negro-m.jpg' },
  { SKU: '917302', nombre: 'Pijama de franela de cuadros', marca: 'Hanes', temporada: 'Invierno', categoria: 'Pijama', precio: 39.99, genero: 'Niñas', talla: '6', color: 'Rojo', cantidad: 28, ruta: 'imagenes/pijama-rojo-6.jpg' },
  { SKU: '911058', nombre: 'Pantalones deportivos', marca: 'Puma', temporada: 'Verano', categoria: 'Pantalón', precio: 49.99, genero: 'Damas', talla: 'S', color: 'Azul Marino', cantidad: 15, ruta: 'imagenes/pantalones-azul-s.jpg' }
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

export async function GetCatalogByGenger(id) {
    if(!useBackEnd){
      return datosProductos;
    }

    try {
      const response = await fetch(`http://localhost:9530/api/catalog/all/genero/${id}`, {
        method: "GET"
      });   

      // Si no hay contenido, retornamos null o un array vacío
      if (response.status === 204) {
        return []; // o null según prefieras
      }

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

export async function GetTemporadas() {
    if(!useBackEnd){
      return datosProductos;
    }

    try {
      const response = await fetch(`http://localhost:9530/api/temporada`, {
        method: "GET"
      });   

      // Si no hay contenido, retornamos null o un array vacío
      if (response.status === 204) {
        return []; // o null según prefieras
      }

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

export async function GetMarcas() {
    if(!useBackEnd){
      return datosProductos;
    }

    try {
      const response = await fetch(`http://localhost:9530/api/marca`, {
        method: "GET"
      });   

      // Si no hay contenido, retornamos null o un array vacío
      if (response.status === 204) {
        return []; // o null según prefieras
      }

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

export async function GetCategorias() {
    if(!useBackEnd){
      return datosProductos;
    }

    try {
      const response = await fetch(`http://localhost:9530/api/categoria`, {
        method: "GET"
      });   

      // Si no hay contenido, retornamos null o un array vacío
      if (response.status === 204) {
        return []; // o null según prefieras
      }

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

export async function GetDetalleProducto(id) {
    if(!useBackEnd){
      return detalleProducto;
    }

    try {
      const response = await fetch(`http://localhost:9530/api/catalog/producto/${id}`, {
        method: "GET"
      });   

      // Si no hay contenido, retornamos null o un array vacío
      if (response.status === 204) {
        return []; // o null según prefieras
      }

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

export async function Registro(userData) {
    try {
        const respuesta = await fetch(`http://localhost:9530/auth/register`, {
            method: 'POST', 
            
            headers: {
                'Content-Type': 'application/json'
            },

            body: JSON.stringify(userData) 
        });

        if (respuesta.status === 204) {
          return null;
        }

        if (!respuesta.ok) {
            const errorData = await respuesta.json();
            throw new Error(`Error ${respuesta.status}: ${errorData.message || 'Fallo en el registro.'}`);
        }

        const data = await respuesta.json();
        return data;

    } catch (error) {
      console.error("Fallo en el proceso de registro:", error.message);
      return null;
    }
}

export async function Login(userData) {
  try {
      const respuesta = await fetch(`http://localhost:9530/auth/login`, {
          method: 'POST', 
          
          headers: {
              'Content-Type': 'application/json'
          },

          body: JSON.stringify(userData) 
      });

      if (respuesta.status === 204) {
        return null;
      }

      if (!respuesta.ok) {
          const errorData = await respuesta.json();
          throw new Error(`Error ${respuesta.status}: ${errorData.message || 'Fallo en el registro.'}`);
      }

      const data = await respuesta.json();
      return data;

  } catch (error) {
    console.error("Fallo en el proceso de registro:", error.message);
    return null;
  }
}


export async function CrearProducto(productData) {
  try {
      const respuesta = await fetch(`http://localhost:9530/api/inventario/create`, {
          method: 'POST', 
          
          headers: {
              'Content-Type': 'application/json'
          },

          body: JSON.stringify(productData) 
      });

      if (respuesta.status === 204) {
        return null;
      }

      if (!respuesta.ok) {
          const errorData = await respuesta.json();
          throw new Error(`Error ${respuesta.status}: ${errorData.message || 'Fallo en el registro.'}`);
      }

      const data = await respuesta.json();
      return data;

  } catch (error) {
    console.error("Fallo en el proceso de registro:", error.message);
    return null;
  }
}

export async function GetInventario() {
  if(!useBackEnd) return datosInventario;

  try {
      const respuesta = await fetch(`http://localhost:9530/api/inventario`, {
          method: 'GET', 
      });

      if (respuesta.status === 204) {
        return null;
      }

      if (!respuesta.ok) {
          const errorData = await respuesta.json();
          throw new Error(`Error ${respuesta.status}: ${errorData.message || 'Fallo en el registro.'}`);
      }

      const data = await respuesta.json();
      return data;

  } catch (error) {
    console.error("Fallo en el proceso de registro:", error.message);
    return null;
  }
}

export async function UpdateStock(SKU, newStock) {
  try {
    const productData = { // Definimos el objeto a enviar
      SKU: SKU,
      NewStock: newStock 
    };

    const respuesta = await fetch(`http://localhost:9530/api/inventario/update/stock`, {
      method: 'PUT',

      headers: {
        'Content-Type': 'application/json'
      },

      // Usamos el objeto productData definido
      body: JSON.stringify(productData) 
    });

    // Tu lógica de manejo de respuesta
    if (respuesta.status === 204) {
      return null;
    }

    if (!respuesta.ok) {
      const errorData = await respuesta.json().catch(() => ({ message: 'Fallo en el registro.' }));
      throw new Error(`Error ${respuesta.status}: ${errorData.message}`);
    }

    const data = await respuesta.json();
    return data;

  } catch (error) {
    console.error("Fallo en el proceso de registro:", error.message);
    return null;
  }
}

export async function DeleteItemInventario(SKU) {
  try {

    const respuesta = await fetch(`http://localhost:9530/api/inventario/delete/${SKU}`, {
      method: 'DELETE',
    });

    // Tu lógica de manejo de respuesta
    if (respuesta.status === 204) {
      return null;
    }

    if (!respuesta.ok) {
      const errorData = await respuesta.json().catch(() => ({ message: 'Fallo en el registro.' }));
      throw new Error(`Error ${respuesta.status}: ${errorData.message}`);
    }

  } catch (error) {
    console.error("Fallo en el proceso de registro:", error.message);
    return null;
  }
}
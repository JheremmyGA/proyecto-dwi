const datosVentas = [
            { fecha: '02/04/2025', boleta: '378291', producto: 'Camiseta de algodón V-Neck XL', unid: 1, costo: 15.90, venta: 32.00, subtotal: 32.00 },
            { fecha: '02/04/2025', boleta: '378291', producto: 'Camiseta de algodón V-Neck XL', unid: 1, costo: 15.90, venta: 32.00, subtotal: 32.00 },
            { fecha: '02/04/2025', boleta: '378291', producto: 'Camiseta de algodón V-Neck XL', unid: 1, costo: 15.90, venta: 32.00, subtotal: 32.00 },
            { fecha: '02/04/2025', boleta: '378291', producto: 'Camiseta de algodón V-Neck XL', unid: 1, costo: 15.90, venta: 32.00, subtotal: 32.00 },
            { fecha: '02/04/2025', boleta: '378291', producto: 'Camiseta de algodón V-Neck XL', unid: 1, costo: 15.90, venta: 32.00, subtotal: 32.00 },
            { fecha: '02/04/2025', boleta: '378291', producto: 'Camiseta de algodón V-Neck XL', unid: 1, costo: 15.90, venta: 32.00, subtotal: 32.00 },
            { fecha: '02/04/2025', boleta: '378291', producto: 'Camiseta de algodón V-Neck XL', unid: 1, costo: 15.90, venta: 32.00, subtotal: 32.00 },
            { fecha: '02/04/2025', boleta: '378291', producto: 'Camiseta de algodón V-Neck XL', unid: 1, costo: 15.90, venta: 32.00, subtotal: 32.00 },
            { fecha: '02/04/2025', boleta: '378291', producto: 'Camiseta de algodón V-Neck XL', unid: 1, costo: 15.90, venta: 32.00, subtotal: 32.00 },
            { fecha: '02/04/2025', boleta: '378291', producto: 'Camiseta de algodón V-Neck XL', unid: 1, costo: 15.90, venta: 32.00, subtotal: 32.00 },
            // Simulamos muchas filas para el scroll
            { fecha: '02/04/2025', boleta: '378291', producto: 'Camiseta de algodón V-Neck XL', unid: 1, costo: 15.90, venta: 32.00, subtotal: 32.00 },
            { fecha: '03/04/2025', boleta: '888888', producto: 'Pantalón Chino Slim Fit', unid: 2, costo: 40.00, venta: 85.00, subtotal: 170.00 },
            { fecha: '03/04/2025', boleta: '888888', producto: 'Polo de piqué', unid: 1, costo: 20.00, venta: 45.00, subtotal: 45.00 },
        ];

        // ==============================================
        // LÓGICA DE RENDERIZADO Y CÁLCULO
        // ==============================================

        /**
         * Renderiza las filas de la tabla de ventas y calcula el importe total.
         * @param {Array<Object>} ventas - Los datos de ventas a renderizar.
         */
        function renderizarVentas(ventas) {
                    try {
                        const cuerpoTabla = document.getElementById('cuerpo-tabla-ventas');
                        const totalDisplay = document.getElementById('importe-total');
                        let importeTotal = 0;

                        console.log('[ventas] renderizarVentas called - ventas length =', ventas && ventas.length);

                        if (!cuerpoTabla || !totalDisplay) {
                            console.warn('[ventas] missing DOM elements: cuerpoTabla=', !!cuerpoTabla, 'totalDisplay=', !!totalDisplay);
                            return;
                        }

                        cuerpoTabla.innerHTML = ''; // Limpiar la tabla

                        ventas.forEach(item => {
                            try {
                                const fila = document.createElement('tr');
                                // Calcular subtotal real (aunque se usa el dato dummy, es buena práctica)
                                const subtotal = item.unid * item.venta; 
                                importeTotal += subtotal;

                                fila.innerHTML = `
                                    <td>${item.fecha}</td>
                                    <td>${item.boleta}</td>
                                    <td>${item.producto}</td>
                                    <td><input type="number" value="${item.unid}" readonly style="width: 45px;"></td>
                                    <td style="text-align: right;">${item.costo.toFixed(2)}</td>
                                    <td style="text-align: right;">${item.venta.toFixed(2)}</td>
                                    <td style="text-align: right;">${subtotal.toFixed(2)}</td>
                                `;
                                cuerpoTabla.appendChild(fila);
                                console.log('[ventas] appended row boleta=', item.boleta);
                            } catch (errRow) {
                                console.error('[ventas] error rendering row', item, errRow);
                            }
                        });

                        // Mostrar el importe total
                        totalDisplay.textContent = importeTotal.toFixed(2);
                    } catch (err) {
                        console.error('[ventas] renderizarVentas error', err);
                    }
        }
        
        // ==============================================
        // LÓGICA DE FILTROS Y BÚSQUEDA (Simulado)
        // ==============================================
        
        /**
         * Realiza la búsqueda y filtrado de los datos de ventas.
         * @param {string} query - El texto de búsqueda.
         */
        function buscarVentas(query) {
            query = query.toLowerCase().trim();
            
            if (!query) return datosVentas; // Si no hay query, devuelve todos los datos

            return datosVentas.filter(item => 
                item.producto.toLowerCase().includes(query) ||
                item.boleta.toLowerCase().includes(query)
            );
        }

        /**
         * Limpia la búsqueda y los filtros.
         */
        function limpiarTodo() {
            const input = document.querySelector('.input-buscador');
            if (input) input.value = '';
            // Aquí iría la lógica para limpiar filtros de fecha si existieran

            renderizarVentas(datosVentas);
        }


        // ==============================================
        // LÓGICA DEL MENÚ Y TIEMPO (De tus archivos JS)
        // ==============================================
        
        // Asumiendo que esta lógica está en menu.js y se ejecuta globalmente
        const toggle = document.querySelector(".toggle");
        const menuDashboard = document.querySelector(".menu-dashboard");
        const mainContent = document.querySelector('.main-content');
        const iconoMenu = toggle ? toggle.querySelector("i") : null;
        
        if (toggle && menuDashboard && mainContent) {
            toggle.addEventListener("click", () => {
                menuDashboard.classList.toggle("open");
                mainContent.classList.toggle('menu-open');

                if(iconoMenu.classList.contains("bx-menu")){
                    iconoMenu.classList.replace("bx-menu", "bx-x");
                }else {
                    iconoMenu.classList.replace("bx-x", "bx-menu");
                }
            });
        }
        
        /**
         * Función para actualizar la fecha y hora en tiempo real.
         */
        function updateDateTime() {
            // Esta función no se usa directamente en esta vista, pero la mantengo como placeholder si se agrega un span con ID="datetime"
        }


        // ==============================================
        // INICIALIZACIÓN
        // ==============================================
        document.addEventListener('DOMContentLoaded', () => {
            console.log('[ventas] DOMContentLoaded - datosVentas length =', datosVentas && datosVentas.length);
            // Renderizar la tabla de ventas al cargar
            renderizarVentas(datosVentas);
            
            // Asignar listeners a los botones de acción
            
            // Listener para el buscador
            const inputBuscador = document.querySelector('.input-buscador');
            if (inputBuscador) {
                inputBuscador.addEventListener('input', (e) => {
                    const resultados = buscarVentas(e.target.value);
                    renderizarVentas(resultados);
                });
            }
            
            // Listener para limpiar todo
            const botonLimpiar = document.querySelector('.boton-accion-secundario');
            if (botonLimpiar) {
                botonLimpiar.addEventListener('click', limpiarTodo);
            }
        });
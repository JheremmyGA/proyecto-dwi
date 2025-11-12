const datosVentas = [
            { fecha: '01/11/2025', boleta: '378291', producto: 'Camiseta de algodón V-Neck XL', unid: 2, costo: 20.90},
            { fecha: '01/11/2025', boleta: '378291', producto: 'Camiseta de algodón V-Neck XL', unid: 2, costo: 15.90},
            { fecha: '01/11/2025', boleta: '378292', producto: 'Camiseta de algodón V-Neck M', unid: 1, costo: 15.90},
            { fecha: '02/11/2025', boleta: '378292', producto: 'Camiseta de algodón V-Neck XL', unid: 3, costo: 15.90},
            { fecha: '02/11/2025', boleta: '378293', producto: 'Camiseta de algodón V-Neck S', unid: 1, costo: 15.90},
            { fecha: '02/11/2025', boleta: '378293', producto: 'Camiseta de algodón V-Neck XL', unid: 5, costo: 15.90},
            { fecha: '03/11/2025', boleta: '437291', producto: 'Camiseta de algodón V-Neck M', unid: 1, costo: 15.90},
            { fecha: '03/11/2025', boleta: '478291', producto: 'Camiseta de algodón V-Neck XL', unid: 1, costo: 15.90},
            { fecha: '03/11/2025', boleta: '278291', producto: 'Camiseta de algodón V-Neck XL', unid: 4, costo: 15.90},
            { fecha: '04/11/2025', boleta: '278291', producto: 'Camiseta de algodón V-Neck XL', unid: 1, costo: 15.90},
            { fecha: '04/11/2025', boleta: '378291', producto: 'Camiseta de algodón V-Neck XL', unid: 1, costo: 15.90},
            { fecha: '05/11/2025', boleta: '988888', producto: 'Pantalón Chino Slim Fit', unid: 2, costo: 40.00},
            { fecha: '05/11/2025', boleta: '888888', producto: 'Polo de piqué', unid: 1, costo: 20.00},
            { fecha: '09/11/2025', boleta: '998888', producto: 'Pantalón Chino Slim Fit', unid: 2, costo: 40.00},
            { fecha: '09/11/2025', boleta: '018888', producto: 'Jean negro XL', unid: 1, costo: 81.20},
            { fecha: '11/11/2025', boleta: '018888', producto: 'Polo de piqué', unid: 1, costo: 23.00},
            { fecha: '11/11/2025', boleta: '028888', producto: 'Pantalón Chino Slim Fit', unid: 2, costo: 45.00},
            { fecha: '11/11/2025', boleta: '038888', producto: 'Jean negro XL', unid: 1, costo: 90.00}
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
                                // Calcular subtotal basado en el costo
                                const subtotal = item.unid * item.costo;
                                importeTotal += subtotal;

                                fila.innerHTML = `
                                    <td>${item.fecha}</td>
                                    <td>${item.boleta}</td>
                                    <td>${item.producto}</td>
                                    <td><input type="number" value="${item.unid}" readonly style="width: 45px;"></td>
                                    <td style="text-align: right;">${item.costo.toFixed(2)}</td>
                                    <td style="text-align: right;">${(item.unid * item.costo).toFixed(2)}</td>
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
        /**
         * Busca y filtra por texto y por rango de fechas (si los inputs están presentes).
         * @param {string} query - Texto de búsqueda
         * @returns {Array} resultados filtrados
         */
        function buscarVentas(query) {
            query = (query || '').toLowerCase().trim();

            // Obtener valores de fecha desde el DOM (YYYY-MM-DD)
            const inputInicio = document.querySelector('.input-fecha-inicio');
            const inputFin = document.querySelector('.input-fecha-fin');
            const inicio = inputInicio && inputInicio.value ? inputInicio.value : '';
            const fin = inputFin && inputFin.value ? inputFin.value : '';

            // Convierte una fecha DD/MM/YYYY a objeto Date (local)
            function parseItemFecha(fechaStr) {
                const parts = fechaStr.split('/'); // DD/MM/YYYY
                if (parts.length !== 3) return null;
                const d = parseInt(parts[0], 10);
                const m = parseInt(parts[1], 10) - 1;
                const y = parseInt(parts[2], 10);
                return new Date(y, m, d);
            }

            // Convierte YYYY-MM-DD a objeto Date
            function parseInputDate(fechaInput) {
                if (!fechaInput) return null;
                const parts = fechaInput.split('-'); // YYYY-MM-DD
                if (parts.length !== 3) return null;
                const y = parseInt(parts[0], 10);
                const m = parseInt(parts[1], 10) - 1;
                const d = parseInt(parts[2], 10);
                return new Date(y, m, d);
            }

            const fechaInicio = parseInputDate(inicio);
            const fechaFin = parseInputDate(fin);

            // Normalmente devolvemos los datos originales
            let resultados = datosVentas.slice();

            // Filtrar por texto si existe
            if (query) {
                // Detectar prefijos explícitos: 'boleta:123' o 'id:123'
                const prefixMatch = query.match(/^(?:boleta|id)\s*:\s*(.+)$/i);
                if (prefixMatch) {
                    const searchVal = prefixMatch[1].trim().toLowerCase();
                    resultados = resultados.filter(item => String(item.boleta).toLowerCase().includes(searchVal));
                } else {
                    // Si la query es numérica (ej. '378291'), buscar por boleta por defecto
                    const numericOnly = query.replace(/\s+/g, '');
                    if (/^\d+$/.test(numericOnly)) {
                        resultados = resultados.filter(item => String(item.boleta).toLowerCase().includes(numericOnly));
                    } else {
                        // Búsqueda por producto o por boleta parcial
                        resultados = resultados.filter(item =>
                            (item.producto && item.producto.toLowerCase().includes(query)) ||
                            (item.boleta && item.boleta.toLowerCase().includes(query))
                        );
                    }
                }
            }

            // Filtrar por rango de fechas si se proporcionó cualquiera de las dos
            if (fechaInicio || fechaFin) {
                resultados = resultados.filter(item => {
                    const itemFecha = parseItemFecha(item.fecha);
                    if (!itemFecha) return false;

                    if (fechaInicio && fechaFin) {
                        // Incluir inclusive
                        return itemFecha >= fechaInicio && itemFecha <= fechaFin;
                    }
                    if (fechaInicio && !fechaFin) {
                        return itemFecha >= fechaInicio;
                    }
                    if (!fechaInicio && fechaFin) {
                        return itemFecha <= fechaFin;
                    }
                    return true;
                });
            }

            return resultados;
        }

        /**
         * Limpia la búsqueda y los filtros.
         */
        function limpiarTodo() {
            const input = document.querySelector('.input-buscador');
            const inicio = document.querySelector('.input-fecha-inicio');
            const fin = document.querySelector('.input-fecha-fin');
            const rango = document.querySelector('.filtro-fecha-rango');

            if (input) input.value = '';
            if (inicio) inicio.value = '';
            if (fin) fin.value = '';
            if (rango) rango.style.display = 'none';

            renderizarVentas(datosVentas);
        }

        /**
         * Actualiza la UI de filtros activos (badges) según los valores actuales de búsqueda y fechas
         */
        function updateActiveFilters() {
            const container = document.querySelector('.filtros-activos');
            if (!container) return;
            container.innerHTML = '';

            const inputBuscador = document.querySelector('.input-buscador');
            const q = inputBuscador ? inputBuscador.value.trim() : '';

            // Detectar búsqueda por boleta (prefijo o query numérica)
            let boletaVal = '';
            if (q) {
                const lower = q.toLowerCase();
                const prefixMatch = lower.match(/^(?:boleta|id)\s*:\s*(.+)$/i);
                if (prefixMatch && prefixMatch[1]) {
                    boletaVal = prefixMatch[1].trim();
                } else if (/^\d+$/.test(q.replace(/\s+/g, ''))) {
                    boletaVal = q.replace(/\s+/g, '');
                }
            }

            if (boletaVal) {
                const span = document.createElement('span');
                span.className = 'filtro-badge';
                span.innerHTML = `<span class="filtro-text">Boleta: ${boletaVal}</span><button class="badge-close" data-type="boleta" title="Quitar filtro">×</button>`;
                container.appendChild(span);
            }

            const inputInicio = document.querySelector('.input-fecha-inicio');
            const inputFin = document.querySelector('.input-fecha-fin');
            if ((inputInicio && inputInicio.value) || (inputFin && inputFin.value)) {
                const start = inputInicio && inputInicio.value ? inputInicio.value.split('-').reverse().join('/') : '';
                const end = inputFin && inputFin.value ? inputFin.value.split('-').reverse().join('/') : '';
                const text = start && end ? `${start} — ${end}` : (start ? `${start} —` : `— ${end}`);
                const span = document.createElement('span');
                span.className = 'filtro-badge';
                span.innerHTML = `<span class="filtro-text">Fechas: ${text}</span><button class="badge-close" data-type="fecha" title="Quitar filtro">×</button>`;
                container.appendChild(span);
            }

            // Evento delegado para cerrar badges
            container.onclick = function (e) {
                const btn = e.target.closest('.badge-close');
                if (!btn) return;
                const type = btn.dataset.type;
                if (type === 'boleta') {
                    const bInput = document.querySelector('.input-buscador');
                    if (bInput) bInput.value = '';
                } else if (type === 'fecha') {
                    const i = document.querySelector('.input-fecha-inicio');
                    const f = document.querySelector('.input-fecha-fin');
                    const rango = document.querySelector('.filtro-fecha-rango');
                    if (i) i.value = '';
                    if (f) f.value = '';
                    if (rango) rango.style.display = 'none';
                }
                const resultados = buscarVentas(document.querySelector('.input-buscador') ? document.querySelector('.input-buscador').value : '');
                renderizarVentas(resultados);
                updateActiveFilters();
            };
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
                    updateActiveFilters();
                });
            }

            // Fecha: botones e inputs
            const botonFecha = document.querySelector('.boton-filtro-fecha');
            const contenedorRango = document.querySelector('.filtro-fecha-rango');
            const inputInicio = document.querySelector('.input-fecha-inicio');
            const inputFin = document.querySelector('.input-fecha-fin');
            const botonAplicar = document.querySelector('.boton-aplicar-fecha');

            if (botonFecha && contenedorRango) {
                botonFecha.addEventListener('click', (ev) => {
                    ev.stopPropagation();
                    contenedorRango.style.display = contenedorRango.style.display === 'none' ? 'flex' : 'none';
                });

                // Cerrar si se hace click fuera
                document.addEventListener('click', (e) => {
                    if (!e.target.closest('.filtro-fecha-contenedor')) {
                        contenedorRango.style.display = 'none';
                    }
                });
            }

            // Aplicar filtro al cambiar inputs o al pulsar 'Aplicar'
            if (inputInicio) {
                inputInicio.addEventListener('change', () => {
                    const resultados = buscarVentas(inputBuscador ? inputBuscador.value : '');
                    renderizarVentas(resultados);
                    updateActiveFilters();
                });
            }
            if (inputFin) {
                inputFin.addEventListener('change', () => {
                    const resultados = buscarVentas(inputBuscador ? inputBuscador.value : '');
                    renderizarVentas(resultados);
                    updateActiveFilters();
                });
            }
            if (botonAplicar) {
                botonAplicar.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const resultados = buscarVentas(inputBuscador ? inputBuscador.value : '');
                    renderizarVentas(resultados);
                    updateActiveFilters();
                });
            }

            // Listener para limpiar todo
            const botonLimpiar = document.querySelector('.boton-accion-secundario');
            if (botonLimpiar) {
                botonLimpiar.addEventListener('click', limpiarTodo);
            }
            // Inicializar badges al cargar
            updateActiveFilters();
        });
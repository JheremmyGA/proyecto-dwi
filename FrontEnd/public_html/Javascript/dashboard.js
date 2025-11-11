// --- 1. DATA QUEMADA (Simulación de Inventario) ---
const productosData = [
    { sku: 'J30N', nombre: 'Jean Básico Slim Fit', marca: 'Denimlab', temporada: 'Otoño', categoria: 'Jean', precio: 'S/129.00', genero: 'Caballeros', talla: '30', color: 'Negro', stock: 15 },
    { sku: 'J32N', nombre: 'Jean Básico Slim Fit', marca: 'Denimlab', temporada: 'Otoño', categoria: 'Jean', precio: 'S/129.00', genero: 'Caballeros', talla: '32', color: 'Negro', stock: 8 },
    { sku: 'J34N', nombre: 'Jean Básico Slim Fit', marca: 'Denimlab', temporada: 'Otoño', categoria: 'Jean', precio: 'S/129.00', genero: 'Caballeros', talla: '34', color: 'Negro', stock: 3 },
    { sku: 'PMA', nombre: 'Polo Piqué Clásico', marca: 'Mossimo', temporada: 'Verano', categoria: 'Polo', precio: 'S/69.90', genero: 'Caballeros', talla: 'M', color: 'Azul Marino', stock: 25 },
    { sku: 'PLA', nombre: 'Polo Piqué Clásico', marca: 'Mossimo', temporada: 'Verano', categoria: 'Polo', precio: 'S/69.90', genero: 'Caballeros', talla: 'L', color: 'Azul Marino', stock: 10 },
    { sku: 'CSB', nombre: 'Camisa Oxford Regular', marca: 'Tommy Hilfiger', temporada: 'Primavera', categoria: 'Camisa', precio: 'S/249.00', genero: 'Caballeros', talla: 'S', color: 'Blanco', stock: 18 },
    { sku: 'VRX', nombre: 'Vestido Midi Floral', marca: 'Sybilla', temporada: 'Primavera', categoria: 'Vestido', precio: 'S/159.00', genero: 'Damas', talla: 'XS', color: 'Rosado Pastel', stock: 5 },
    { sku: 'VRS', nombre: 'Vestido Midi Floral', marca: 'Sybilla', temporada: 'Primavera', categoria: 'Vestido', precio: 'S/159.00', genero: 'Damas', talla: 'S', color: 'Rosado Pastel', stock: 12 },
    { sku: 'CXLM', nombre: 'Chaqueta Bomber', marca: 'Basement', temporada: 'Invierno', categoria: 'Chaqueta', precio: 'S/199.00', genero: 'Caballeros', talla: 'XL', color: 'Verde Militar', stock: 1 },
    { sku: 'SSGM', nombre: 'Suéter Cuello Redondo', marca: 'Mango', temporada: 'Otoño', categoria: 'Suéter', precio: 'S/179.00', genero: 'Damas', talla: 'S', color: 'Gris Melange', stock: 20 },
    { sku: 'SMGM', nombre: 'Suéter Cuello Redondo', marca: 'Mango', temporada: 'Otoño', categoria: 'Suéter', precio: 'S/179.00', genero: 'Damas', talla: 'M', color: 'Gris Melange', stock: 7 },
    { sku: 'RDPMN', nombre: 'Jogger Deportivo Tech', marca: 'Adidas', temporada: 'Invierno', categoria: 'Ropa Deportiva', precio: 'S/149.00', genero: 'Caballeros', talla: 'M', color: 'Negro', stock: 4 }
];

const CHART_COLORS = {
    primary: '#B80000',
    secondary: 'rgba(184, 0, 0, 0.5)',
    lightGrey: '#e9ecef',
};


document.addEventListener('DOMContentLoaded', () => {
    cargarKpis();
    crearGraficoMetaMensual(75.55);
    crearGraficoVentasMensuales();
    crearGraficoEstadisticas(); // inicial
    activarTabsEstadisticas(); // 🔥 hace el gráfico interactivo
});

function cargarKpis() {
    // Futuro: cálculos reales
}

// --- 2. FUNCIONES DE GRÁFICOS (Chart.js) ---

// 2.1 Meta Mensual
function crearGraficoMetaMensual(porcentaje) {
    const ctx = document.getElementById('chart-monthly-target').getContext('2d');
    const restante = 100 - porcentaje;

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Completado', 'Restante'],
            datasets: [{
                data: [porcentaje, restante],
                backgroundColor: [CHART_COLORS.primary, CHART_COLORS.lightGrey],
                borderWidth: 0,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '80%',
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
        }
    });
}

// 2.2 Ventas Mensuales
function crearGraficoVentasMensuales() {
    const dataVentas = {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [{
            label: 'Ventas',
            data: [150, 400, 250, 300, 180, 200, 300, 100, 250, 400, 300, 80],
            backgroundColor: CHART_COLORS.secondary,
            borderColor: CHART_COLORS.primary,
            borderWidth: 1,
            borderRadius: 8,
        }]
    };

    const ctx = document.getElementById('chart-monthly-sales').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: dataVentas,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { display: false } },
                x: { grid: { display: false } }
            }
        }
    });
}


// 2.3 Estadísticas Interactivo
let graficoEstadisticas; // Variable global para actualizar dinámicamente

function crearGraficoEstadisticas(tipo = 'general') {
    const ctx = document.getElementById('chart-statistics').getContext('2d');

    // Si ya existe un gráfico, lo destruimos para crear uno nuevo
    if (graficoEstadisticas) graficoEstadisticas.destroy();

    // Datos diferentes según el tipo
    let datasets;
    if (tipo === 'ventas') {
        datasets = [{
            label: 'Ventas',
            data: [180, 220, 300, 250, 400, 350, 370, 410, 390, 420, 480, 500],
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: CHART_COLORS.primary,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
        }];
    } else if (tipo === 'ingresos') {
        datasets = [{
            label: 'Ingresos (S/)',
            data: [280, 310, 360, 420, 460, 490, 510, 530, 580, 600, 650, 700],
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: CHART_COLORS.primary,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
        }];
    } else {
        datasets = [{
            label: 'General',
            data: [180, 160, 150, 170, 190, 220, 250, 200, 230, 240, 220, 200],
            backgroundColor: 'rgba(92, 103, 240, 0.2)',
            borderColor: CHART_COLORS.primary,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
        }];
    }

    graficoEstadisticas = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: { color: '#333' }
                }
            },
            scales: {
                y: { grid: { color: '#eee' } },
                x: { grid: { display: false } }
            }
        }
    });
}

// --- 3. INTERACTIVIDAD DE LAS PESTAÑAS ---
function activarTabsEstadisticas() {
    const botones = document.querySelectorAll('.tab-button');
    botones.forEach(btn => {
        btn.addEventListener('click', () => {
            // Quitar clase activa de todos
            botones.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Determinar el tipo según el texto
            const tipo = btn.textContent.trim().toLowerCase();
            if (tipo.includes('venta')) crearGraficoEstadisticas('ventas');
            else if (tipo.includes('ingreso')) crearGraficoEstadisticas('ingresos');
            else crearGraficoEstadisticas('general');
        });
    });
}

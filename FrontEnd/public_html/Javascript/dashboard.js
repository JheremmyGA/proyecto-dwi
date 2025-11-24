// DATOS SIMULADOS
const ventasData = [
    { fecha: "2025-01-03", monto: 150 },
    { fecha: "2025-01-08", monto: 200 },
    { fecha: "2025-01-15", monto: 400 },
    { fecha: "2025-01-21", monto: 320 },
    { fecha: "2025-01-28", monto: 180 },

    { fecha: "2025-02-02", monto: 220 },
    { fecha: "2025-02-06", monto: 250 },
    { fecha: "2025-02-12", monto: 300 },
    { fecha: "2025-02-20", monto: 310 },
    { fecha: "2025-02-25", monto: 270 },

    { fecha: "2025-03-01", monto: 190 },
    { fecha: "2025-03-05", monto: 180 },
    { fecha: "2025-03-10", monto: 200 },
    { fecha: "2025-03-14", monto: 300 },
    { fecha: "2025-03-22", monto: 250 },

    { fecha: "2025-04-02", monto: 100 },
    { fecha: "2025-04-08", monto: 220 },
    { fecha: "2025-04-18", monto: 250 },
    { fecha: "2025-04-25", monto: 300 },

    { fecha: "2025-05-01", monto: 400 },
    { fecha: "2025-05-07", monto: 320 },
    { fecha: "2025-05-12", monto: 300 },
    { fecha: "2025-05-20", monto: 350 },
    { fecha: "2025-05-28", monto: 280 },

    { fecha: "2025-06-05", monto: 150 },
    { fecha: "2025-06-12", monto: 200 },
    { fecha: "2025-06-20", monto: 80 },
    { fecha: "2025-06-25", monto: 170 },

    { fecha: "2025-07-02", monto: 210 },
    { fecha: "2025-07-07", monto: 220 },
    { fecha: "2025-07-14", monto: 300 },
    { fecha: "2025-07-21", monto: 330 },
    { fecha: "2025-07-28", monto: 250 },

    { fecha: "2025-08-03", monto: 400 },
    { fecha: "2025-08-10", monto: 420 },
    { fecha: "2025-08-18", monto: 380 },
    { fecha: "2025-08-24", monto: 360 },

    { fecha: "2025-09-03", monto: 280 },
    { fecha: "2025-09-10", monto: 300 },
    { fecha: "2025-09-17", monto: 320 },
    { fecha: "2025-09-25", monto: 350 },

    { fecha: "2025-10-02", monto: 310 },
    { fecha: "2025-10-12", monto: 360 },
    { fecha: "2025-10-18", monto: 330 },
    { fecha: "2025-10-28", monto: 400 },

    { fecha: "2025-11-02", monto: 500 },
    { fecha: "2025-11-10", monto: 610 },
    { fecha: "2025-11-15", monto: 420 },
    { fecha: "2025-11-18", monto: 420 },
    { fecha: "2025-11-25", monto: 350 },

    { fecha: "2025-12-01", monto: 300 },
    { fecha: "2025-12-08", monto: 400 },
    { fecha: "2025-12-15", monto: 450 },
    { fecha: "2025-12-22", monto: 500 },
    { fecha: "2025-12-28", monto: 480 }
];


const CHART_COLORS = {
    primary: '#B80000',
    secondary: 'rgba(184, 0, 0, 0.4)',
    grey: '#e0e0e0'
};


let graficoMeta = null;
let graficoVentasMensuales = null;
let graficoEstadisticas = null;
let flatpickrInstance = null;


document.addEventListener("DOMContentLoaded", () => {
    inicializarCalendario();
    cargarKpis(ventasData);
    crearGraficoMetaMensual(75.55);
    crearGraficoVentasMensuales(ventasData);
    crearGraficoEstadisticas("general", ventasData);
    activarTabsEstadisticas();
    activarBotonesRange();
});


// --------- KPIs ---------
function cargarKpis(data) {
    const totalPedidos = data.length;
    const ingresos = data.reduce((s, v) => s + v.monto, 0);
    const promedio = totalPedidos ? ingresos / totalPedidos : 0;

    document.getElementById("totalPedidos").textContent = totalPedidos;
    document.getElementById("ingresos-value").textContent = `S/ ${ingresos.toFixed(2)}`;
    document.getElementById("hoy-value").textContent = `S/ ${promedio.toFixed(2)}`;
}


function inicializarCalendario() {
    flatpickrInstance = flatpickr("#flatpickr-range", {
        mode: "range",
        dateFormat: "Y-m-d",
        static: true,              
        inline: true,              
        locale: "es",
        showMonths: 1,
        onChange: function (selectedDates) {
            if (selectedDates.length === 2) {
                actualizarRangoSeleccionado(selectedDates[0], selectedDates[1]);
            }
        }
    });

    document.getElementById("date-status").textContent = "Rango actual: —";
}

// --------- Botones Aplicar / Limpiar ---------
function activarBotonesRange() {
    document.getElementById("btnClearRange").addEventListener("click", () => {
        flatpickrInstance.clear();
        cargarKpis(ventasData);
        crearGraficoVentasMensuales(ventasData);
        crearGraficoEstadisticas("general", ventasData);
        crearGraficoMetaMensual(75.55);

        document.getElementById("date-status").textContent = "Rango actual: —";
        document.getElementById("rangoFechasTexto").textContent = "🗓 Selecciona un rango";
    });

    document.getElementById("btnApplyRange").addEventListener("click", () => {
        const fechas = flatpickrInstance.selectedDates;
        if (fechas.length === 2) {
            actualizarRangoSeleccionado(fechas[0], fechas[1]);
        } else {
            alert("Selecciona un rango de fechas primero.");
        }
    });
}

// --------- Actualizar por rango ---------
function actualizarRangoSeleccionado(start, end) {
    const inicio = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    const fin = new Date(end.getFullYear(), end.getMonth(), end.getDate());

    const filtrado = ventasData.filter(v => {
        const fechaVenta = new Date(v.fecha + "T00:00:00");
        return fechaVenta >= inicio && fechaVenta <= fin;
    });

    cargarKpis(filtrado);
    crearGraficoVentasMensuales(filtrado);

    const tab = document.querySelector(".tab-button.active").textContent.toLowerCase();
    if (tab.includes("ventas")) crearGraficoEstadisticas("ventas", filtrado);
    else if (tab.includes("ingresos")) crearGraficoEstadisticas("ingresos", filtrado);
    else crearGraficoEstadisticas("general", filtrado);

    // Meta mensual dinámicamente
    const ingresos = filtrado.reduce((s, v) => s + v.monto, 0);
    const meta = 3000;
    const porcentaje = meta ? Math.min(100, (ingresos / meta) * 100) : 0;

    crearGraficoMetaMensual(porcentaje);
    document.getElementById("target-percentage").textContent = `${porcentaje.toFixed(1)}%`;

    const f = d => d.toISOString().slice(0, 10);
    document.getElementById("date-status").textContent = `Rango actual: ${f(inicio)} → ${f(fin)}`;
    document.getElementById("rangoFechasTexto").textContent = `🗓 ${f(inicio)} → ${f(fin)}`;
}




// --------- Meta mensual ---------
function crearGraficoMetaMensual(porcentaje) {
    const ctx = document.getElementById("chart-monthly-target").getContext("2d");

    if (graficoMeta) graficoMeta.destroy();

    graficoMeta = new Chart(ctx, {
        type: "doughnut",
        data: {
            labels: ["Completado", "Restante"],
            datasets: [{
                data: [porcentaje, Math.max(0, 100 - porcentaje)],
                backgroundColor: [CHART_COLORS.primary, CHART_COLORS.grey],
                borderWidth: 0
            }]
        },
        options: {
            cutout: "75%",
            plugins: { legend: { display: false } }
        }
    });
}

// --------- Ventas mensuales ---------
function crearGraficoVentasMensuales(data) {
    const ctx = document.getElementById("chart-monthly-sales").getContext("2d");

    if (graficoVentasMensuales) graficoVentasMensuales.destroy();

    const meses = new Array(12).fill(0);
    data.forEach(v => {
        const m = new Date(v.fecha).getMonth();
        meses[m] += v.monto;
    });

    graficoVentasMensuales = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"],
            datasets: [{
                label: "Ventas",
                data: meses,
                backgroundColor: CHART_COLORS.secondary,
                borderColor: CHART_COLORS.primary,
                borderWidth: 1,
                borderRadius: 6
            }]
        }
    });
}

// --------- Estadísticas ---------
function crearGraficoEstadisticas(tipo, data) {
    const ctx = document.getElementById("chart-statistics").getContext("2d");

    if (graficoEstadisticas) graficoEstadisticas.destroy();

    const labels = data.map(v => v.fecha);
    let valores = [];

    if (tipo === "ventas") valores = data.map(v => v.monto);
    else if (tipo === "ingresos") valores = data.map(v => v.monto * 1.18);
    else valores = data.map(v => v.monto);

    graficoEstadisticas = new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [{
                label: tipo.toUpperCase(),
                data: valores,
                borderColor: CHART_COLORS.primary,
                backgroundColor: "rgba(184,0,0,0.15)",
                fill: true,
                tension: 0.3
            }]
        }
    });
}


function activarTabsEstadisticas() {
    document.querySelectorAll(".tab-button").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".tab-button").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            const tipo = btn.textContent.toLowerCase();
            const rango = flatpickrInstance.selectedDates;

            const base = (rango.length === 2)
                ? ventasData.filter(v => {
                    const d = new Date(v.fecha + "T00:00:00");
                    return d >= rango[0] && d <= rango[1];
                })
                : ventasData;

            if (tipo.includes("ventas")) crearGraficoEstadisticas("ventas", base);
            else if (tipo.includes("ingresos")) crearGraficoEstadisticas("ingresos", base);
            else crearGraficoEstadisticas("general", base);
        });
    });
}

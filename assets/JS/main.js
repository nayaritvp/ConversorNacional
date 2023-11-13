async function fetchApiPromise(url) {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Error en la solicitud a la API. Código de respuesta: ${response.status}`);
    }

    const data = await response.json();
    return data; 
}

async function main() {
    try {
        const data = await fetchApiPromise("https://mindicador.cl/api/");
        const currencies = data.moneda;

        const cantidadUno = document.getElementById("cantidad_uno");
        const selectorDos = document.getElementById("selector_dos");
        const cantidadDos = document.getElementById("cantidad_dos");
        const botonBuscar = document.getElementById("botonbuscar");
        const rateDiv = document.getElementById("rate");

        botonBuscar.addEventListener("click", async function() {
            try {
                const data = await fetchApiPromise("https://mindicador.cl/api/");
        
                if (!data || !data.uf || !data.ivp || !data.dolar || !data.euro) {
                    throw new Error("La respuesta de la API no tiene la estructura esperada.");
                }
        
                const currencies = {
                    "EUR": data.euro.valor,
                    "USD": data.dolar.valor,
                };
        
                const cantidadUnoValue = parseFloat(cantidadUno.value);
                const monedaOrigen = "CLP";
                const monedaDestinoSeleccionada = selectorDos.value;
        
                if (isNaN(cantidadUnoValue)) {
                    rateDiv.textContent = "Ingresa una cantidad válida.";
                    return;
                }
        
                if (monedaDestinoSeleccionada === "cual") {
                    rateDiv.textContent = "Selecciona una moneda de destino.";
                    return;
                }
                const tasaCambio = currencies[monedaDestinoSeleccionada];
                const resultado = cantidadUnoValue / tasaCambio;
        
                cantidadDos.value = resultado.toFixed(2);
                rateDiv.textContent = `1 ${monedaOrigen} = ${1 / tasaCambio} ${monedaDestinoSeleccionada}`;
            } catch (error) {
                console.error("Error al obtener la API:", error);
                rateDiv.textContent = "Error al obtener los datos de la API.";
            }
        });

        console.log(data);
    } catch (error) {
        console.error("Error al obtener la API:", error);
    }
}

function mapMonedaSeleccionada(valorSeleccionado) {
    switch (valorSeleccionado) {
        case "Dólar":
            return "dolar";
        case "Euro":
            return "euro";
        default:
            return "";
    }
}

main();

const ctx = document.getElementById('myChart');

new Chart(ctx, {
  type: 'line',
  data: {
    labels: ['2023-11-02', '2023-11-03', '2023-11-04', '2023-11-05', '2023-11-06', '2023-11-07', '2023-11-08', '2023-11-09', '2023-11-10', '2023-11-11'],
    datasets: [{
      label: 'Historial Valor de la Moneda',
      data: [887.16, 878.51, 882.65, 882.65, 881.80, 886.32, 898.87, 911.25, 909.18, 914.70],
      borderWidth: 1
    }]
  },
  options: {
    scales: {
      y: {
        beginAtZero: true,
        stepSize: 10,
        min: 850,
        max: 1000,
        maintainAspectRatio: false,
        responsive: true,
      }
    }
  }
});

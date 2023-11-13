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

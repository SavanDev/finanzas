// URL de la API del BCRA
const apiUrl = 'https://api.bcra.gob.ar/estadisticas/v2.0/principalesvariables';
const month = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

let reservasValor;
let reservasFecha;

let baseMonetariaValor;
let baseMonetariaFecha;

let tasaValor;
let tasaFecha;

let inflacionValor;
let inflacionFecha;

let interanualValor;
let interanualFecha;

let dolarMinorista;
let minoristaFecha;

let dolarMayorista;
let mayoristaFecha;

const dateDifferenceInSeconds = (dateInitial, dateFinal) =>
    (dateFinal - dateInitial) / 86_400_000;

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

async function obtenerDatosBCRA() 
{
    // Hacer la solicitud a la API del BCRA
    fetch(apiUrl, {
        method: 'GET', // La API puede requerir GET o POST dependiendo del endpoint
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (!response.ok) {
            // Manejar errores HTTP
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json(); // Parsear la respuesta como JSON
    }).then(data => {
        // Trabajar con los datos recibidos
        console.log(data);

        data.results.forEach(element => {
            if (element.idVariable == 1) {
                reservasValor = element.valor;
                reservasFecha = Date.parse(element.fecha);
            }
            if (element.idVariable == 15) {
                baseMonetariaValor = element.valor;
                baseMonetariaFecha = Date.parse(element.fecha);
            }
            if (element.idVariable == 6) {
                tasaValor = element.valor;
                tasaFecha = Date.parse(element.fecha);
            }
            if (element.idVariable == 27) {
                inflacionValor = element.valor;
                inflacionFecha = Date.parse(element.fecha);
            }
            if (element.idVariable == 28) {
                interanualValor = element.valor;
                interanualFecha = Date.parse(element.fecha);
            }
            if (element.idVariable == 4) {
                dolarMinorista = element.valor;
                minoristaFecha = Date.parse(element.fecha);
            }
            if (element.idVariable == 5) {
                dolarMayorista = element.valor;
                mayoristaFecha = Date.parse(element.fecha);
            }
        });
        mostrarValores();
    }).catch(error => {
        // Manejar errores de red u otros errores
        console.error('There was a problem with the fetch operation:', error);
    });
}

function mostrarValores() {
    // Reservas BCRA
    document.getElementById("valorReservas").innerHTML = "$ " + numberWithCommas(Math.trunc(reservasValor));
    document.getElementById("fechaReservas").innerHTML = "Hace " + Math.trunc(dateDifferenceInSeconds(reservasFecha, Date.now())) + " días";

    // Base monetaria
    document.getElementById("valorBaseMonetaria").innerHTML = "$ " + numberWithCommas(Math.trunc(baseMonetariaValor));
    document.getElementById("fechaBaseMonetaria").innerHTML = "Hace " + Math.trunc(dateDifferenceInSeconds(baseMonetariaFecha, Date.now())) + " días";

    // Tasa de política monetaria
    document.getElementById("valorTasa").innerHTML = tasaValor + "%";
    document.getElementById("fechaTasa").innerHTML = "Hace " + Math.trunc(dateDifferenceInSeconds(tasaFecha, Date.now())) + " días";

    // Inflación mensual
    document.getElementById("valorInfla").innerHTML = inflacionValor + "%";
    document.getElementById("fechaInfla").innerHTML = month[new Date(inflacionFecha).getMonth()];

    // Inflación interanual
    document.getElementById("valorInter").innerHTML = interanualValor + "%";
    document.getElementById("fechaInter").innerHTML = month[new Date(interanualFecha).getMonth()];

    // Dólar reservas
    document.getElementById("dolarReserva").innerHTML = "$ " + Math.trunc(baseMonetariaValor / reservasValor);
    document.getElementById("fechaDolarReserva").innerHTML = month[new Date(Date.now()).getMonth()];

    // Dólar minorista
    document.getElementById("dolarMinor").innerHTML = "$ " + numberWithCommas(Math.trunc(dolarMinorista));
    document.getElementById("fechaDolarMinor").innerHTML = "Hace " + Math.trunc(dateDifferenceInSeconds(minoristaFecha, Date.now())) + " días";

    // Dólar mayorista
    document.getElementById("dolarMayor").innerHTML = "$ " + numberWithCommas(Math.trunc(dolarMayorista));
    document.getElementById("fechaDolarMayor").innerHTML = "Hace " + Math.trunc(dateDifferenceInSeconds(mayoristaFecha, Date.now())) + " días";
}

obtenerDatosBCRA();
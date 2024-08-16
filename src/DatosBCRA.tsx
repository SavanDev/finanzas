import React, { useState, useEffect } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";

// Tipos para las respuestas de la API
interface ApiResponse {
	idVariable: number;
	valor: number;
	fecha: string;
}

interface ApiSpecialResponse {
	lefi: number;
	depositosBCRA: number;
}

interface VariableData {
	orden: number;
	nombre: string;
	valor: number | null;
	fecha: number | null;
	esPorcentaje: boolean | null;
	esDolar?: boolean | false;
	esMensual?: boolean | false;
}

interface VariableExtraData {
	lefi: number;
	depositosBCRA: number;
}

// URL de la API del BCRA
const apiUrl = "https://api.bcra.gob.ar/estadisticas/v2.0/principalesvariables";
const apiSpecialUrl =
	"https://66ac1eeff009b9d5c73124ca.mockapi.io/api/finanzas";

const month = [
	"Enero",
	"Febrero",
	"Marzo",
	"Abril",
	"Mayo",
	"Junio",
	"Julio",
	"Agosto",
	"Septiembre",
	"Octubre",
	"Noviembre",
	"Diciembre",
];

let baseMonetariaAmpliada: number;
let reservasBCRA: number = 0;

function DatosBCRA() {
	const [datos, setDatos] = useState<VariableData[]>();
	const [inflacion, setInflacion] = useState<VariableData[]>();
	const [cotizaziones, setCotizaciones] = useState<VariableData[]>();
	const [extra, setExtra] = useState<VariableExtraData>();

	// Estado para almacenar la hora de la última actualización
	const [lastUpdated, setLastUpdated] = useState<string>("");

	const dateDifferenceInSeconds = (dateInitial: number, dateFinal: number) =>
		(dateFinal - dateInitial) / 86_400_000;

	const numberWithCommas = (x: number): string => {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	};

	useEffect(() => {
		baseMonetariaAmpliada = 0;
		async function obtenerDatosBCRA() {
			try {
				const response = await fetch(apiUrl, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data: { results: ApiResponse[] } = await response.json();

				const datosAMostrar: VariableData[] = [];
				const inflacionAMostrar: VariableData[] = [];
				const cotizacionesAMostrar: VariableData[] = [];

				// Transformar los datos en el formato adecuado
				data.results.forEach((element: ApiResponse) => {
					const parsedDate = Date.parse(element.fecha);
					switch (element.idVariable) {
						case 1:
							datosAMostrar.push({
								nombre: "Reservas Internacionales del BCRA",
								valor: element.valor,
								fecha: parsedDate,
								esPorcentaje: false,
								esDolar: true,
								orden: 0,
							});
							reservasBCRA = element.valor;
							break;
						case 15:
							datosAMostrar.push({
								nombre: "Base Monetaria",
								valor: element.valor,
								fecha: parsedDate,
								esPorcentaje: false,
								orden: 1,
							});
							baseMonetariaAmpliada += element.valor;
							break;
						case 6:
							datosAMostrar.push({
								nombre: "Tasa de Política Monetaria",
								valor: element.valor,
								fecha: parsedDate,
								esPorcentaje: true,
								orden: 2,
							});
							break;
						case 27:
							inflacionAMostrar.push({
								nombre: "Inflación Mensual",
								valor: element.valor,
								fecha: parsedDate,
								esPorcentaje: true,
								esMensual: true,
								orden: 0,
							});
							break;
						case 28:
							inflacionAMostrar.push({
								nombre: "Inflación Interanual",
								valor: element.valor,
								fecha: parsedDate,
								esPorcentaje: true,
								esMensual: true,
								orden: 1,
							});
							break;
						case 4:
							cotizacionesAMostrar.push({
								nombre: "Dólar Minorista",
								valor: element.valor,
								fecha: parsedDate,
								esPorcentaje: false,
								orden: 0,
							});
							break;
						case 5:
							cotizacionesAMostrar.push({
								nombre: "Dólar Mayorista",
								valor: element.valor,
								fecha: parsedDate,
								esPorcentaje: false,
								orden: 1,
							});
							break;
					}
				});

				const response2 = await fetch(apiSpecialUrl, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});
				if (!response2.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data2: ApiSpecialResponse[] = await response2.json();

				data2.forEach((element: ApiSpecialResponse) => {
					setExtra({
						lefi: element.lefi,
						depositosBCRA: element.depositosBCRA,
					});
					baseMonetariaAmpliada += element.lefi + element.depositosBCRA;
				});

				// Actualizar el estado con los datos formateados
				setDatos(datosAMostrar.sort((a, b) => a.orden - b.orden));
				setInflacion(inflacionAMostrar.sort((a, b) => a.orden - b.orden));
				setCotizaciones(cotizacionesAMostrar.sort((a, b) => a.orden - b.orden));

				// Almacenar la hora de la última actualización
				const now = new Date();
				setLastUpdated(now.toLocaleString());
			} catch (error) {
				console.error("Hubo un problema con la operación fetch:", error);
			}
		}

		// Llamar a la función inicialmente
		obtenerDatosBCRA();

		// Configurar intervalo para actualizar los datos cada 5 minutos (300000 ms)
		const intervalId = setInterval(obtenerDatosBCRA, 300000);

		// Limpiar el intervalo cuando el componente se desmonte
		return () => clearInterval(intervalId);
	}, []);

	return (
		<Container fluid>
			<h1 className="display-5 m-3">Datos BCRA</h1>
			<Row className="justify-content-center gap-3">
				{datos?.map((valor, index) => (
					<Col lg="2" key={index}>
						<Card>
							<Card.Header className="text-truncate">
								{valor.nombre !== null ? valor.nombre : "..."}
							</Card.Header>
							{valor.esPorcentaje !== null ? (
								valor.esPorcentaje ? (
									<Card.Body className="text-center">
										<Card.Text as="h3">
											{valor.valor !== null ? `${valor.valor}%` : "...%"}
										</Card.Text>
									</Card.Body>
								) : (
									<Card.Body>
										<Card.Title>
											{valor.valor !== null
												? `$ ${numberWithCommas(Math.trunc(valor.valor))}`
												: "$ ..."}
										</Card.Title>
										<Card.Subtitle>
											en millones de {valor.esDolar ? "dólares" : "pesos"}
										</Card.Subtitle>
									</Card.Body>
								)
							) : (
								<Card.Body>
									<Card.Text>Cargando...</Card.Text>
								</Card.Body>
							)}
							<Card.Footer className="text-body-secondary">
								{valor.fecha !== null
									? valor.esMensual
										? month[new Date(valor.fecha).getMonth()]
										: `Hace ${Math.trunc(
												dateDifferenceInSeconds(valor.fecha, Date.now())
										  )} días`
									: "..."}
							</Card.Footer>
						</Card>
					</Col>
				))}
				<Col lg="2">
					<Card className="border-info">
						<Card.Header className="text-truncate">LEFI (total)</Card.Header>
						<Card.Body>
							<Card.Title>
								{extra !== undefined
									? `$ ${numberWithCommas(Math.trunc(extra.lefi))}`
									: "$ ..."}
							</Card.Title>
							<Card.Subtitle>en millones de pesos</Card.Subtitle>
						</Card.Body>
						<Card.Footer className="text-body-secondary">
							by <a href="https://x.com/CotoDelCentral">@CotoDelCentral</a>
						</Card.Footer>
					</Card>
				</Col>
				<Col lg="2">
					<Card className="border-info">
						<Card.Header className="text-truncate">
							Depósitos del Gobierno
						</Card.Header>
						<Card.Body>
							<Card.Title>
								{extra !== undefined
									? `$ ${numberWithCommas(Math.trunc(extra.depositosBCRA))}`
									: "$ ..."}
							</Card.Title>
							<Card.Subtitle>en millones de pesos</Card.Subtitle>
						</Card.Body>
						<Card.Footer className="text-body-secondary">
							by <a href="https://x.com/CotoDelCentral">@CotoDelCentral</a>
						</Card.Footer>
					</Card>
				</Col>
				<Col lg="3">
					<Card>
						<Card.Header className="text-truncate">
							Base Monetaria Ampliada
						</Card.Header>
						<Card.Body>
							<Card.Title>
								{extra !== undefined
									? `$ ${numberWithCommas(Math.trunc(baseMonetariaAmpliada))}`
									: "$ ..."}
							</Card.Title>
							<Card.Subtitle>en millones de pesos</Card.Subtitle>
						</Card.Body>
					</Card>
				</Col>
			</Row>
			<h4 className="text-center m-3">Inflación</h4>
			<Row className="justify-content-center gap-3">
				{inflacion?.map((valor, index) => (
					<Col lg="2" key={index}>
						<Card className="border-primary">
							<Card.Header className="text-truncate">
								{valor.nombre !== null ? valor.nombre : "..."}
							</Card.Header>
							{valor.esPorcentaje !== null ? (
								valor.esPorcentaje ? (
									<Card.Body className="text-center">
										<Card.Text as="h3" className="text-info">
											{valor.valor !== null ? `${valor.valor}%` : "...%"}
										</Card.Text>
									</Card.Body>
								) : (
									<Card.Body>
										<Card.Title>
											{valor.valor !== null
												? `$ ${numberWithCommas(Math.trunc(valor.valor))}`
												: "$ ..."}
										</Card.Title>
										<Card.Subtitle>
											en millones de {valor.esDolar ? "dólares" : "pesos"}
										</Card.Subtitle>
									</Card.Body>
								)
							) : (
								<Card.Body>
									<Card.Text>Cargando...</Card.Text>
								</Card.Body>
							)}
							<Card.Footer className="text-body-secondary">
								{valor.fecha !== null
									? valor.esMensual
										? month[new Date(valor.fecha).getMonth()]
										: `Hace ${Math.trunc(
												dateDifferenceInSeconds(valor.fecha, Date.now())
										  )} días`
									: "..."}
							</Card.Footer>
						</Card>
					</Col>
				))}
			</Row>
			<h4 className="text-center m-3">Cotizaciones</h4>
			<Row className="justify-content-center gap-3">
				{cotizaziones?.map((valor, index) => (
					<Col lg="2" key={index}>
						<Card>
							<Card.Header className="text-truncate">
								{valor.nombre !== null ? valor.nombre : "..."}
							</Card.Header>
							{valor.esPorcentaje !== null ? (
								valor.esPorcentaje ? (
									<Card.Body className="text-center">
										<Card.Text as="h3" className="text-info">
											{valor.valor !== null ? `${valor.valor}%` : "...%"}
										</Card.Text>
									</Card.Body>
								) : (
									<Card.Body>
										<Card.Text as="h3">
											{valor.valor !== null
												? `$ ${numberWithCommas(Math.trunc(valor.valor))}`
												: "$ ..."}
										</Card.Text>
									</Card.Body>
								)
							) : (
								<Card.Body>
									<Card.Text>Cargando...</Card.Text>
								</Card.Body>
							)}
							<Card.Footer className="text-body-secondary">
								{valor.fecha !== null
									? valor.esMensual
										? month[new Date(valor.fecha).getMonth()]
										: `Hace ${Math.trunc(
												dateDifferenceInSeconds(valor.fecha, Date.now())
										  )} días`
									: "..."}
							</Card.Footer>
						</Card>
					</Col>
				))}
				<Col lg="2">
					<Card>
						<Card.Header className="text-truncate">Dólar Reservas</Card.Header>
						<Card.Body>
							<Card.Title>
								{extra !== undefined
									? `$ ${numberWithCommas(
											Math.trunc(baseMonetariaAmpliada / reservasBCRA)
									  )}`
									: "$ ..."}
							</Card.Title>
							<Card.Subtitle>BMA / Reservas</Card.Subtitle>
						</Card.Body>
					</Card>
				</Col>
			</Row>
			<p className="text-center mt-4">Última actualización: {lastUpdated}</p>
		</Container>
	);
}

export default DatosBCRA;

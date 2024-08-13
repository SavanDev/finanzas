import React, { useState, useEffect } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";

// Tipos para las respuestas de la API
interface ApiResponse {
	idVariable: number;
	valor: number;
	fecha: string;
}

interface VariableData {
	valor: number | null;
	fecha: number | null;
}

// URL de la API del BCRA
const apiUrl = "https://api.bcra.gob.ar/estadisticas/v2.0/principalesvariables";
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

function DatosBCRA() {
	const [reservas, setReservas] = useState<VariableData>({
		valor: null,
		fecha: null,
	});
	const [baseMonetaria, setBaseMonetaria] = useState<VariableData>({
		valor: null,
		fecha: null,
	});
	const [tasa, setTasa] = useState<VariableData>({ valor: null, fecha: null });
	const [inflacion, setInflacion] = useState<VariableData>({
		valor: null,
		fecha: null,
	});
	const [interanual, setInteranual] = useState<VariableData>({
		valor: null,
		fecha: null,
	});
	const [dolarMinorista, setDolarMinorista] = useState<VariableData>({
		valor: null,
		fecha: null,
	});
	const [dolarMayorista, setDolarMayorista] = useState<VariableData>({
		valor: null,
		fecha: null,
	});

	const dateDifferenceInSeconds = (dateInitial: number, dateFinal: number) =>
		(dateFinal - dateInitial) / 86_400_000;

	const numberWithCommas = (x: number): string => {
		return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
	};

	useEffect(() => {
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

				// Actualizar los estados con los datos recibidos
				data.results.forEach((element: ApiResponse) => {
					const parsedDate = Date.parse(element.fecha);
					switch (element.idVariable) {
						case 1:
							setReservas({ valor: element.valor, fecha: parsedDate });
							break;
						case 15:
							setBaseMonetaria({ valor: element.valor, fecha: parsedDate });
							break;
						case 6:
							setTasa({ valor: element.valor, fecha: parsedDate });
							break;
						case 27:
							setInflacion({ valor: element.valor, fecha: parsedDate });
							break;
						case 28:
							setInteranual({ valor: element.valor, fecha: parsedDate });
							break;
						case 4:
							setDolarMinorista({ valor: element.valor, fecha: parsedDate });
							break;
						case 5:
							setDolarMayorista({ valor: element.valor, fecha: parsedDate });
							break;
					}
				});
			} catch (error) {
				console.error("There was a problem with the fetch operation:", error);
			}
		}

		obtenerDatosBCRA();
	}, []);

	return (
		<Container fluid>
			<h1 className="display-5 m-3">Datos BCRA</h1>
			<Row className="justify-content-center gap-3">
				<Col lg="2">
					<Card>
						<Card.Header className="text-truncate">
							Reservas Internacionales del BCRA
						</Card.Header>
						<Card.Body>
							<Card.Title>
								{reservas.valor !== null
									? `$ ${numberWithCommas(Math.trunc(reservas.valor))}`
									: "$ ..."}
							</Card.Title>
							<Card.Subtitle>en millones de dólares</Card.Subtitle>
						</Card.Body>
						<Card.Footer className="text-body-secondary">
							{reservas.fecha !== null
								? `Hace ${Math.trunc(
										dateDifferenceInSeconds(reservas.fecha, Date.now())
								  )} días`
								: "Cargando..."}
						</Card.Footer>
					</Card>
				</Col>
				<Col lg="2">
					<Card>
						<Card.Header className="text-truncate">Base Monetaria</Card.Header>
						<Card.Body>
							<Card.Title>
								{baseMonetaria.valor !== null
									? `$ ${numberWithCommas(Math.trunc(baseMonetaria.valor))}`
									: "$ ..."}
							</Card.Title>
							<Card.Subtitle>en millones de pesos</Card.Subtitle>
						</Card.Body>
						<Card.Footer className="text-body-secondary">
							{baseMonetaria.fecha !== null
								? `Hace ${Math.trunc(
										dateDifferenceInSeconds(baseMonetaria.fecha, Date.now())
								  )} días`
								: "Cargando..."}
						</Card.Footer>
					</Card>
				</Col>
				<Col lg="2">
					<Card>
						<Card.Header className="text-truncate">
							Tasa de Política Monetaria
						</Card.Header>
						<Card.Body className="text-center">
							<Card.Text as="h3">
								{tasa.valor !== null ? `${tasa.valor}%` : "...%"}
							</Card.Text>
						</Card.Body>
						<Card.Footer className="text-body-secondary">
							{tasa.fecha !== null
								? `Hace ${Math.trunc(
										dateDifferenceInSeconds(tasa.fecha, Date.now())
								  )} días`
								: "Cargando..."}
						</Card.Footer>
					</Card>
				</Col>
				<Col lg="2">
					<Card border="primary">
						<Card.Header className="text-truncate">
							Inflación Mensual
						</Card.Header>
						<Card.Body className="text-center text-info">
							<Card.Text as="h3">
								{inflacion.valor !== null ? `${inflacion.valor}%` : "...%"}
							</Card.Text>
						</Card.Body>
						<Card.Footer className="text-body-secondary">
							{inflacion.fecha !== null
								? month[new Date(inflacion.fecha).getMonth()]
								: "Cargando..."}
						</Card.Footer>
					</Card>
				</Col>
				<Col lg="2">
					<Card border="primary">
						<Card.Header className="text-truncate">
							Inflación interanual
						</Card.Header>
						<Card.Body className="text-center text-info">
							<h3 className="card-text">
								{interanual.valor !== null ? `${interanual.valor}%` : "...%"}
							</h3>
						</Card.Body>
						<Card.Footer className="text-body-secondary">
							{interanual.fecha !== null
								? month[new Date(interanual.fecha).getMonth()]
								: "Cargando..."}
						</Card.Footer>
					</Card>
				</Col>
			</Row>
			<h4 className="text-center m-3">Cotizaciones</h4>
			<Row className="justify-content-center gap-3">
				<Col lg="2">
					<Card>
						<Card.Header className="text-truncate">
							Dólar (USD) minorista
						</Card.Header>
						<Card.Body>
							<Card.Text as="h3">
								{dolarMinorista.valor !== null
									? `$ ${numberWithCommas(Math.trunc(dolarMinorista.valor))}`
									: "Cargando..."}
							</Card.Text>
						</Card.Body>
						<Card.Footer className="text-body-secondary">
							{dolarMinorista.fecha !== null
								? `Hace ${Math.trunc(
										dateDifferenceInSeconds(dolarMinorista.fecha, Date.now())
								  )} días`
								: "Cargando..."}
						</Card.Footer>
					</Card>
				</Col>
				<Col lg="2">
					<Card>
						<Card.Header className="text-truncate">
							Dólar (USD) mayorista
						</Card.Header>
						<Card.Body>
							<Card.Text as="h3">
								{dolarMayorista.valor !== null
									? `$ ${numberWithCommas(Math.trunc(dolarMayorista.valor))}`
									: "$ ..."}
							</Card.Text>
						</Card.Body>
						<Card.Footer className="text-body-secondary">
							{dolarMayorista.fecha !== null
								? `Hace ${Math.trunc(
										dateDifferenceInSeconds(dolarMayorista.fecha, Date.now())
								  )} días`
								: "Cargando..."}
						</Card.Footer>
					</Card>
				</Col>
				<Col lg="2">
					<Card>
						<Card.Header className="text-truncate">
							Dólar (USD) reservas
						</Card.Header>
						<Card.Body>
							<Card.Title>
								{baseMonetaria.valor !== null && reservas.valor !== null
									? `$ ${numberWithCommas(
											Math.trunc(baseMonetaria.valor / reservas.valor)
									  )}`
									: "$ ..."}
							</Card.Title>
							<Card.Subtitle>BM / Reservas</Card.Subtitle>
						</Card.Body>
						<Card.Footer className="text-body-secondary">
							{month[new Date(Date.now()).getMonth()]}
						</Card.Footer>
					</Card>
				</Col>
			</Row>
		</Container>
	);
}

export default DatosBCRA;

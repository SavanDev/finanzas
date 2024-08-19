import React, { useState, useEffect } from "react";
import {
	Button,
	Card,
	Col,
	Container,
	Modal,
	Placeholder,
	Row,
	Stack,
} from "react-bootstrap";
import Graph from "./components/Graph";

// Tipos para las respuestas de la API
interface ApiResponse {
	idVariable: number;
	valor: number;
	fecha: string;
}

interface ApiSpecialResponse {
	lefiBCRA: number;
	depositosBCRA: number;
	lefiBancos: number;
	bopreal: number;
	boprealDato: string;
	lefiDepositosDato: string;
	reservasBCRA: number;
	reservasBCRADato: string;
}

interface VariableData {
	orden: number;
	nombre: string;
	valor: number;
	fecha: number;
	esPorcentaje: boolean;
	esDolar?: boolean;
	esMensual?: boolean;
	idVariable: number;
	nombreValor?: string;
}

interface VariableExtraData {
	lefiBCRA: number;
	depositosBCRA: number;
	lefiBancos: number;
	bopreal: number;
	boprealDato: string;
	lefiDepositosDato: string;
	reservasBCRA: number;
	reservasBCRADato: string;
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

let baseMonetariaAmpliada: number = 0;
let reservasBCRA: number = 0;
let valorDolar: number = 1;

let graphVariable: number = 27;
let graphNombre: string = "Inflación mensual";
let graphValor: string = "Valor";
let graphMensual: boolean = true;

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

	const contadorDias = (fecha: number) => {
		let dias: number = Math.trunc(dateDifferenceInSeconds(fecha, Date.now()));
		let textoDias: string;
		if (dias < 1) textoDias = "Hoy";
		else if (dias === 1) textoDias = "Hace 1 día";
		else textoDias = `Hace ${dias} días`;
		return textoDias;
	};

	const [show, setShow] = useState(false);

	const handleClose = () => setShow(false);
	const handleShow = () => setShow(true);

	const [showBOPREAL, setShowBOPREAL] = useState(false);

	const handleCloseBOPREAL = () => setShowBOPREAL(false);
	const handleShowBOPREAL = () => setShowBOPREAL(true);

	const [showGraph, setShowGraph] = useState(false);

	const handleCloseGraph = () => setShowGraph(false);
	const handleShowGraph = (
		idVariable: number,
		name: string,
		porMes: boolean,
		valor: string
	) => {
		graphVariable = idVariable;
		graphNombre = name;
		graphMensual = porMes;
		graphValor = valor;
		setShowGraph(true);
	};

	useEffect(() => {
		async function obtenerDatosBCRA() {
			baseMonetariaAmpliada = 0;
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
								idVariable: element.idVariable,
							});
							break;
						case 15:
							datosAMostrar.push({
								nombre: "Base Monetaria",
								valor: element.valor,
								fecha: parsedDate,
								esPorcentaje: false,
								orden: 1,
								idVariable: element.idVariable,
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
								idVariable: element.idVariable,
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
								idVariable: element.idVariable,
								nombreValor: "Mensual",
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
								idVariable: element.idVariable,
								nombreValor: "Interanual",
							});
							break;
						case 4:
							cotizacionesAMostrar.push({
								nombre: "Dólar Minorista",
								valor: element.valor,
								fecha: parsedDate,
								esPorcentaje: false,
								orden: 0,
								idVariable: element.idVariable,
							});
							break;
						case 5:
							cotizacionesAMostrar.push({
								nombre: "Dólar Mayorista",
								valor: element.valor,
								fecha: parsedDate,
								esPorcentaje: false,
								orden: 1,
								idVariable: element.idVariable,
							});
							valorDolar = element.valor;
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
						lefiBCRA: element.lefiBCRA,
						depositosBCRA: element.depositosBCRA,
						lefiBancos: element.lefiBancos,
						bopreal: element.bopreal,
						boprealDato: element.boprealDato,
						lefiDepositosDato: element.lefiDepositosDato,
						reservasBCRA: element.reservasBCRA,
						reservasBCRADato: element.reservasBCRADato,
					});
					baseMonetariaAmpliada += element.depositosBCRA;
					reservasBCRA = element.reservasBCRA;
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
				{datos !== undefined ? (
					datos?.map((valor, index) => (
						<Col lg="2" key={index}>
							<Card
								style={{ cursor: "pointer" }}
								onClick={() =>
									handleShowGraph(
										valor.idVariable !== undefined ? valor.idVariable : 27,
										valor.nombre,
										valor.esMensual !== undefined ? valor.esMensual : false,
										valor.nombreValor !== undefined
											? valor.nombreValor
											: "Valor"
									)
								}
							>
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
													? `$ ${numberWithCommas(
															Math.trunc(
																extra?.reservasBCRA !== undefined &&
																	valor.idVariable === 1
																	? extra.reservasBCRA
																	: valor.valor
															)
													  )}`
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
									<Stack direction="horizontal">
										<div>
											{valor.fecha !== null
												? valor.esMensual
													? month[new Date(valor.fecha).getMonth()]
													: contadorDias(
															extra?.reservasBCRADato !== undefined &&
																valor.idVariable === 1
																? Date.parse(extra.reservasBCRADato)
																: valor.fecha
													  )
												: "..."}
										</div>
										<div className="ms-auto">Fuente: BCRA</div>
									</Stack>
								</Card.Footer>
							</Card>
						</Col>
					))
				) : (
					<Col lg="2">
						<Card>
							<Placeholder as={Card.Header} animation="glow">
								<Placeholder xs={4} />
							</Placeholder>
							<Card.Body>
								<Placeholder as={Card.Title} animation="glow">
									<Placeholder xs={6} />
								</Placeholder>
							</Card.Body>
							<Placeholder as={Card.Footer} animation="glow">
								<Placeholder xs={7} />
							</Placeholder>
						</Card>
					</Col>
				)}
				<Col lg="2">
					<Card
						className="border-info"
						style={{ cursor: "help" }}
						onClick={handleShowBOPREAL}
					>
						<Card.Header className="text-truncate">BOPREAL *</Card.Header>
						<Card.Body>
							{extra !== undefined ? (
								<Card.Title>
									$ {numberWithCommas(Math.trunc(extra.bopreal / valorDolar))}
								</Card.Title>
							) : (
								<Placeholder as={Card.Title} animation="glow">
									<Placeholder xs={4} />
								</Placeholder>
							)}
							<Card.Title></Card.Title>
							<Card.Subtitle>en millones de dólares</Card.Subtitle>
						</Card.Body>
						{extra !== undefined ? (
							<Card.Footer className="text-body-secondary">
								<Stack direction="horizontal">
									<div>{extra.boprealDato}</div>
									<div className="ms-auto">
										<a href="https://x.com/CotoDelCentral">@CotoDelCentral</a>
									</div>
								</Stack>
							</Card.Footer>
						) : (
							<Placeholder as={Card.Footer} animation="glow">
								<Placeholder xs={4} />
							</Placeholder>
						)}
					</Card>
				</Col>
				<Col lg="2">
					<Card className="border-info">
						<Card.Header className="text-truncate">
							Depósitos del Gobierno
						</Card.Header>
						<Card.Body>
							{extra !== undefined ? (
								<Card.Title>
									$ {numberWithCommas(Math.trunc(extra.depositosBCRA))}
								</Card.Title>
							) : (
								<Placeholder as={Card.Title} animation="glow">
									<Placeholder xs={4} />
								</Placeholder>
							)}
							<Card.Title></Card.Title>
							<Card.Subtitle>en millones de pesos</Card.Subtitle>
						</Card.Body>
						<Card.Footer className="text-body-secondary">
							<Stack direction="horizontal">
								<div>
									{extra?.lefiDepositosDato !== undefined
										? contadorDias(Date.parse(extra.lefiDepositosDato))
										: "..."}
								</div>
								<div className="ms-auto">
									<a href="https://x.com/CotoDelCentral">@CotoDelCentral</a>
								</div>
							</Stack>
						</Card.Footer>
					</Card>
				</Col>
				<Col lg="2">
					<Card className="border-info">
						<Card.Header className="text-truncate">
							Base Monetaria Ampliada
						</Card.Header>
						<Card.Body>
							{extra !== undefined ? (
								<Card.Title>
									$ {numberWithCommas(Math.trunc(baseMonetariaAmpliada))}
								</Card.Title>
							) : (
								<Placeholder as={Card.Title} animation="glow">
									<Placeholder xs={4} />
								</Placeholder>
							)}
							<Card.Subtitle>en millones de pesos</Card.Subtitle>
						</Card.Body>
						<Card.Footer className="text-body-secondary">
							BM + Depósitos del Gobierno
						</Card.Footer>
					</Card>
				</Col>
			</Row>
			<Modal show={showBOPREAL} onHide={handleCloseBOPREAL}>
				<Modal.Header closeButton>
					<Modal.Title>¿Qué son los BOPREAL?</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Son títulos públicos emitidos por el Banco Central de la República
					Argentina (BCRA) diseñados para que sean adquiridos, en principio, por
					importadores de bienes y servicios con deudas en moneda extranjera por
					sus operaciones de comercio internacional. Los BOPREAL se emiten en
					dólares estadounidenses y son pagaderos en esta moneda.
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleCloseBOPREAL}>
						Cerrar
					</Button>
				</Modal.Footer>
			</Modal>
			<h4 className="text-center m-3">LEFI (Letra Fiscal de Liquidez) *</h4>
			<Row className="justify-content-center gap-3">
				<Col lg="2">
					<Card
						className="border-info"
						style={{ cursor: "help" }}
						onClick={handleShow}
					>
						<Card.Header className="text-truncate">LEFI (BCRA)</Card.Header>
						<Card.Body>
							{extra !== undefined ? (
								<Card.Title>
									$ {numberWithCommas(Math.trunc(extra.lefiBCRA))}
								</Card.Title>
							) : (
								<Placeholder as={Card.Title} animation="glow">
									<Placeholder xs={4} />
								</Placeholder>
							)}
							<Card.Subtitle>en valores técnicos</Card.Subtitle>
						</Card.Body>
						<Card.Footer className="text-body-secondary">
							<Stack direction="horizontal">
								<div>
									{extra?.lefiDepositosDato !== undefined
										? contadorDias(Date.parse(extra.lefiDepositosDato))
										: "..."}
								</div>
								<div className="ms-auto">
									<a href="https://x.com/CotoDelCentral">@CotoDelCentral</a>
								</div>
							</Stack>
						</Card.Footer>
					</Card>
				</Col>
				<Col lg="2">
					<Card
						className="border-info"
						style={{ cursor: "help" }}
						onClick={handleShow}
					>
						<Card.Header className="text-truncate">
							LEFI (Entidades financieras)
						</Card.Header>
						<Card.Body>
							{extra !== undefined ? (
								<Card.Title>
									$ {numberWithCommas(Math.trunc(extra.lefiBancos))}
								</Card.Title>
							) : (
								<Placeholder as={Card.Title} animation="glow">
									<Placeholder xs={4} />
								</Placeholder>
							)}
							<Card.Subtitle>en valores técnicos</Card.Subtitle>
						</Card.Body>
						<Card.Footer className="text-body-secondary">
							<Stack direction="horizontal">
								<div>
									{extra?.lefiDepositosDato !== undefined
										? contadorDias(Date.parse(extra.lefiDepositosDato))
										: "..."}
								</div>
								<div className="ms-auto">
									<a href="https://x.com/CotoDelCentral">@CotoDelCentral</a>
								</div>
							</Stack>
						</Card.Footer>
					</Card>
				</Col>
			</Row>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>¿Qué son las LEFI?</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					Las LEFI son instrumentos de deuda emitidos por el Tesoro Nacional con
					un plazo máximo de un año. Estas letras se adquieren a una tasa de
					interés determinada por la política monetaria del Banco Central de la
					República Argentina (BCRA). Aunque el BCRA establece la tasa, es el
					Tesoro Nacional quien asume el pago de los intereses.
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Cerrar
					</Button>
				</Modal.Footer>
			</Modal>
			<h4 className="text-center m-3">Inflación</h4>
			<Row className="justify-content-center gap-3">
				{inflacion !== undefined ? (
					inflacion?.map((valor, index) => (
						<Col lg="2" key={index}>
							<Card
								className="border-primary"
								style={{ cursor: "pointer" }}
								onClick={() =>
									handleShowGraph(
										valor.idVariable !== undefined ? valor.idVariable : 27,
										valor.nombre,
										valor.esMensual !== undefined ? valor.esMensual : true,
										valor.nombreValor !== undefined
											? valor.nombreValor
											: "Valor"
									)
								}
							>
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
											: contadorDias(valor.fecha)
										: "..."}
								</Card.Footer>
							</Card>
						</Col>
					))
				) : (
					<Col lg="2">
						<Card>
							<Placeholder as={Card.Header} animation="glow">
								<Placeholder xs={4} />
							</Placeholder>
							<Card.Body>
								<Placeholder as={Card.Title} animation="glow">
									<Placeholder xs={6} />
								</Placeholder>
							</Card.Body>
							<Placeholder as={Card.Footer} animation="glow">
								<Placeholder xs={7} />
							</Placeholder>
						</Card>
					</Col>
				)}
			</Row>
			<h4 className="text-center m-3">Cotizaciones</h4>
			<Row className="justify-content-center gap-3">
				{cotizaziones?.map((valor, index) => (
					<Col lg="2" key={index}>
						<Card
							style={{ cursor: "pointer" }}
							onClick={() =>
								handleShowGraph(
									valor.idVariable !== undefined ? valor.idVariable : 27,
									valor.nombre,
									valor.esMensual !== undefined ? valor.esMensual : false,
									valor.nombreValor !== undefined ? valor.nombreValor : "Valor"
								)
							}
						>
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
								<Stack direction="horizontal">
									<div>
										{valor.fecha !== null
											? valor.esMensual
												? month[new Date(valor.fecha).getMonth()]
												: contadorDias(valor.fecha)
											: "..."}
									</div>
									<div className="ms-auto">Fuente: BCRA</div>
								</Stack>
							</Card.Footer>
						</Card>
					</Col>
				))}
				<Col lg="2">
					<Card>
						<Card.Header className="text-truncate">Dólar Reservas</Card.Header>
						<Card.Body>
							{extra !== undefined ? (
								<Card.Title>
									${" "}
									{numberWithCommas(
										Math.trunc(baseMonetariaAmpliada / reservasBCRA)
									)}
								</Card.Title>
							) : (
								<Placeholder as={Card.Title} animation="glow">
									<Placeholder xs={4} />
								</Placeholder>
							)}
							<Card.Subtitle>BMA / Reservas</Card.Subtitle>
						</Card.Body>
					</Card>
				</Col>
			</Row>
			<Modal show={showGraph} onHide={handleCloseGraph} size="lg" centered>
				<Modal.Header closeButton>
					<Modal.Title>{graphNombre}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Graph
						idVariable={graphVariable}
						date={new Date()}
						nombreGraph={graphNombre}
						nombreValor={graphValor}
						porMes={graphMensual}
					/>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleCloseGraph}>
						Cerrar
					</Button>
				</Modal.Footer>
			</Modal>
			<p className="text-center mt-4">Última actualización: {lastUpdated}</p>
		</Container>
	);
}

export default DatosBCRA;

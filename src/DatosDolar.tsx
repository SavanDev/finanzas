import React, { useState, useEffect } from "react";
import { Card, Col, Container, Placeholder, Row, Stack } from "react-bootstrap";
import { Cash } from "react-bootstrap-icons";
import ReactTimeAgo from "react-time-ago";

// Estado para almacenar los datos de la API
interface DolarData {
	type: string;
	price?: number | null;
	ask?: number | null;
	bid?: number | null;
	variation: number | null;
	timestamp: number | null;
}

const apiUrlDolar = "https://criptoya.com/api/dolar";
let dolarOficial: number;
let dolarOficialTimestamp: number;

function DatosDolar() {
	// Estado para almacenar los datos de la API
	const [currencies, setCurrencies] = useState<DolarData[]>();

	// Estado para almacenar la hora de la última actualización
	const [lastUpdated, setLastUpdated] = useState<string>("");

	useEffect(() => {
		async function obtenerDatosDolar() {
			try {
				// Llamada a la API de CriptoYa
				const responseDolar = await fetch(apiUrlDolar, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});

				if (!responseDolar.ok) {
					throw new Error(`HTTP error! status: ${responseDolar.status}`);
				}

				const data = await responseDolar.json();

				dolarOficial = data.oficial.price;
				dolarOficialTimestamp = data.oficial.timestamp;

				// Transformar los datos en el formato adecuado
				const formattedData: DolarData[] = [
					{
						type: "Mayorista",
						price: data.mayorista.price,
						variation: data.mayorista.variation,
						timestamp: data.mayorista.timestamp,
					},
					{
						type: "Oficial",
						price: data.oficial.price,
						variation: data.oficial.variation,
						timestamp: data.oficial.timestamp,
					},
					{
						type: "Blue",
						ask: data.blue.ask,
						bid: data.blue.bid,
						variation: data.blue.variation,
						timestamp: data.blue.timestamp,
					},
					{
						type: "MEP",
						price: data.mep.al30.ci.price,
						variation: data.mep.al30.ci.variation,
						timestamp: data.mep.al30.ci.timestamp,
					},
					{
						type: "CCL",
						price: data.ccl.al30.ci.price,
						variation: data.ccl.al30.ci.variation,
						timestamp: data.ccl.al30.ci.timestamp,
					},
					{
						type: "Cripto USDT",
						ask: data.cripto.usdt.ask,
						bid: data.cripto.usdt.bid,
						variation: data.cripto.usdt.variation,
						timestamp: data.cripto.usdt.timestamp,
					},
				];

				// Actualizar el estado con los datos formateados
				setCurrencies(formattedData);

				// Almacenar la hora de la última actualización
				const now = new Date();
				setLastUpdated(now.toLocaleString());
			} catch (error) {
				console.error("Hubo un problema con la operación fetch:", error);
			}
		}

		obtenerDatosDolar();

		// Actualizar los datos cada 5 minutos (300,000 milisegundos)
		const intervalId = setInterval(obtenerDatosDolar, 300000);

		return () => clearInterval(intervalId);
	}, []);

	return (
		<Container fluid>
			<h1 className="display-5 m-3">Valores del dólar</h1>
			<Row className="justify-content-center gap-3">
				{currencies !== undefined ? (
					currencies?.map((currency, index) => (
						<Col lg={3} xl={2} key={index}>
							<Card>
								<Card.Header className="text-truncate icon-link">
									<Cash />
									<b>{currency.type}</b>
								</Card.Header>
								<Card.Body>
									<Card.Title>
										{currency.ask !== undefined
											? `$ ${currency.ask} / $ ${currency.bid}`
											: currency.price !== undefined
											? `$ ${currency.price}`
											: "$ ..."}
									</Card.Title>
									{currency.variation !== null ? (
										<Card.Subtitle
											className={
												currency.variation < 0
													? "text-danger"
													: currency.variation === 0
													? "text-secondary"
													: "text-success"
											}
										>
											{currency.variation < 0
												? "▼"
												: currency.variation === 0
												? "~"
												: "▲"}{" "}
											{currency.variation}
										</Card.Subtitle>
									) : (
										<Card.Subtitle>...</Card.Subtitle>
									)}
								</Card.Body>
								<Card.Footer className="text-body-secondary">
									<Stack direction="horizontal">
										<div>
											{currency.timestamp !== null ? (
												<ReactTimeAgo
													date={new Date(currency.timestamp * 1000)}
													locale="es-AR"
												/>
											) : (
												"..."
											)}
										</div>
										<div className="ms-auto">
											<a
												className="link-info link-underline-opacity-0 link-offset-2 link-underline-opacity-100-hover"
												href="https://criptoya.com/"
												target="_blank"
											>
												CriptoYa
											</a>
										</div>
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
				<Col lg={3} xl={2}>
					<Card>
						<Card.Header className="text-truncate icon-link text-info">
							<Cash />
							<b>Tarjeta / Ahorro</b>
						</Card.Header>
						<Card.Body>
							<Card.Title>
								$ {dolarOficial + (60 / 100) * dolarOficial}
							</Card.Title>
							<Card.Subtitle>
								<Stack direction="horizontal">
									<span>30% PAIS</span>
									<span className="ms-auto">30% Ganancias</span>
								</Stack>
							</Card.Subtitle>
						</Card.Body>
						<Card.Footer className="text-body-secondary">
							{dolarOficialTimestamp !== undefined ? (
								<ReactTimeAgo
									date={new Date(dolarOficialTimestamp * 1000)}
									locale="es-AR"
								/>
							) : (
								"..."
							)}
						</Card.Footer>
					</Card>
				</Col>
				<Col lg={3} xl={2}>
					<Card>
						<Card.Header className="text-truncate icon-link">
							<Cash />
							<b>Importador</b>
						</Card.Header>
						<Card.Body>
							<Card.Title>
								$ {Math.trunc(dolarOficial + (17.5 / 100) * dolarOficial)}
							</Card.Title>
							<Card.Subtitle>
								<span>17,5% PAIS</span>
							</Card.Subtitle>
						</Card.Body>
						<Card.Footer className="text-body-secondary">
							{dolarOficialTimestamp !== undefined ? (
								<ReactTimeAgo
									date={new Date(dolarOficialTimestamp * 1000)}
									locale="es-AR"
								/>
							) : (
								"..."
							)}
						</Card.Footer>
					</Card>
				</Col>
			</Row>
			<h4 className="text-center m-3">Próximos cambios</h4>
			<Row className="justify-content-center gap-3">
				<Col lg={3} xl={2}>
					<Card>
						<Card.Header className="text-truncate icon-link">
							<Cash />
							<b>Importador</b>
						</Card.Header>
						<Card.Body>
							<Card.Title>
								$ {Math.trunc(dolarOficial + (7.5 / 100) * dolarOficial)}
							</Card.Title>
							<Card.Subtitle>
								<span className="text-danger">▼ 7,5% PAIS</span>
							</Card.Subtitle>
						</Card.Body>
						<Card.Footer className="text-body-secondary">
							Septiembre
						</Card.Footer>
					</Card>
				</Col>
			</Row>
			<p className="text-center mt-4">Última actualización: {lastUpdated}</p>
		</Container>
	);
}

export default DatosDolar;

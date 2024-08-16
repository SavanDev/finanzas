import React, { useState, useEffect } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
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
						type: "Ahorro",
						ask: data.ahorro.ask,
						bid: data.ahorro.bid,
						variation: data.ahorro.variation,
						timestamp: data.ahorro.timestamp,
					},
					{
						type: "Tarjeta",
						price: data.tarjeta.price,
						variation: data.tarjeta.variation,
						timestamp: data.tarjeta.timestamp,
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
			<h1 className="display-5 m-3">Datos del Dólar - CriptoYa</h1>
			<Row className="justify-content-center gap-3">
				{currencies?.map((currency, index) => (
					<Col lg="2" key={index}>
						<Card>
							<Card.Header className="text-truncate">
								{currency.type}
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
											currency.variation < 0 ? "text-danger" : "text-success"
										}
									>
										{currency.variation < 0 ? "▼" : "▲"} {currency.variation}
									</Card.Subtitle>
								) : (
									<Card.Subtitle>...</Card.Subtitle>
								)}
							</Card.Body>
							<Card.Footer>
								{currency.timestamp !== null ? (
									<ReactTimeAgo
										date={new Date(currency.timestamp * 1000)}
										locale="es-AR"
									/>
								) : (
									"..."
								)}
							</Card.Footer>
						</Card>
					</Col>
				))}
			</Row>
			<p className="text-center mt-4">Última actualización: {lastUpdated}</p>
		</Container>
	);
}

export default DatosDolar;

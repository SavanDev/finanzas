import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	Filler,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	Filler
);

interface ApiResponse {
	idVariable: number;
	valor: number;
	fecha: string;
}

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

interface GraphProps {
	idVariable: number;
	date: Date;
	porMes: boolean;
	nombreValor: string;
	nombreGraph: string;
}

const Graph: React.FC<GraphProps> = ({
	idVariable,
	date,
	porMes,
	nombreValor,
	nombreGraph,
}) => {
	const [labels, setLabels] = useState<string[]>([]);
	const [values, setValues] = useState<number[]>([]);

	const formatDate = (date: Date): string => {
		const yyyy = date.getFullYear();
		let mm = date.getMonth() + 1;
		let dd = date.getDate();

		return (
			yyyy + "-" + (mm < 10 ? `0${mm}` : mm) + "-" + (dd < 10 ? `0${dd}` : dd)
		);
	};

	useEffect(() => {
		const fetchData = async () => {
			const url = `https://api.bcra.gob.ar/estadisticas/v2.0/datosvariable/${idVariable}/${formatDate(
				new Date(new Date().setFullYear(date.getFullYear() - 1))
			)}/${formatDate(date)}`;

			try {
				const response = await fetch(url, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
					},
				});
				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status}`);
				}
				const data: { results: ApiResponse[] } = await response.json();

				// Procesar los datos para obtener las etiquetas y valores
				const labels = data.results.map((item) =>
					porMes
						? month[new Date(Date.parse(item.fecha)).getMonth()]
						: item.fecha
				);
				const values = data.results.map((item) => item.valor);

				setLabels(labels);
				setValues(values);
			} catch (error) {
				console.error("Error fetching data from BCRA API:", error);
			}
		};

		fetchData();
	}, [idVariable, date, porMes, nombreGraph, nombreValor]);

	const data = {
		labels: labels,
		datasets: [
			{
				label: nombreValor,
				data: values,
				borderColor: "rgba(75, 192, 192, 1)",
				backgroundColor: "rgba(75, 192, 192, 0.2)",
				fill: true,
				tension: 0.1,
			},
		],
	};

	const options = {
		responsive: true,
		plugins: {
			legend: {
				display: true,
				position: "top" as const,
			},
			title: {
				display: true,
				text: `${nombreGraph} (${formatDate(
					new Date(new Date().setFullYear(date.getFullYear() - 1))
				)} a ${formatDate(date)})`,
			},
		},
		scales: {
			x: {
				title: {
					display: true,
				},
			},
			y: {
				beginAtZero: true,
			},
		},
	};

	return <Line data={data} options={options} />;
};

export default Graph;

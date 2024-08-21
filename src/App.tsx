import React, { useState } from "react";

import NavbarWebsite from "./components/Navbar";
import DatosBCRA from "./DatosBCRA";
import Footer from "./components/Footer";
import { Alert } from "react-bootstrap";
import { ExclamationTriangleFill } from "react-bootstrap-icons";
import { Route, Routes } from "react-router-dom";
import DatosDolar from "./DatosDolar";

const App: React.FC = () => {
	const [isAlertShow, setAlertShow] = useState(true);
	const renderAlert = () => {
		if (isAlertShow) {
			return (
				<Alert
					variant="warning"
					className="mx-4"
					onClose={() => setAlertShow(false)}
					dismissible
				>
					<Alert.Heading className="icon-link">
						<ExclamationTriangleFill className="me-1" /> Advertencia
					</Alert.Heading>
					<p>
						La página está en etapa de desarrollo por lo que muchos elementos
						aún no están implementados y el producto puede variar en su versión
						final.
					</p>
				</Alert>
			);
		}
	};

	return (
		<>
			<NavbarWebsite />
			{renderAlert()}
			<Routes>
				<Route path="/" element={<DatosDolar />} />
				<Route path="bcra" element={<DatosBCRA />} />
			</Routes>
			<Footer />
		</>
	);
};

export default App;

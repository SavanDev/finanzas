import React from "react";
import Container from "react-bootstrap/Container";

import NavbarWebsite from "./components/Navbar";
import DatosBCRA from "./DatosBCRA";
import Footer from "./components/Footer";

const App: React.FC = () => {
	return (
		<>
			<NavbarWebsite />
			<DatosBCRA />
			<Footer />
		</>
	);
};

export default App;

import React from "react";
import { Button } from "react-bootstrap";
import {
	AwardFill,
	Bank,
	CupHotFill,
	CurrencyDollar,
	HouseFill,
} from "react-bootstrap-icons";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";

function NavbarWebsite() {
	return (
		<Navbar expand="lg" sticky="top" className="bg-body-tertiary mb-3">
			<Container fluid>
				<Navbar.Brand href="#" className="icon-link">
					<CurrencyDollar /> Finanzas
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="navbar-bar" />
				<Navbar.Collapse id="navbar-bar">
					<Nav className="me-auto">
						<Nav.Link className="icon-link" as={Link} to="/">
							<HouseFill /> Home
						</Nav.Link>
						<Nav.Link className="icon-link" as={Link} to="/bcra">
							<Bank /> BCRA
						</Nav.Link>
						<Nav.Link
							href="https://savandev.ar"
							target="_blank"
							className="icon-link"
						>
							<AwardFill /> SavanDev
						</Nav.Link>
					</Nav>
				</Navbar.Collapse>
				<Navbar.Text>
					<Button
						href="https://cafecito.app/savandev"
						target="_blank"
						className="icon-link"
					>
						<CupHotFill /> Invitame un Cafecito
					</Button>
				</Navbar.Text>
			</Container>
		</Navbar>
	);
}

export default NavbarWebsite;

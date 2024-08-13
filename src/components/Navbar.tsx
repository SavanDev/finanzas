import React from 'react';
import { AwardFill, HouseFill } from 'react-bootstrap-icons';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function NavbarWebsite()
{
    return (
    <Navbar expand='lg' sticky='top' className='bg-body-tertiary mb-3'>
        <Container fluid>
            <Navbar.Brand href='#'>Finanzas</Navbar.Brand>
            <Navbar.Toggle aria-controls='navbar-bar' />
            <Navbar.Collapse id='navbar-bar'>
                <Nav className="me-auto">
            <Nav.Link href="#home" className='icon-link'><HouseFill /> Home</Nav.Link>
            <Nav.Link href="https://savandev.ar" target='_blank' className='icon-link'><AwardFill /> SavanDev</Nav.Link>
          </Nav>
            </Navbar.Collapse>
        </Container>
    </Navbar>
    );
}

export default NavbarWebsite;
import React, { useState } from 'react';
import { Navbar, Nav, Container, Form, FormControl, Button, InputGroup } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

import './navigation-bar.scss';

export const NavigationBar = ({ user, onLoggedOut, movies }) => {
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState('');

	const handleSearch = (e) => {
		e.preventDefault();
		const foundMovie = movies.find((movie) => movie.Title.toLowerCase().includes(searchTerm.toLowerCase()));
		if (foundMovie) {
			navigate(`/movies/${foundMovie._id}`); // Redirect to the MovieView of the found movie
		} else {
			alert('Movie not found'); // Handle the case where the movie is not found
		}
	};

	return (
		<Navbar bg="light" expand="lg">
			<Container>
				<Navbar.Brand as={Link} to="/">
					ArtCine
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav">
					<Nav className="me-auto">
						{!user && (
							<>
								<Nav.Link as={Link} to="/login">
									Login
								</Nav.Link>
								<Nav.Link as={Link} to="/signup">
									Signup
								</Nav.Link>
							</>
						)}
						{user && (
							<>
								<Nav.Link as={Link} to="/">
									Home
								</Nav.Link>
								<Nav.Link as={Link} to="/users/:username">
									Profile
								</Nav.Link>
								<Nav.Link onClick={onLoggedOut}>Logout</Nav.Link>
							</>
						)}
						<Form onSubmit={handleSearch} className="navbar-custom-form">
							<InputGroup>
								<FormControl className="form-control" type="text" placeholder="Search Movies" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
								<Button variant="outline-success" type="submit">
									Search
								</Button>
							</InputGroup>
						</Form>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
};

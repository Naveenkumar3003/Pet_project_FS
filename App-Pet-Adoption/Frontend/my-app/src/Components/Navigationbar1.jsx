import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import Nav from "react-bootstrap/Nav";
import apiClient from "../services/apiClient";
import './NavigationBar1style.css';

const Navigationbar1 = () => {
  const [pets, setPets] = useState([]);

  useEffect(() => {
    apiClient
      .get("/api/petdata")
      .then((response) => {
        // Only show available pets
        const availablePets = (response.data || []).filter(
          pet => !pet.status || pet.status === 'available'
        );
        setPets(availablePets);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <Nav className="nav-justify">
      <Nav.Item className="nav-item">
        <Dropdown className="dropdown">
          <Dropdown.Toggle className="dropdown-toggle">
            Dogs and Puppies
          </Dropdown.Toggle>
          <Dropdown.Menu className="dropdown-content">
            {pets
              .filter((pet) => pet.species === "Dog")
              .map((data) => (
                <Dropdown.Item
                  key={data._id}
                  as={Link}
                  to={`/dogs/${data._id}`}
                  className="dropdown-item"
                >
                  {data.breed}
                </Dropdown.Item>
              ))}
          </Dropdown.Menu>
        </Dropdown>
      </Nav.Item>
      <Nav.Item className="nav-item">
        <Dropdown className="dropdown">
          <Dropdown.Toggle className="dropdown-toggle">
            Cats and Kittens
          </Dropdown.Toggle>
          <Dropdown.Menu className="dropdown-content">
            {pets
              .filter((pet) => pet.species === "Cat")
              .map((data) => (
                <Dropdown.Item
                  key={data._id}
                  as={Link}
                  to={`/cats/${data._id}`}
                  className="dropdown-item"
                >
                  {data.breed}
                </Dropdown.Item>
              ))}
          </Dropdown.Menu>
        </Dropdown>
      </Nav.Item>
    </Nav>
  );
};

export default Navigationbar1;

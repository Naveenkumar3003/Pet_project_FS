import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import './PetList.css';

const CATEGORY_CARDS = [
  {
    id: 'Dog',
    title: 'Dogs & Puppies',
    subtitle: 'Loyal companions and energetic friends',
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'Cat',
    title: 'Cats & Kittens',
    subtitle: 'Independent, affectionate and playful',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'Bird',
    title: 'Birds & Parrots',
    subtitle: 'Colorful, musical and highly intelligent',
    image: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'Rabbit',
    title: 'Rabbits & Bunnies',
    subtitle: 'Gentle, quiet and adorable companions',
    image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'Small Pet',
    title: 'Small Pets & Hamsters',
    subtitle: 'Curious, energetic and low-maintenance',
    image: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'Reptile',
    title: 'Reptiles & Aquatics',
    subtitle: 'Fascinating, calm and unique exotic pets',
    image: 'https://images.unsplash.com/photo-1563281577-a7be47e20db9?auto=format&fit=crop&w=600&q=80',
  }
];

const PetList = () => {
  const navigate = useNavigate();

  const handleCategorySelect = (categoryId) => {
    navigate(`/catalog?category=${categoryId}`);
  };

  return (
    <Container className="py-5">
      <div className="text-center mb-5">
        <h2 className="section-heading">Browse Pet Categories</h2>
        <p className="section-subheading text-muted">
          Choose a species category to view rescued pets waiting for loving homes.
        </p>
      </div>

      <Row className="g-4">
        {CATEGORY_CARDS.map((cat) => (
          <Col key={cat.id} xs={12} sm={6} md={4}>
            <Card 
              className="h-100 category-feature-card glass-card text-center"
              onClick={() => handleCategorySelect(cat.id)}
            >
              <div className="cat-img-box">
                <Card.Img
                  variant="top"
                  src={cat.image}
                  alt={cat.title}
                  className="cat-feature-img"
                />
              </div>
              <Card.Body className="d-flex flex-column justify-content-between p-4">
                <div>
                  <Card.Title className="cat-card-title">{cat.title}</Card.Title>
                  <Card.Text className="cat-card-sub text-muted">{cat.subtitle}</Card.Text>
                </div>
                <div className="mt-3">
                  <button className="btn-explore-cat">
                    Explore
                  </button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default PetList;

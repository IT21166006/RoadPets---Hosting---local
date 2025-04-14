// Store.jsx
import React, { useState } from 'react';
import { Card, Button, Modal, Form, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Store = () => {
  const [showModal, setShowModal] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    address: '',
    phone: '',
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantities, setQuantities] = useState({});

  const handleShowModal = (productId) => {
    setSelectedProduct(productId);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('User Data:', userData);
    console.log('Selected Quantity:', quantities[selectedProduct] || 1);
    setShowModal(false);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: newQuantity,
    }));
  };

  // Hardcoded product details
  const products = [
    {
      id: 1,
      image: 'https://petmart.lk/cdn/shop/products/josi-dog-active-dry-dog-food-josera-900g-955228_640x640.webp?v=1664475914',
      description: 'Adidas Running Shoes',
      quantity: 10,
    },
    {
      id: 2,
      image: 'https://petmart.lk/cdn/shop/products/josera-young-star-dry-dog-food-josera-372450_640x640.jpg?v=1658608450',
      description: 'Adidas Sports T-Shirt',
      quantity: 20,
    },
    {
      id: 3,
      image: 'https://petmart.lk/cdn/shop/products/29191_640x640.jpg?v=1681712122',
      description: 'Adidas Track Pants',
      quantity: 15,
    },
  ];

  return (
    <Container className="mt-5">
      <Row>
        {products.map((product) => {
          const quantity = quantities[product.id] || 1;
          return (
            <Col key={product.id} md={4} className="mb-4">
              <Card>
                <Card.Img variant="top" src={product.image} />
                <Card.Body>
                  <Card.Title>{product.description}</Card.Title>
                  <Card.Text>Quantity Available: {product.quantity}</Card.Text>
                  
                  {/* Quantity Selector */}
                  <div className="d-flex align-items-center mb-3">
                    <Button
                      variant="outline-secondary"
                      onClick={() => handleQuantityChange(product.id, Math.max(1, quantity - 1))}
                      style={{ width: '40px', height: '40px' }}
                    >
                      -
                    </Button>
                    <input
                      type="text"
                      className="form-control text-center mx-2"
                      value={quantity}
                      readOnly
                      style={{ width: '60px' }}
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => handleQuantityChange(product.id, Math.min(product.quantity, quantity + 1))}
                      style={{ width: '40px', height: '40px' }}
                      disabled={quantity >= product.quantity}
                    >
                      +
                    </Button>
                  </div>

                  <Button
                    variant="primary"
                    onClick={() => handleShowModal(product.id)}
                    style={{
                      backgroundColor: '#ff914d',
                      borderColor: '#ff914d',
                      color: 'black',
                    }}
                  >
                    Buy Now
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Modal for User Information */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Enter Your Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                name="name"
                value={userData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your address"
                name="address"
                value={userData.address}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formPhone">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="tel"
                placeholder="Enter your phone number"
                name="phone"
                value={userData.phone}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Button
              variant="success"
              type="submit"
              style={{
                backgroundColor: '#ff914d',
                borderColor: '#ff914d',
                color: 'black',
              }}
            >
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Store;

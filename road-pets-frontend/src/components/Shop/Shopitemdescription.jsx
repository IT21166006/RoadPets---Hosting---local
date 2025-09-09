import React, { useState } from "react";
import { Lightbox } from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Card, Container, Row, Col, Button, Form, Badge } from "react-bootstrap";

const data = [
  {
    id: 1,
    image: "https://petmart.lk/cdn/shop/products/josi-dog-active-dry-dog-food-josera-900g-955228_1024x1024.webp?v=1664475914",
    thumbnail: "https://petmart.lk/cdn/shop/products/josi-dog-active-dry-dog-food-josera-900g-955228_1024x1024.webp?v=1664475914",
  },
  {
    id: 2,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcvvKIY7OD1iplFwgSVOACAa8KJRxm-SKc6vSicBjd0kv-QZKIGBPWwKzW1-eOZxQln8c&usqp=CAU",
    thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcvvKIY7OD1iplFwgSVOACAa8KJRxm-SKc6vSicBjd0kv-QZKIGBPWwKzW1-eOZxQln8c&usqp=CAU",
  },
  {
    id: 3,
    image: "https://cdn.shopify.com/s/files/1/0045/6055/1971/products/josi-dog-mini-adult-900g-dry-dog-food-josera-138952_250x@2x.webp?v=1660987716",
    thumbnail: "https://cdn.shopify.com/s/files/1/0045/6055/1971/products/josi-dog-mini-adult-900g-dry-dog-food-josera-138952_250x@2x.webp?v=1660987716",
  },
  {
    id: 4,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGKqa_eoNYGi9WUE2PeuYwEq1DaWurqVDxvw&s",
    thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQGKqa_eoNYGi9WUE2PeuYwEq1DaWurqVDxvw&s",
  },
];

const ItemDescription = (props) => {
  // State for quantity count
  const [count, setCount] = useState(0);

  // State for gallery
  const [open, setOpen] = useState(false);
  const [mainImage, setMainImage] = useState(data[0].image);
  const [imageIndex, setImageIndex] = useState(0);

  // Quantity handlers
  const handleAdd = () => setCount((prev) => prev + 1);

  const handleSubtract = () => {
    setCount((prev) => (prev > 0 ? prev - 1 : 0));
  };

  const handleInputChange = (e) => {
    const val = Number(e.target.value);
    if (val >= 0) setCount(val);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    props.setCartCount(count);
    setCount(0);
  };

  // Gallery handlers
  const handleThumbnailClick = (index) => {
    setMainImage(data[index].image);
    setImageIndex(index);
  };

  return (
    <Container className="py-5">
      <Row className="g-4">
        {/* Gallery Section */}
        <Col md={6}>
          <Card className="border-0">
            <Card.Img 
              src={mainImage} 
              alt="product" 
              onClick={() => setOpen(true)} 
              className="rounded cursor-pointer"
              style={{ cursor: "pointer" }}
            />
            <div className="d-flex justify-content-between mt-3">
              {data.map((item, index) => (
                <img
                  key={item.id}
                  onClick={() => handleThumbnailClick(index)}
                  src={item.thumbnail}
                  alt={`thumbnail-${index + 1}`}
                  className={`img-thumbnail ${mainImage === item.image ? 'border-secondary opacity-100' : 'opacity-50'}`}
                  style={{ width: "80px", height: "80px", cursor: "pointer" }}
                />
              ))}
            </div>
          </Card>

          <Lightbox
            open={open}
            close={() => setOpen(false)}
            index={imageIndex}
            slides={data.map((item) => ({
              src: item.image,
              alt: "product image",
              width: 500,
              height: "auto",
            }))}
          />
        </Col>

        {/* Product Description Section */}
        <Col md={6}>
          <div className="ps-md-4">
            <p className="text-uppercase text-secondary fw-bold letter-spacing-2">
              Sneaker Company
            </p>
            <h1 className="fs-1 fw-bold mb-3">Fall Limited Edition Sneakers</h1>
            <p className="text-muted mb-4">
              These low-profile sneakers are your perfect casual wear companion. Featuring a durable rubber outer sole, they'll withstand everything the weather can offer.
            </p>

            <div className="d-flex align-items-center mb-3">
              <h2 className="fs-3 fw-bold me-3 mb-0">$125.00 <Badge bg="light" text="secondary" className="ms-2">50%</Badge></h2>
              <p className="text-decoration-line-through text-muted fw-bold mb-0">$250.00</p>
            </div>

            <Form onSubmit={handleAddToCart}>
              <div className="d-flex flex-column flex-md-row gap-3">
                <div className="d-flex align-items-center bg-light rounded">
                  <Button 
                    variant="light" 
                    onClick={handleSubtract} 
                    className="border-0"
                  >
                    <img src="./images/icon-minus.svg" alt="minus" />
                  </Button>
                  <Form.Control
                    type="number"
                    value={count}
                    onChange={handleInputChange}
                    min="0"
                    className="border-0 bg-transparent text-center fw-bold"
                    style={{ width: "60px" }}
                  />
                  <Button 
                    variant="light" 
                    onClick={handleAdd} 
                    className="border-0"
                  >
                    <img src="./images/icon-plus.svg" alt="plus" />
                  </Button>
                </div>
                <Button 
                  type="submit" 
                  variant="secondary" 
                  className="d-flex align-items-center justify-content-center gap-2 flex-grow-1"
                >
                  <img src="./images/icon-cart.svg" alt="add to cart" />
                  Add to cart
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default ItemDescription;

import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported
import '../CSS/carousel.css'

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
    slidesToSlide: 4 // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2 // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1 // optional, default to 1.
  }
};

const Projects = (props) => {
  return (
    <div className="container-fluid mt-4">
      <Carousel
        swipeable={true}
        draggable={true}
        // showDots={true}
        responsive={responsive}
        ssr={true} // means to render carousel on server-side.
        infinite={true}
        autoPlay={props.deviceType !== "mobile"}
        autoPlaySpeed={3000}
        keyBoardControl={true}
        customTransition="all .5"
        transitionDuration={500}
        containerClass="carousel-container"
        removeArrowOnDeviceType={["tablet", "mobile"]}
        deviceType={props.deviceType}
        dotListClass="custom-dot-list-style"
        itemClass="carousel-item-padding-40-px"

      >
        <div className="carousel-item-wrapper card p-3 text-center h-100 ">
          <img
            src="https://i.ibb.co/FkbsJnLv/77fe0096-e2c4-4b76-acca-a681c755acb2-66b356ad77c48.jpg"
            alt="Description 1"
             className="card-img-top img-fluid mb-3"
            style={{ maxHeight: '200px', objectFit: 'cover' }}
          />
          <h3 className="card-body d-flex flex-column justify-content-between">Street Pet Rescue & First Aid Camp</h3>
          <p className="card-text">Rain volunteers to safely rescue road pets and provide basic first aid.</p>
          <button className="btn btn-primary mt-auto">Learn More</button>
        </div>

        <div className="carousel-item-wrapper card p-3 text-center h-100">
          <img
            src="https://i.ibb.co/0RGc0zXs/csm-Taipan-Pacci-Pacca-2015-06-1.png"
            alt="Description 2"
            className="card-img-top img-fluid mb-3"
            style={{ maxHeight: '200px', objectFit: 'cover' }}
          />
          
            <h3 className="card-body d-flex flex-column justify-content-between">Feeding & Rescue Mission Campaign</h3>
            <p className="card-text">Organize teams to feed and identify sick/injured strays</p>
            <button className="btn btn-primary mt-auto">Learn More</button>
          
        </div>

        <div className="carousel-item-wrapper card p-3 text-center h-100">
          <img
            src="https://i.ibb.co/YFCrdPQB/dogs-for-vaccination.png"
            alt="Description 3"
             className="card-img-top img-fluid mb-3"
            style={{ maxHeight: '200px', objectFit: 'cover' }}
          />
          <h3 className="card-body d-flex flex-column justify-content-between">Vet Check-Up & Vaccination Camp</h3>
          <p className="card-text">Collaborate with veterinarians to provide free check-ups,and sterilization for street pets.</p>
          <button className="btn btn-primary mt-auto">Learn More</button>
        </div>
        <div className="carousel-item-wrapper card p-3 text-center h-100">
          <img
            src="https://i.ibb.co/SwDDyYVJ/Milchzeit-2016-02-16-2.png"
            alt="Description 4"
             className="card-img-top img-fluid mb-3"
            style={{ maxHeight: '200px', objectFit: 'cover' }}
          />
          <h3 className="card-body d-flex flex-column justify-content-between">"Rescue a Paw" School & College Campaign</h3>
          <p className="card-text">Host awareness sessions in schools and colleges to encourage youth involvement.</p>
          <button className="btn btn-primary mt-auto">Learn More</button>
        </div>
      </Carousel>

      {/* Additional carousels can be added here */}
    </div>
  );
};

export default Projects;



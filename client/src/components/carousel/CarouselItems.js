import React from "react";
import "./Carousel.scss";
import { Link } from "react-router-dom";
import { shortenText } from "../../utils";
const CarouselItems = ({ url, name, price, description }) => {
  return (
    <div className="carouselItem">
      <Link to="/product-detail">
        <img src={url} alt="product" className="product--image" />
        <p className="price">&#8377;{`${price}`}</p>
        <h4>{shortenText(name, 18)}</h4>
        <p className="--mb">{shortenText(description, 26)}</p>
      </Link>
      <button className="--btn --btn-primary --btn-block">Add To Cart</button>
    </div>
  );
};

export default CarouselItems;

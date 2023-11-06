import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Slider.scss";
import { sliderData } from "./slider-data";

function Slider() {
  const navigate = useNavigate();
  const [currentSlide, setcurrentSlide] = useState(0);
  const slideLength = sliderData.length;
  const autoScroll = true;

  const intervalTime = 5000;

  const nextSlide = () => {
    setcurrentSlide(currentSlide === slideLength - 1 ? 0 : currentSlide + 1);
  };
  const prevSlide = () => {
    setcurrentSlide(currentSlide === 0 ? slideLength - 1 : currentSlide - 1);
  };

  useEffect(() => {
    setcurrentSlide(0);
  }, []);

  useEffect(() => {
    let slideInterval;
    if (autoScroll) {
      slideInterval = setInterval(nextSlide, intervalTime);
    }
    return () => clearInterval(slideInterval);
  }, [currentSlide, intervalTime, autoScroll]);

  return (
    <div className="slider">
      <AiOutlineArrowLeft className="arrow prev" onClick={prevSlide} />
      <AiOutlineArrowRight className="arrow next" onClick={nextSlide} />
      {sliderData.map((slide, i) => {
        const { image, header, desc } = slide;

        return (
          <div
            key={i}
            className={i === currentSlide ? "slide current" : "slide"}
          >
            {i === currentSlide && (
              <>
                <img src={image} alt="slide" />
                <div className="content">
                  <span className="span1"></span>
                  <span className="span2"></span>
                  <span className="span3"></span>
                  <span className="span4"></span>
                  <h2>{header}</h2>
                  <p>{desc}</p>
                  <hr />
                  <button
                    className="--btn --btn-primary --lift-up"
                    onClick={() => navigate("/shop")}
                  >
                    Shop Now
                  </button>
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default Slider;

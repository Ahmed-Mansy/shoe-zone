// components/ImagesSlider.jsx

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import PropTypes from "prop-types";

const ImagesSlider = ({ images }) => {
  if (!images || images.length === 0) return null;

  return (
    <Swiper
      spaceBetween={10}
      slidesPerView={1}
      loop={true}
      pagination={{ clickable: true }}
      navigation={true}
      modules={[Pagination, Navigation]}

      className="w-full h-full rounded-md">
      {images.map((img, index) => (
        <SwiperSlide key={index}>
          <img
            src={
              img.image.startsWith("http")
                ? img.image
                : `http://127.0.0.1:8000${img.image}`
            }
            alt={`Product Image ${index}`}
            className="w-full h-full object-cover rounded-md"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

ImagesSlider.propTypes = {
  images: PropTypes.array.isRequired,
};

export default ImagesSlider;


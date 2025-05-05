<<<<<<< HEAD
=======
// components/ImagesSlider.jsx
>>>>>>> 0f0c9dfd53300e2c258a003561a4d343abac2ade
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
<<<<<<< HEAD
import PropTypes from "prop-types";
=======
>>>>>>> 0f0c9dfd53300e2c258a003561a4d343abac2ade

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
<<<<<<< HEAD
      className="w-full h-full rounded-md">
=======
      className="w-full h-full rounded-md"
    >
>>>>>>> 0f0c9dfd53300e2c258a003561a4d343abac2ade
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

<<<<<<< HEAD
ImagesSlider.propTypes = {
  images: PropTypes.array.isRequired,
};

=======
>>>>>>> 0f0c9dfd53300e2c258a003561a4d343abac2ade
export default ImagesSlider;

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { Autoplay, Pagination, Navigation } from "swiper/modules";

const images = [
  { src: "/images/carousel14.jpeg", alt: "Carousel 14" },
  { src: "/images/carousel25.webp", alt: "Carousel 25" },
  { src: "/images/carousel27.jpeg", alt: "Carousel 27" },
  { src: "/images/carousel26.webp", alt: "Carousel 26" },
  { src: "/images/carousel15.webp", alt: "Carousel 15" },
  { src: "/images/carousel28.jpeg", alt: "Carousel 28" },
  { src: "/images/carousel29.jpeg", alt: "Carousel 29" },
  { src: "/images/carousel16.webp", alt: "Carousel 16" },
  { src: "/images/carousel20.webp", alt: "Carousel 20" },
  { src: "/images/carousel31.jpeg", alt: "Carousel 31" },
];

function HeroCarousel() {
  return (
    <div className="carousel-wrapper">
    <Swiper
      loop={true}
      spaceBetween={30}
      centeredSlides={true}
      autoplay={{ delay: 5000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      modules={[Autoplay, Pagination, Navigation]}
    >
      {images.map((image, index) => (
        <SwiperSlide className="carousel-container" key={index}>
          <img className="carousel-img" src={image.src} alt={image.alt} />
        </SwiperSlide>
      ))}
    </Swiper>
    </div>
  );
}

export default HeroCarousel;

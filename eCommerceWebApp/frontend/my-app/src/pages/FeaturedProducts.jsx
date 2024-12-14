import { useEffect, useState, useRef } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import Glide from "@glidejs/glide";
import { CiHeart } from "react-icons/ci";
import { IoIosArrowRoundDown } from "react-icons/io";
import "@glidejs/glide/dist/css/glide.core.min.css";
import "@glidejs/glide/dist/css/glide.theme.min.css";

const FeaturedProducts = ({ products }) => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const glideRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (products?.length > 0) {
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      setFeaturedProducts(shuffled.slice(0, 15));
    } else {
      console.log("No products to dispslay");
    }
  }, [products]);

  useEffect(() => {
    if (glideRef.current && featuredProducts.length > 0) {
      const glide = new Glide(glideRef.current, {
        type: "carousel",
        startAt: 0,
        perView: 4,
        breakpoints: {
          1140: {
            perView: 3,
          },
          900: {
            perView: 2,
          },
          700: {
            perView: 1,
          },
        },
        gap: 30,
        peek: { before: 100, after: 100 },
        autoplay: 5000,
      });

      glide.mount();

      return () => glide.destroy();
    }
  }, [featuredProducts]);

  if (!products || products.length === 0) {
    return <p>Loading featured products...</p>;
  }

  return (
    <section className="prod-main-container">
      <div className="prod-header-nav-flex-container">
        <h4 className="prod-header">Featured Products</h4>
        <NavLink className="view-prod-link" to="/products">
          <span className="view-prod-link-holder">
           View More Products <IoIosArrowRoundDown size={25} />
          </span>
        </NavLink>
      </div>

      <div className="glide" ref={glideRef}>
        <div className="glide__track" data-glide-el="track">
          <ul className="glide__slides">
            {featuredProducts.map((product, index) => (
              <li className="glide__slide" key={index}>
                <div
                  className="product-card"
                  onClick={(e) => {
                    if (!e.target.closest(".heart-icon")) {
                      navigate(`/products/${product.id}`);
                    }
                  }}
                >
                  <div className="featProd-img-container">
                    <img
                      className="featured-carousel-img"
                      src={product.image?.src}
                      alt={product.title}
                    />
                    <CiHeart
                      className="heart-icon"
                      size={25}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    />
                  </div>
                  <div className="product-info">
                    <span>{product.title}</span>
                    <p>
                      ${product.variants?.[0]?.price || "No Available Price"}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;

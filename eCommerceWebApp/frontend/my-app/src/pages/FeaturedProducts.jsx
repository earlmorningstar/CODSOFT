import { useEffect, useState, useRef, useContext } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import WishlistContext from "../store/WishlistContext";
import Glide from "@glidejs/glide";
import { FiHeart } from "react-icons/fi";
import { IoIosArrowRoundDown } from "react-icons/io";
import "@glidejs/glide/dist/css/glide.core.min.css";
import "@glidejs/glide/dist/css/glide.theme.min.css";
import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

const FeaturedProducts = ({ products }) => {
  const { isInWishlist, addToWishlist, removeFromWishlist } =
    useContext(WishlistContext);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [skeletonCount, setSkeletonCount] = useState(4);
  const glideRef = useRef(null);
  const navigate = useNavigate();

  const toggleWishlist = async (product) => {
    try {
      if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id.toString());
      } else {
        await addToWishlist({
          id: product.id,
          title: product.title,
          variants: product.variants,
          images: product.images,
        });
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  const updateSkeletonCount = () => {
    const width = window.innerWidth;
    if (width > 1140) {
      setSkeletonCount(4);
    } else if (width > 900) {
      setSkeletonCount(3);
    } else if (width > 700) {
      setSkeletonCount(2);
    } else {
      setSkeletonCount(1);
    }
  };

  useEffect(() => {
    updateSkeletonCount();
    window.addEventListener("resize", updateSkeletonCount);

    return () => window.removeEventListener("resize", updateSkeletonCount);
  }, []);

  useEffect(() => {
    if (products?.length > 0) {
      setTimeout(() => {
        const shuffled = [...products].sort(() => 0.5 - Math.random());
        setFeaturedProducts(shuffled.slice(0, 15));
        setLoading(false);
      }, 1500);
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
  }, [featuredProducts, skeletonCount]);

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

      {loading ? (
        <div
          className="glide__slides"
          id="skeleton-container"
          sx={{ overflow: "hidden" }}
        >
          {Array.from(new Array(skeletonCount)).map((_, index) => (
            <Box key={index} sx={{ width: "100%" }}>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={150}
                animation="wave"
              />
              <Skeleton animation="wave" height={30} style={{ marginTop: 8 }} />
              <Skeleton animation="wave" height={20} width="80%" />
            </Box>
          ))}
        </div>
      ) : (
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
                      <FiHeart
                        className={`heart-icon ${
                          isInWishlist(product.id) ? "active" : ""
                        }`}
                        size={25}
                        color={
                          isInWishlist(product.id)
                            ? "rgb(251, 6, 6)"
                            : "#ffffff"
                        }
                        onClick={() => toggleWishlist(product)}
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
      )}
    </section>
  );
};

export default FeaturedProducts;

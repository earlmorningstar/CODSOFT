import { useEffect, useState } from "react";
import {
  useParams,
  // useNavigate,
  NavLink,
} from "react-router-dom";
import api from "../utils/api";
import { CiHeart } from "react-icons/ci";
import { MdKeyboardBackspace } from "react-icons/md";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  //   const navigate = useNavigate();

  const handleSizeClick = (size) => {
    setSelectedSize(size);
  };

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/shopify/products/${id}`);
        const fetchExactProduct = response?.data?.data?.product;
        setProduct(fetchExactProduct);
      } catch (error) {
        console.error("Error fetching Product Details:", error);
        setError("Failed to fetch products details");
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  //   const handleBackToHomePage = () => {
  //     navigate("/homepage");
  //   };

  return (
    <section className="product-details-container">
      <div className="product-details-img-container">
        <img
          src={product?.image?.src || "https://via.placeholder.com/150"}
          alt={product?.title}
          className="product-detail-image"
        />
        <div>
          <NavLink className="prod-detail-back-arrow" to="/homepage">
            <MdKeyboardBackspace color="#111111" size={25} />
          </NavLink>
          <CiHeart className="prod-detail-heart-icon" size={30} />
        </div>
      </div>

      <div className="product-details-info-container">
        <div className="product-title-price-container">
          <span>
            <h4>{product?.title || "Product Details"}</h4>
            <p className="product-detail-price" id="prod-price-1">
              ${product?.variants?.[0]?.price || "N/A"}
            </p>
          </span>
        </div>
        <h5>{product?.tags || "No tags available"}</h5>

        <div className="product-detail-desc-holder">
          <p>
            {product?.body_html?.replace(/<\/?[^>]+(>|$)/g, "") ||
              "No description available."}
          </p>
        </div>

        <p className="product-detail-price" id="prod-price-2">
          ${product?.variants?.[0]?.price || "N/A"}
        </p>

        <div className="product-detail-code-qty-holder">
          <p>Product Code: {product?.variants?.[0]?.sku || "N/A"}</p>
          <p>
            Quantity Available:{" "}
            {product?.variants?.[0]?.inventory_quantity || "N/A"}
          </p>
        </div>
        <div className="product-size-container">
          <p>Size</p>
          <span>
            {["s", "m", "l", "xl", "xxl"].map((size) => (
              <button
                key={size}
                onClick={() => handleSizeClick(size)}
                style={{
                  backgroundColor:
                    selectedSize === size ? "#6055d8" : "transparent",
                  color: selectedSize === size ? "#ffffff" : "#000000",
                }}
              >
                {size}
              </button>
            ))}
          </span>
        </div>
        <div className="product-detail-actions">
          <button>Add to Bag</button>
          <button>View Cart</button>
        </div>
      </div>
    </section>
  );
};

export default ProductDetailsPage;

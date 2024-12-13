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
  //   const navigate = useNavigate();

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
            <MdKeyboardBackspace size={25}/>
          </NavLink>
          <CiHeart className="prod-detail-heart-icon" size={30} />
        </div>
      </div>

      <div className='product-details-info-container'>
        <h2>{product?.title || "Product Details"}</h2>
      <p>
        {product?.body_html?.replace(/<\/?[^>]+(>|$)/g, "") ||
          "No description available."}
      </p>
      <p>Price: ${product?.variants?.[0]?.price || "N/A"}</p>
      <p>Product Code: {product?.variants?.[0]?.sku || "N/A"}</p>
      <p>Tags: {product?.tags || "No tags available"}</p>
      <p>
        Quantity Available:{" "}
        {product?.variants?.[0]?.inventory_quantity || "N/A"}
      </p>
      </div>

      
    </section>
  );
};

export default ProductDetailsPage;

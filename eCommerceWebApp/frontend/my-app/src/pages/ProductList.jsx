import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { CiHeart } from "react-icons/ci";
import { IoIosArrowRoundDown } from "react-icons/io";

const ProductList = ({ products }) => {
  const [randomProducts, setRandomProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (products?.length > 0) {
      const shuffled = [...products].sort(() => 0.5 - Math.random());
      setRandomProducts(shuffled.slice(0, 12));
    }
  }, [products]);

  return (
    <section className="prod-main-container">
      <div className="prod-header-nav-flex-container">
        <h4 className="prod-header">Explore Products</h4>
          <NavLink className="view-prod-link" to="/products">
        <span className="view-prod-link-holder">
          View More Products <IoIosArrowRoundDown size={25}/>
          </span>
          </NavLink>
      </div>
      <div className="product-grid">
        {randomProducts.map((product) => (
          <div className="productList-card" key={product.id}>
            <div className="prod-img-container">
              <img
                src={product.image?.src || "https://via.placeholder.com/150"}
                alt={product.title}
                className="product-image"
              />
              <CiHeart className="heart-icon" size={25} />
            </div>

            <div className="product-details">
              <span>{product.title}</span>
              <aside>
                <h5>
                  {product.body_html
                    ?.replace(/<\/?[^>]+(>|$)/g, "")
                    .slice(0, 100) || "No description available..."}
                  ...
                </h5>
              </aside>

              <p>${product.variants[0]?.price || "No Available Price"}</p>
              <div className="product-actions">
                <button onClick={() => navigate(`/products/${product.id}`)}>
                  Full Details
                </button>
                <button className="btn-add-to-bag">Add to Bag</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProductList;

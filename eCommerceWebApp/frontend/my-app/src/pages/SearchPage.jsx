import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import Search from "./Search";
import { CiHeart } from "react-icons/ci";

const SearchPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/shopify/products");
        const fetchedProducts = response?.data?.data?.products || [];
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Failed to fetch products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleSearch = (searchTerm) => {
    setIsSearching(!searchTerm);
    let filtered = [];

    if (searchTerm) {
      const lowercasedValue = searchTerm.toLowerCase().trim();
      filtered = products.filter((product) => {
        const titleMatch =
          product.title?.toLowerCase().trim().includes(lowercasedValue) ||
          false;
        const typeMatch =
          product.product_type
            ?.toLowerCase()
            .trim()
            .includes(lowercasedValue) || false;
        const tagsMatch =
          (typeof product.tags === "string"
            ? product.tags.toLowerCase().trim().includes(lowercasedValue)
            : Array.isArray(product.tags) &&
              product.tags.some((tag) =>
                tag?.toLowerCase().trim().includes(lowercasedValue)
              )) || false;
        return titleMatch || typeMatch || tagsMatch;
      });
    } else {
      filtered = [];
    }
    setFilteredProducts(filtered);
  };

  if (loading) return <p>Loading ../</p>;
  if (error) return <p>{error}</p>;

  return (
    <section>
      <h4
        className="prod-header"
        style={{ textAlign: "center", marginBottom: "20px" }}
      >
        Discover our collections
      </h4>
      <Search onSearch={handleSearch} />
      <div className="product-grid">
        {isSearching && filteredProducts.length === 0 && (
          <p style={{ textAlign: "center", marginTop: "20px" }}>
            No products found for your search.
          </p>
        )}

        {isSearching &&
          filteredProducts.map((product) => (
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
                </div>
              </div>
            </div>
          ))}
      </div>
      <div className="searchPage-collection-container">
        <span>Clothing</span>
        <span>Shoes</span>
        <span>Electronics</span>
        <span>Accessories</span>
        <span>Furniture</span>
      </div>
    </section>
  );
};

export default SearchPage;

import { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CartContext from "../store/CartContext";
import api from "../utils/api";
import { CiHeart } from "react-icons/ci";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Search from "./Search";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredproducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {
    items: cartItems,
    addItemToCart,
    removeItemFromCart,
  } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();
  const productsPerPage = 16;
  const query = new URLSearchParams(location.search);
  const currentPage = parseInt(query.get("page") || "1", 10);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await api.get("/api/shopify/products");
        const fetchedProducts = response?.data?.data?.products || [];
        setProducts(fetchedProducts);
        setFilteredproducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products.");
        setError("Failed to fetch products");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handleSearch = (searchTerm) => {
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
      filtered = products;
    }
    setFilteredproducts(filtered);
    navigate("?page=1");
  };

  const alreadyInCart = (id) => {
    return cartItems.some((item) => item.id === id);
  };

  const toggleCartButton = (product) => {
    if (alreadyInCart(product.id)) {
      removeItemFromCart(product.id);
    } else {
      addItemToCart({
        id: product.id,
        title: product.title,
        price: parseFloat(product.variants[0]?.price || 0),
        quantity: 1,
        image: product.image?.src || "https://via.placeholder.com/150",
      });
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <section>
      <Search onSearch={handleSearch} />

      <div className="product-grid">
        {currentProducts.map((product) => (
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
                <button
                  className="btn-add-to-bag"
                  style={{
                    backgroundColor: alreadyInCart(product.id)
                      ? "#ffffff"
                      : "#6055d8",
                    color: alreadyInCart(product.id) ? "#6055d8" : "#ffffff",
                  }}
                  onClick={() => toggleCartButton(product)}
                >
                  {alreadyInCart(product.id) ? "Remove from Bag" : "Add to Bag"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Stack spacing={2} sx={{ marginTop: 10, alignItems: "center" }}>
        <Pagination
          page={currentPage}
          count={totalPages}
          variant="outlined"
          shape="rounded"
          onChange={(_, page) => {
            navigate(`?page=${page}`);
          }}
        />
      </Stack>
    </section>
  );
};

export default ProductsPage;

// import { useEffect, useState } from "react";
// import axios from "axios";

// const ProductsPage = () => {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await axios.get("/api/shopify/products");
//         setProducts(response.data.products);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       }
//     };

//     fetchProducts();
//   }, []);

//   return (
//     <div>
//       <h1>Shopify Products</h1>
//       <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" }}>
//         {products.map((product) => (
//           <div key={product.id} style={{ border: "1px solid #ccc", padding: "10px" }}>
//             <h2>{product.title}</h2>
//             <img src={product.image.src} alt={product.title} width="200" />
//             <p>{product.body_html.replace(/<\/?[^>]+(>|$)/g, "")}</p> {/* Strip HTML tags */}
//             <p><strong>Price:</strong> ${product.variants[0]?.price || "N/A"}</p>
//             <p><strong>Inventory:</strong> {product.variants[0]?.inventory_quantity || "N/A"} in stock</p>
//             <p><strong>Tags:</strong> {product.tags}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default ProductsPage;

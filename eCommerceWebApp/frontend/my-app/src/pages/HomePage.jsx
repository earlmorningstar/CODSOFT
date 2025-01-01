import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import HeroCarousel from "./HeroCarousel";
import FeaturedProducts from "./FeaturedProducts";
import ProductList from "./ProductList";
import HomepageBanner from "./HomepageBanner";
import api from "../utils/api";

import { RiMenLine, RiWomenLine } from "react-icons/ri";
import { LuGlasses } from "react-icons/lu";
import { GiBed } from "react-icons/gi";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { Tooltip } from "@mui/material";

function HomePage() {
  const navigate = useNavigate();
  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const response = await api.get("/api/shopify/products");
      const shopifyProducts = response?.data?.data?.products || [];

      try {
        await api.post("/api/products/sync", {
          products: shopifyProducts,
        });
      } catch (error) {
        console.error("Failed to sync shopify products:", error);
      }
      return shopifyProducts;
    },
    staleTime: 10 * 60 * 1000,
  });

  return (
    <section className="homepage-main-container">
      <div className="homepage-banner" id="wlcm-banner-id">
        <HomepageBanner divContent="Welcome to TrendVault!" />
      </div>
      <div className="homepage-select-tab-container">
        <Tooltip title="Men" arrow placement="bottom">
          <span onClick={() => navigate("/category/men")}>
            <RiMenLine className="homepage-select-icon" size={20} />
          </span>
        </Tooltip>

        <Tooltip title="Women" arrow placement="bottom">
          <span onClick={() => navigate("/category/women")}>
            <RiWomenLine className="homepage-select-icon" size={20} />{" "}
          </span>
        </Tooltip>

        <Tooltip title="Accessories" arrow placement="bottom">
          <span onClick={() => navigate("/category/accessories")}>
            <LuGlasses className="homepage-select-icon" size={20} />
          </span>
        </Tooltip>

        <Tooltip title="Electronics" arrow placement="bottom">
          <span onClick={() => navigate("/category/electronics")}>
            <IoPhonePortraitOutline
              className="homepage-select-icon"
              size={20}
            />{" "}
          </span>
        </Tooltip>

        <Tooltip title="Furnitures" arrow placement="bottom">
          <span onClick={() => navigate("/category/furniture")}>
            <GiBed className="homepage-select-icon" size={20} />
          </span>
        </Tooltip>
      </div>
      <HeroCarousel />
      <FeaturedProducts products={products} />
      <ProductList products={products} />
    </section>
  );
}

export default HomePage;

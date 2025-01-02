import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import HeroCarousel from "./HeroCarousel";
import FeaturedProducts from "./FeaturedProducts";
import ProductList from "./ProductList";
import HomepageBanner from "./HomepageBanner";
import Footer from "./Footer";
import api from "../utils/api";
import { Tooltip } from "@mui/material";
import { RiMenLine, RiWomenLine } from "react-icons/ri";
import { LuGlasses } from "react-icons/lu";
import { GiBed } from "react-icons/gi";
import { IoPhonePortraitOutline } from "react-icons/io5";

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
      <div className="homepage-banner">
        <HomepageBanner spanContent="Discover the latest trends in fashion, accessories, electronics, and more at unbeatable prices." />
      </div>
      <ProductList products={products} />
      <div className="homepage-banner">
        <HomepageBanner
          divContent="Unwrap the Joy of Shopping!"
          spanContent="Find exclusive deals, trending styles, and everything you need—all in one place. Shop now and save big!"
          divClassName="banner-content-holder"
          spanClassName="banner-subheading"
        />
      </div>
      <ProductList products={products} />
      <Footer />
    </section>
  );
}

export default HomePage;

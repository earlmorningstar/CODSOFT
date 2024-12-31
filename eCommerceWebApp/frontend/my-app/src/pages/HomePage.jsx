import { useQuery } from "@tanstack/react-query";
import HeroCarousel from "./HeroCarousel";
import FeaturedProducts from "./FeaturedProducts";
import api from "../utils/api";

import { RiMenLine, RiWomenLine } from "react-icons/ri";
import { LuGlasses } from "react-icons/lu";
import { GiBed } from "react-icons/gi";
import { IoPhonePortraitOutline } from "react-icons/io5";
import ProductList from "./ProductList";
import HomepageBanner from "./HomepageBanner";

function HomePage() {
  const { data: products = [], isLoading } = useQuery({
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

  console.log("Query state:", { isLoading, products });
  return (
    <section className="homepage-main-container">
      <div className="homepage-banner" id="wlcm-banner-id">
        <HomepageBanner divContent="Welcome to TrendVault!" />
      </div>
      <div className="homepage-select-tab-container">
        <span>
          <RiMenLine className="homepage-select-icon" size={20} /> <p>Men</p>
        </span>
        <span>
          <RiWomenLine className="homepage-select-icon" size={20} />{" "}
          <p>Women</p>
        </span>
        <span>
          <LuGlasses className="homepage-select-icon" size={20} /> <p>Gear</p>
        </span>
        <span>
          <IoPhonePortraitOutline className="homepage-select-icon" size={20} />{" "}
          <p>Devices</p>
        </span>
        <span>
          <GiBed className="homepage-select-icon" size={20} /> <p>Furnitures</p>
        </span>
      </div>
      <HeroCarousel />
      <FeaturedProducts products={products} />
      <ProductList products={products} />
    </section>
  );
}

export default HomePage;

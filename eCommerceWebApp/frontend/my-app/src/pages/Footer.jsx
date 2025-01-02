import { TbTruckDelivery } from "react-icons/tb";
import { FaPercent } from "react-icons/fa6";
import { AiOutlineGift } from "react-icons/ai";
import { BiSupport } from "react-icons/bi";
import { RiSecurePaymentLine } from "react-icons/ri";
import { GrSelect } from "react-icons/gr";

const Footer = () => {
  return (
    <footer className="footer-main-container">
      <h1>TrendVault</h1>
      <section>
        <div>
          <span>
            <TbTruckDelivery size={25} />
          </span>
          <span>
            <h3>No-cost delivery</h3>
            <p>Free shipping for orders above $600</p>
          </span>
        </div>
        <div>
          <span>
            <FaPercent size={25} />
          </span>
          <span>
            <h3>Budget-friendly cost</h3>
            <p>Obtain pricing directly from the stores</p>
          </span>
        </div>
        <div>
          <span>
            <AiOutlineGift size={25} />
          </span>
          <span>
            <h3>Daily Deals</h3>
            <p>Enjoy savings of up to 25% off</p>
          </span>
        </div>
        <div>
          <span>
            <GrSelect size={25} />
          </span>
          <span>
            <h3>Pick products</h3>
            <p>Unmatched variety</p>
          </span>
        </div>
        <div>
          <span>
            <BiSupport size={25} />
          </span>
          <span>
            <h3>Assistance available round the clock</h3>
            <p>Purchase guided by a specialist</p>
          </span>
        </div>
        <div>
          <span>
            <RiSecurePaymentLine size={25} />
          </span>
          <span>
            <h3>Secure Payments</h3>
            <p>Fully safeguarded transactions</p>
          </span>
        </div>
      </section>
      <h5>©2025 TrendVault, Joelinton, Inc. (Earl Morningstar). All Rights Reserved.</h5>
    </footer>
  );
};

export default Footer;

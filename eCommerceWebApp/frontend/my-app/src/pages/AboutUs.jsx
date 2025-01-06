import { NavLink } from "react-router-dom";
import { IoChevronBackOutline } from "react-icons/io5";

const AboutUs = () => {
  return (
    <section className="aboutUs-main-container">
      <div className="usermenuPages-title-container">
        <span className="backIcon">
          <NavLink className="backIcon" to="/homepage">
            <IoChevronBackOutline size={25} color="#121212" />
            <IoChevronBackOutline size={25} color="#ffffff" />
          </NavLink>
        </span>
      </div>
      <section className="aboutUs-main-info-container">
        <h1>About Our E-commerce Platform</h1>

        <p>
          Welcome to TrendVault, our cutting-edge e-commerce platform, a
          comprehensive full-stack project showcasing modern web development
          practices and seamless integration of industry-leading technologies.
        </p>

        <h2>Technical Architecture</h2>

        <h3>Frontend Development</h3>
        <div>
          <li>
            React-based component architecture with modular design patterns
          </li>
          <li>
            Global state management through React Context API, implementing:
          </li>
        </div>
        <span>
          <li>AuthContext for user authentication state</li>
          <li>CartContext for shopping cart management</li>
          <li>WishlistContext for saved items</li>
          <li>NotificationContext for real-time alerts</li>
          <li>ThemeContext for application appearance management</li>
        </span>
        <div>
          <li>
            Responsive design implementation ensuring cross-device compatibility
          </li>
          <li>
            Optimized product synchronization with Shopify's data structure
          </li>
        </div>

        <h3>Backend Infrastructure</h3>
        <div>
          <li>Node.js runtime environment with Express.js framework</li>
          <li>RESTful API architecture with the following controllers:</li>
        </div>
        <span>
          <li>
            Authentication Controller: Handling user registration, login, and
            password recovery
          </li>
          <li>Card Controller: Managing secure payment method storage</li>
          <li>Cart Controller: Processing shopping cart operations</li>
          <li>Notification Controller: Managing real-time user alerts</li>
          <li>Order Controller: Handling purchase and fulfillment processes</li>
          <li>
            Product Controller: Synchronizing with Shopify's product ecosystem
          </li>
          <li>Wishlist Controller: Managing saved items</li>
        </span>

        <h3>Database Design</h3>
        <p>MongoDB implementation with sophisticated schemas:</p>

        <div>
          <li>
            User Schema: Storing essential user information with encrypted
            passwords
          </li>
          <li>
            Card Schema: Securely storing last 4 digits of payment methods
          </li>
          <li>Cart Schema: Managing active shopping sessions</li>
          <li>Order Schema: Tracking purchase history and status</li>
          <li>Product Schema: Synchronized with Shopify's product structure</li>
          <li>Notification Schema: Managing user alerts and updates</li>
          <li>Wishlist Schema: Tracking saved items</li>
        </div>

        <h3>Real-time Communication</h3>
        <div>
          <li>WebSocket implementation for instant notifications</li>
          <li>Server-sent events for order status updates</li>
          <li>Real-time cart synchronization across multiple sessions</li>
        </div>

        <h2>Security Features</h2>
        <h3>Authentication & Authorization</h3>
        <div>
          <li>JWT-based authentication system</li>
          <li>Secure password hashing</li>
          <li>Role-based access control</li>
          <li>Password recovery system using NodeMailer with Gmail SMTP</li>
          <li>Multi-factor account deletion protection</li>
        </div>

        <h3>Payment Security</h3>
        <div>
          <li>PCI-compliant payment processing through Stripe</li>
          <li>Encrypted card storage</li>
          <li>Password-protected payment method viewing</li>
          <li>Support for multiple test scenarios:</li>
        </div>
        <span>
          <li>Standard transactions (Visa/MasterCard/Discover/Others)</li>
          <li>Declined payments</li>
          <li>Expired cards</li>
          <li>Insufficient funds</li>
          <li>Various error states</li>
        </span>

        <h2>User Features</h2>

        <h3>Shopping Experience</h3>

        <div>
          <li>Advanced product search with filters</li>
          <li>Search history tracking and suggestions</li>
          <li>Real-time cart updates</li>
          <li>Wishlist management</li>
          <li>Order tracking and history</li>
        </div>

        <h3>Account Management</h3>

        <div>
          <li>Profile customization</li>
          <li>Secure payment method management</li>
          <li>Order history tracking</li>
          <li>Account settings control</li>
          <li>Theme preference persistence</li>
        </div>

        <h3>Payment Processing</h3>

        <p>
          Integrated Stripe payment system supporting various test scenarios:
        </p>

        <aside>
          <h4>MasterCard: 5555 5555 5555 4444</h4>
          <h4>Visa Card: 4242 4242 4242 4242</h4>
          <h4>Generic Declined: 4000 0000 0000 9995</h4>
          <h4>Expired Card: 4000 0000 0000 0069</h4>
          <h4>Insufficient Funds: 4000 0000 0000 9995</h4>
        </aside>

        <p>
          All test cards accept any future expiration date and any 3-digit CVV.
        </p>

        <h2>Integration Features</h2>

        <h3>Shopify Integration</h3>

        <div>
          <li>Real-time product synchronization</li>
          <li>Inventory management</li>
          <li>Product category organization</li>
          <li>Price and description updates</li>
          <li>Image and variant handling</li>
        </div>

        <h3>Email System</h3>

        <div>
          <li>Nodemailer implementation with Gmail SMTP</li>
          <li>Password recovery workflow</li>
        </div>

        <p>
          This project exemplifies the implementation of modern web development
          practices, demonstrating expertise in both frontend and backend
          technologies while maintaining high standards of security,
          performance, and user experience. It serves as a comprehensive
          showcase of full-stack development capabilities and third-party
          service integration.
        </p>

        <main>
          ©2025 TrendVault, Joelinton, Inc. (Earl Morningstar). All Rights
          Reserved.
        </main>
      </section>
    </section>
  );
};

export default AboutUs;

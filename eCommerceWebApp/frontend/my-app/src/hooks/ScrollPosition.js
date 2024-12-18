import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollPosition = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Always scroll to top when route changes
    window.scrollTo(0, 0);

    // Save scroll positions for different routes
    const saveScrollPosition = () => {
      sessionStorage.setItem(
        `scrollPosition:${location.pathname}`,
        window.scrollY.toString()
      );
    };

    // Restore scroll position for specific route when navigating back
    const restoreScrollPosition = () => {
      const savedPosition = sessionStorage.getItem(
        `scrollPosition:${location.pathname}`
      );

      if (savedPosition) {
        window.scrollTo(0, parseInt(savedPosition, 10));
      }
    };

    window.addEventListener("scroll", saveScrollPosition);

    // Restore position after a short delay to ensure page is rendered
    const timeoutId = setTimeout(restoreScrollPosition, 0);

    return () => {
      window.removeEventListener("scroll", saveScrollPosition);
      clearTimeout(timeoutId);
    };
  }, [location.pathname]);

  return children;
};

export default ScrollPosition;

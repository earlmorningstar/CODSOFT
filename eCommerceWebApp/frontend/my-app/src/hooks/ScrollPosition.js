import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollPosition = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    const handleBeforeUnload = () => {
      const scrollPosition = window.scrollY;
      window.history.replaceState({ scrollPosition }, "");
    };
    const restoreScrollPosition = () => {
      const savedState = window.history.state;
      if (savedState?.scrollPosition) {
        window.scrollTo(0, savedState.scrollPosition);
      } else {
        window.scrollTo(0, 0);
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    restoreScrollPosition();
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [location]);
  return children;
};

export default ScrollPosition;

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Hide default cursor
    document.body.style.cursor = 'none';
    
    // Add style to all links and buttons
    const styleHover = () => {
      const elements = document.querySelectorAll('a, button');
      elements.forEach(el => el.style.cursor = 'none');
    };
    
    styleHover();

    // Observer for dynamically added elements
    const observer = new MutationObserver(styleHover);
    observer.observe(document.body, { childList: true, subtree: true });

    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e) => {
      if (
        e.target.tagName.toLowerCase() === "button" ||
        e.target.tagName.toLowerCase() === "a" ||
        e.target.closest("button") ||
        e.target.closest("a")
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener("mousemove", updateMousePosition);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      window.removeEventListener("mouseover", handleMouseOver);
      document.body.style.cursor = 'auto';
      observer.disconnect();
    };
  }, []);

  const variants = {
    default: {
      x: mousePosition.x - 10,
      y: mousePosition.y - 10,
      scale: 1,
      backgroundColor: "transparent",
      border: "1px solid rgba(226, 200, 147, 0.5)",
      transition: { type: "spring", stiffness: 500, damping: 28, mass: 0.5 },
    },
    hover: {
      x: mousePosition.x - 24,
      y: mousePosition.y - 24,
      scale: 1.5,
      backgroundColor: "rgba(226, 200, 147, 0.1)",
      border: "1px solid rgba(226, 200, 147, 0.8)",
      backdropFilter: "blur(2px)",
      transition: { type: "spring", stiffness: 500, damping: 28, mass: 0.5 },
    },
  };

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[9999] h-5 w-5 rounded-full"
      variants={variants}
      animate={isHovering ? "hover" : "default"}
    />
  );
}

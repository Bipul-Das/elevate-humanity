// client/src/components/Logo.jsx
import { Link } from "react-router-dom";

const Logo = ({ scale = 1 }) => {
  // Base dimensions that will multiply by the scale prop
  const boxSize = 46 * scale;
  const boxFontSize = 28 * scale;
  const boxRadius = 12 * scale;
  const textFontSize = 32 * scale;

  return (
    <Link
      to="/"
      className="text-decoration-none d-inline-flex align-items-center"
      style={{ gap: `${10 * scale}px`, userSelect: "none" }}
    >
      {/* 1. The Rounded Icon Box */}
      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          width: `${boxSize}px`,
          height: `${boxSize}px`,
          backgroundColor: "#63A0E8", // Exact Light Blue from design
          borderRadius: `${boxRadius}px`,
          color: "#ffffff",
          fontWeight: 800,
          fontSize: `${boxFontSize}px`,
          letterSpacing: `-${2 * scale}px`, // Pulls the 'E' and 'H' tightly together
          paddingRight: `${3 * scale}px`, // Visually centers the letters after negative spacing
          fontFamily: '"Arial", sans-serif',
          lineHeight: 1,
        }}
      >
        EH
      </div>

      {/* 2. The Typography */}
      <div
        style={{
          fontSize: `${textFontSize}px`,
          fontWeight: 700,
          letterSpacing: `-${1 * scale}px`, // Slight negative tracking for professional look
          fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
          lineHeight: 1,
          paddingTop: `${2 * scale}px`, // Aligns text baseline perfectly with the box
        }}
      >
        <span style={{ color: "#8CC672" }}>Elevate</span>
        <span style={{ color: "#5A67C8" }}>Humanity</span>
      </div>
    </Link>
  );
};

export default Logo;

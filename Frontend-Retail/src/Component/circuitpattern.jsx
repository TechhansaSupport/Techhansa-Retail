// src/Component/circuitpattern.jsx
const CircuitPattern = ({ id = "circuit-bg", color = "#2A85D1", opacity = 0.15 }) => (
  <svg
    // Yahan -z-10 ki jagah z-0 lagaya hai taaki ye body ke upar rahe
    className="fixed inset-0 w-full h-full pointer-events-none z-0"
    preserveAspectRatio="none"
  >
    <defs>
      <pattern id={id} width="140" height="140" patternUnits="userSpaceOnUse">
        <path d="M0 26 H48 V72 H104 V140" stroke={color} strokeWidth="1.4" fill="none" opacity={opacity} />
        <path d="M140 100 H90 V42 H26 V0" stroke={color} strokeWidth="1.4" fill="none" opacity={opacity} />
        <path d="M0 116 H24" stroke={color} strokeWidth="1.4" fill="none" opacity={opacity} />
        <circle cx="48" cy="26" r="2.6" fill={color} opacity={opacity * 1.8} />
        <circle cx="104" cy="72" r="2.6" fill={color} opacity={opacity * 1.8} />
        <circle cx="90" cy="100" r="2.6" fill={color} opacity={opacity * 1.8} />
        <circle cx="26" cy="42" r="2.6" fill={color} opacity={opacity * 1.8} />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill={`url(#${id})`} />
  </svg>
);

export default CircuitPattern;

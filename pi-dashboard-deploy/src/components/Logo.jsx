import { PI_RED } from "../config/constants";

export default function Logo({ size = 26 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-label="PI Logo">
      <circle cx="50" cy="50" r="50" fill={PI_RED} />
      <text
        x="50"
        y="68"
        textAnchor="middle"
        fill="#fff"
        fontFamily="'Montserrat', sans-serif"
        fontWeight="800"
        fontSize="52"
        letterSpacing="-2"
      >
        Pi
      </text>
    </svg>
  );
}

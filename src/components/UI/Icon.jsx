import { C } from "../../utils/constants";

export default function Icon({ name, size = 20, color = "currentColor", style: extraStyle = {} }) {
  const s = { width: size, height: size, display: "inline-block", verticalAlign: "middle", flexShrink: 0, ...extraStyle };
  const paths = {
    clock:
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <circle cx="12" cy="12" r="9"/>
        <polyline points="12 7 12 12 15 15"/>
      </svg>,
    briefcase:
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <rect x="2" y="7" width="20" height="14" rx="2"/>
        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
        <path d="M2 12h20"/>
      </svg>,
    heart:
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"/>
      </svg>,
    globe:
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <circle cx="12" cy="12" r="9"/>
        <line x1="3.05" y1="9" x2="20.95" y2="9"/>
        <line x1="3.05" y1="15" x2="20.95" y2="15"/>
        <path d="M11.5 3a17 17 0 0 0 0 18"/>
        <path d="M12.5 3a17 17 0 0 1 0 18"/>
      </svg>,
    refresh:
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <polyline points="23 4 23 10 17 10"/>
        <polyline points="1 20 1 14 7 14"/>
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
      </svg>,
    faceId:
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5">
        <path d="M9 3H5a2 2 0 0 0-2 2v4"/>
        <path d="M15 3h4a2 2 0 0 1 2 2v4"/>
        <path d="M9 21H5a2 2 0 0 1-2-2v-4"/>
        <path d="M15 21h4a2 2 0 0 0 2-2v-4"/>
        <circle cx="9" cy="10" r="1" fill={color}/>
        <circle cx="15" cy="10" r="1" fill={color}/>
        <path d="M9 15a3 3 0 0 0 6 0"/>
      </svg>,
  };
  return paths[name] || null;
}
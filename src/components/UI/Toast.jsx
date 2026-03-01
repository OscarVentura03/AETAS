import { C, F } from "../../utils/constants";

export default function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div style={{
      position: "fixed",
      bottom: 32,
      left: "50%",
      transform: "translateX(-50%)",
      background: C.brown,
      color: C.bg,
      padding: "10px 26px",
      fontFamily: F.ral,
      fontSize: 11,
      letterSpacing: "0.12em",
      zIndex: 3000,
      whiteSpace: "nowrap",
      animation: "toastIn .3s ease"
    }}>
      {msg}
    </div>
  );
}
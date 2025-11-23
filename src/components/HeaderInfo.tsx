import type React from "react";
import useKeyboard from "../hooks/useKeyboard";

const HEADER_HEIGHT = 100;

const HeaderInfo: React.RC = () => {
  const { visible, keyboardHeight, viewportHeight } = useKeyboard();

  return (
    <div
      className="header"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: HEADER_HEIGHT,
        maxHeight: HEADER_HEIGHT,
        minHeight: HEADER_HEIGHT,
        flexShrink: 0,
        transition: "height 0.3s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      <div style={{ fontWeight: "bold", fontSize: 18 }}>Teclado activo</div>
      <div>Pantalla visible: {viewportHeight}px</div>
      <div>Altura teclado: {keyboardHeight}px</div>
    </div>
  );
};

export default HeaderInfo;
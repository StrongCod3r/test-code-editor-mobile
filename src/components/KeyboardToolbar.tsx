import React, { useState } from "react";

interface KeyboardToolbarProps {
  onInsertSymbol?: (symbol: string) => void;
  onAction?: (action: string) => void;
  symbols?: string[];
}

const DEFAULT_SYMBOLS = [
  "{",
  "}",
  "(",
  ")",
  "[",
  "]",
  ";",
  ":",
  ",",
  ".",
  "=",
  "+",
  "-",
  "*",
  "/",
  "<",
  ">",
  "!",
  "?",
  "|",
  "&",
  "%",
  '"',
  "'",
  "`",
  "#",
  "@",
  "$",
  "^",
  "_",
  "~",
];

const KeyboardToolbar: React.FC<KeyboardToolbarProps> = ({
  onInsertSymbol,
  onAction,
  symbols = DEFAULT_SYMBOLS,
}) => {
  const [mode, setMode] = useState<"symbols" | "nav">("symbols");
  const [isSelecting, setIsSelecting] = useState(false);

  const handleInsert = (e: React.PointerEvent, symbol: string) => {
    e.preventDefault();
    e.stopPropagation();
    onInsertSymbol?.(symbol);
  };

  const handleAction = (e: React.PointerEvent, action: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAction) {
      if (["left", "right", "up", "down"].includes(action) && isSelecting) {
        onAction("select-" + action);
      } else {
        onAction(action);
      }
    }
  };

  const handleModeChange = (
    e: React.PointerEvent,
    newMode: "symbols" | "nav"
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setMode(newMode);
  };

  const handleSelectToggle = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsSelecting(!isSelecting);
  };

  const btnBase: React.CSSProperties = {
    border: "none",
    borderRadius: 4,
    color: "#fff",
    cursor: "pointer",
    touchAction: "manipulation",
    userSelect: "none",
  };

  const modeBtnStyle = (active: boolean): React.CSSProperties => ({
    ...btnBase,
    background: active ? "#007acc" : "#333",
    padding: "4px 8px",
    fontSize: 14,
  });

  const symbolBtnStyle: React.CSSProperties = {
    ...btnBase,
    background: "#333",
    padding: "6px 10px",
    fontSize: 18,
    margin: 0,
    minWidth: 36,
  };

  const tabBtnStyle: React.CSSProperties = {
    ...btnBase,
    background: "#007acc",
    padding: "6px 10px",
    fontSize: 14,
    margin: 0,
    minWidth: 36,
    fontWeight: "bold",
  };

  const navBtnStyle: React.CSSProperties = {
    ...btnBase,
    background: "#444",
    padding: "8px 12px",
    fontSize: 16,
  };

  // Prevenir scroll vertical en todo el toolbar
  const preventVerticalScroll = (e: React.TouchEvent) => {
    // Solo prevenir si el movimiento es principalmente vertical
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const target = e.currentTarget as HTMLElement;
      const startY = touch.clientY;

      const handleTouchMove = (moveEvent: TouchEvent) => {
        const moveTouch = moveEvent.touches[0];
        const deltaY = Math.abs(moveTouch.clientY - startY);
        const deltaX = Math.abs(moveTouch.clientX - touch.clientX);

        // Si el movimiento es más vertical que horizontal, prevenir
        if (deltaY > deltaX) {
          moveEvent.preventDefault();
        }
      };

      const handleTouchEnd = () => {
        target.removeEventListener("touchmove", handleTouchMove);
        target.removeEventListener("touchend", handleTouchEnd);
      };

      target.addEventListener("touchmove", handleTouchMove, { passive: false });
      target.addEventListener("touchend", handleTouchEnd);
    }
  };

  return (
    <div
      className="keyboard-toolbar-container"
      onTouchStart={preventVerticalScroll}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 5,
        touchAction: "pan-x",
        overscrollBehavior: "contain",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "0 10px",
          alignItems: "center",
          touchAction: "none",
        }}
      >
        <div style={{ display: "flex", gap: 5 }}>
          <button
            type="button"
            tabIndex={-1}
            onPointerDown={(e) => handleModeChange(e, "symbols")}
            style={modeBtnStyle(mode === "symbols")}
          >
            Symbols
          </button>
          <button
            type="button"
            tabIndex={-1}
            onPointerDown={(e) => handleModeChange(e, "nav")}
            style={modeBtnStyle(mode === "nav")}
          >
            Navigation
          </button>
        </div>
        {mode === "nav" && (
          <button
            type="button"
            tabIndex={-1}
            onPointerDown={handleSelectToggle}
            style={{
              ...btnBase,
              background: isSelecting ? "#d9534f" : "#333",
              padding: "4px 8px",
              fontSize: 14,
            }}
          >
            {isSelecting ? "Selecting..." : "Select Mode"}
          </button>
        )}
      </div>

      {mode === "symbols" ? (
        <div
          className="keyboard-toolbar"
          style={{
            display: "flex",
            overflowX: "auto",
            overflowY: "hidden",
            gap: 10,
            padding: "0 10px",
            scrollbarWidth: "none",
            touchAction: "pan-x",
            overscrollBehavior: "contain",
          }}
        >
          <button
            type="button"
            tabIndex={-1}
            onPointerDown={(e) => handleInsert(e, "  ")}
            style={tabBtnStyle}
          >
            Tab
          </button>
          {symbols.map((symbol) => (
            <button
              key={symbol}
              type="button"
              tabIndex={-1}
              onPointerDown={(e) => handleInsert(e, symbol)}
              style={symbolBtnStyle}
            >
              {symbol}
            </button>
          ))}
        </div>
      ) : (
        <div
          className="keyboard-toolbar-nav"
          style={{
            display: "flex",
            overflowX: "auto",
            overflowY: "hidden",
            gap: 10,
            padding: "0 10px",
            scrollbarWidth: "none",
            touchAction: "pan-x",
            overscrollBehavior: "contain",
          }}
        >
          <button
            tabIndex={-1}
            onPointerDown={(e) => handleAction(e, "left")}
            style={navBtnStyle}
          >
            ←
          </button>
          <button
            tabIndex={-1}
            onPointerDown={(e) => handleAction(e, "down")}
            style={navBtnStyle}
          >
            ↓
          </button>
          <button
            tabIndex={-1}
            onPointerDown={(e) => handleAction(e, "up")}
            style={navBtnStyle}
          >
            ↑
          </button>
          <button
            tabIndex={-1}
            onPointerDown={(e) => handleAction(e, "right")}
            style={navBtnStyle}
          >
            →
          </button>
          <div style={{ width: 10 }} />
          <button
            tabIndex={-1}
            onPointerDown={(e) => handleAction(e, "select-word")}
            style={navBtnStyle}
          >
            Word
          </button>
          <button
            tabIndex={-1}
            onPointerDown={(e) => handleAction(e, "select-line")}
            style={navBtnStyle}
          >
            Line
          </button>
          <button
            tabIndex={-1}
            onPointerDown={(e) => handleAction(e, "copy")}
            style={navBtnStyle}
          >
            Copy
          </button>
          <button
            tabIndex={-1}
            onPointerDown={(e) => handleAction(e, "paste")}
            style={navBtnStyle}
          >
            Paste
          </button>
          <div style={{ width: 10 }} />
          <button
            tabIndex={-1}
            onPointerDown={(e) => handleAction(e, "undo")}
            style={navBtnStyle}
          >
            Undo
          </button>
          <button
            tabIndex={-1}
            onPointerDown={(e) => handleAction(e, "redo")}
            style={navBtnStyle}
          >
            Redo
          </button>
        </div>
      )}
    </div>
  );
};

export default KeyboardToolbar;

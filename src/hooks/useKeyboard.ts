import { useEffect, useState } from "react";

export default function useKeyboard() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [visible, setVisible] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(
    typeof window !== 'undefined' ? window.innerHeight : 0
  );

  useEffect(() => {
    // Verificar si visualViewport está disponible
    if (typeof window === 'undefined' || !window.visualViewport) {
      console.warn('visualViewport no está disponible');
      return;
    }

    const viewport = window.visualViewport;

    const updateViewport = () => {
      const currentViewportHeight = viewport.height;
      const windowHeight = window.innerHeight;
      const heightDiff = windowHeight - currentViewportHeight;

      console.log('Viewport update:', {
        windowHeight,
        currentViewportHeight,
        heightDiff,
        offsetTop: viewport.offsetTop,
        offsetLeft: viewport.offsetLeft
      });

      // Detectar si el teclado está visible (diferencia significativa)
      if (heightDiff > 150) {
        console.log('Teclado detectado - visible');
        setVisible(true);
        setKeyboardHeight(heightDiff);
        setViewportHeight(currentViewportHeight);
      } else {
        console.log('Teclado oculto');
        setVisible(false);
        setKeyboardHeight(0);
        setViewportHeight(windowHeight);
      }
    };

    // Escuchar múltiples eventos para mayor compatibilidad
    viewport.addEventListener("resize", updateViewport);
    viewport.addEventListener("scroll", updateViewport);

    // También escuchar cambios en window para casos edge
    window.addEventListener("resize", updateViewport);

    // Ejecutar inmediatamente para obtener el estado inicial
    updateViewport();

    return () => {
      viewport.removeEventListener("resize", updateViewport);
      viewport.removeEventListener("scroll", updateViewport);
      window.removeEventListener("resize", updateViewport);
    };
  }, []);

  return { visible, keyboardHeight, viewportHeight };
}
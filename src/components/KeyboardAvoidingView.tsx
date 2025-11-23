import React, { type CSSProperties, type ReactNode } from 'react';
import useKeyboard from '../hooks/useKeyboard';

interface KeyboardAvoidingViewProps {
  children: ReactNode;
  behavior?: 'height' | 'position' | 'padding';
  enabled?: boolean;
  keyboardVerticalOffset?: number;
  style?: CSSProperties;
  className?: string;
  contentContainerStyle?: CSSProperties;
}

/**
 * Componente que ajusta automáticamente su contenido cuando el teclado virtual aparece.
 * Similar a KeyboardAvoidingView de React Native.
 *
 * @param behavior - Cómo ajustar el contenido:
 *   - 'height': Reduce la altura del contenedor
 *   - 'position': Desplaza el contenido hacia arriba
 *   - 'padding': Añade padding inferior
 * @param enabled - Si el componente debe responder al teclado (por defecto: true)
 * @param keyboardVerticalOffset - Offset adicional en píxeles (por defecto: 0)
 */
const KeyboardAvoidingView: React.FC<KeyboardAvoidingViewProps> = ({
  children,
  behavior = 'height',
  enabled = true,
  keyboardVerticalOffset = 0,
  style,
  className,
  contentContainerStyle,
}) => {
  const { keyboardHeight, viewportHeight } = useKeyboard();

  const getContainerStyle = (): CSSProperties => {
    if (!enabled) {
      return style || {};
    }

    const adjustedHeight = keyboardHeight - keyboardVerticalOffset;

    switch (behavior) {
      case 'height':
        return {
          ...style,
          height: `${viewportHeight - keyboardVerticalOffset}px`,
          maxHeight: `${viewportHeight - keyboardVerticalOffset}px`,
        };

      case 'position':
        return {
          ...style,
          transform: `translateY(-${adjustedHeight}px)`,
          transition: 'transform 0.25s ease-out',
        };

      case 'padding':
        return {
          ...style,
          paddingBottom: `${adjustedHeight}px`,
          transition: 'padding-bottom 0.25s ease-out',
        };

      default:
        return style || {};
    }
  };

  return (
    <div className={className} style={getContainerStyle()}>
      {contentContainerStyle ? (
        <div style={contentContainerStyle}>{children}</div>
      ) : (
        children
      )}
    </div>
  );
};

export default KeyboardAvoidingView;

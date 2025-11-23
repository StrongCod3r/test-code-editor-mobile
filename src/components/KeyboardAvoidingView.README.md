# KeyboardAvoidingView

Componente reutilizable que ajusta automáticamente su contenido cuando el teclado virtual aparece en dispositivos móviles. Similar a `KeyboardAvoidingView` de React Native.

## Uso Básico

```tsx
import KeyboardAvoidingView from './components/KeyboardAvoidingView';

function MyComponent() {
  return (
    <KeyboardAvoidingView behavior="height">
      <input type="text" placeholder="Escribe algo..." />
      <button>Enviar</button>
    </KeyboardAvoidingView>
  );
}
```

## Props

### `behavior`
Tipo: `'height' | 'position' | 'padding'`
Default: `'height'`

Determina cómo el componente ajusta su contenido:

- **`'height'`**: Reduce la altura del contenedor para que quepa en el espacio visible
- **`'position'`**: Desplaza el contenido hacia arriba usando `transform`
- **`'padding'`**: Añade padding inferior para empujar el contenido hacia arriba

```tsx
// Ejemplo con diferentes behaviors
<KeyboardAvoidingView behavior="height">
  {/* Reduce la altura del contenedor */}
</KeyboardAvoidingView>

<KeyboardAvoidingView behavior="position">
  {/* Desplaza el contenedor hacia arriba */}
</KeyboardAvoidingView>

<KeyboardAvoidingView behavior="padding">
  {/* Añade padding inferior */}
</KeyboardAvoidingView>
```

### `enabled`
Tipo: `boolean`
Default: `true`

Habilita o deshabilita el ajuste automático del teclado.

```tsx
<KeyboardAvoidingView enabled={false}>
  {/* No se ajustará cuando aparezca el teclado */}
</KeyboardAvoidingView>
```

### `keyboardVerticalOffset`
Tipo: `number`
Default: `0`

Offset adicional en píxeles. Útil cuando tienes headers o elementos fijos.

```tsx
// Si tienes un header de 50px
<KeyboardAvoidingView
  behavior="height"
  keyboardVerticalOffset={50}
>
  {/* Se ajustará considerando los 50px del header */}
</KeyboardAvoidingView>
```

### `style`
Tipo: `CSSProperties`
Default: `{}`

Estilos CSS personalizados para el contenedor principal.

```tsx
<KeyboardAvoidingView
  style={{
    backgroundColor: '#f0f0f0',
    padding: '20px'
  }}
>
  {children}
</KeyboardAvoidingView>
```

### `className`
Tipo: `string`
Default: `undefined`

Clase CSS para el contenedor principal.

```tsx
<KeyboardAvoidingView className="my-custom-class">
  {children}
</KeyboardAvoidingView>
```

### `contentContainerStyle`
Tipo: `CSSProperties`
Default: `undefined`

Estilos para un contenedor interno adicional. Si se proporciona, se crea un `<div>` adicional que envuelve los children.

```tsx
<KeyboardAvoidingView
  contentContainerStyle={{
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  }}
>
  {children}
</KeyboardAvoidingView>
```

## Ejemplos Avanzados

### Formulario con múltiples inputs

```tsx
import KeyboardAvoidingView from './components/KeyboardAvoidingView';

function LoginForm() {
  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={60}
      style={{ padding: '20px' }}
    >
      <h1>Iniciar Sesión</h1>
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Contraseña" />
      <button>Entrar</button>
    </KeyboardAvoidingView>
  );
}
```

### Editor de código

```tsx
import KeyboardAvoidingView from './components/KeyboardAvoidingView';
import CodeMirror from '@uiw/react-codemirror';

function CodeEditor() {
  return (
    <KeyboardAvoidingView
      behavior="height"
      className="code-editor-container"
    >
      <div className="toolbar">
        {/* Toolbar buttons */}
      </div>
      <CodeMirror
        value={code}
        onChange={setCode}
      />
    </KeyboardAvoidingView>
  );
}
```

### Chat con input fijo al fondo

```tsx
import KeyboardAvoidingView from './components/KeyboardAvoidingView';

function Chat() {
  return (
    <KeyboardAvoidingView
      behavior="position"
      contentContainerStyle={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <div className="messages" style={{ flex: 1, overflow: 'auto' }}>
        {/* Mensajes */}
      </div>
      <div className="input-container">
        <input type="text" placeholder="Escribe un mensaje..." />
        <button>Enviar</button>
      </div>
    </KeyboardAvoidingView>
  );
}
```

## Cómo Funciona

El componente utiliza el hook `useKeyboard` que:

1. Detecta cambios en `window.visualViewport`
2. Calcula la altura del teclado virtual
3. Obtiene la altura del viewport visible
4. Aplica los ajustes según el `behavior` seleccionado

## Compatibilidad

- ✅ iOS Safari
- ✅ Chrome Android
- ✅ Firefox Android
- ✅ Edge Mobile
- ⚠️ Navegadores desktop (no afecta, el componente simplemente no hace nada)

## Notas

- El componente solo actúa cuando el teclado virtual aparece (altura > 150px)
- En desktop, el componente se comporta como un `<div>` normal
- Las transiciones son suaves (0.25s ease-out)
- Compatible con SSR (no hay errores en servidor)

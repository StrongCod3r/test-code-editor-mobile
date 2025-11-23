import { useRef } from "react";
import "./App.css";
import CodeMirrorEditor, {
  type CodeMirrorEditorHandle,
} from "./components/CodeMirrorEditor";
import HeaderInfo from "./components/HeaderInfo";
import KeyboardAvoidingView from "./components/KeyboardAvoidingView";
import KeyboardToolbar from "./components/KeyboardToolbar";
import { exampleCode } from "./exampleCode";

function App() {
  const editorRef = useRef<CodeMirrorEditorHandle>(null);

  const handleInsertSymbol = (symbol: string) => {
    editorRef.current?.insertText(symbol);
  };

  const handleAction = (action: string) => {
    editorRef.current?.executeAction(action);
  };

  return (
    <KeyboardAvoidingView
      behavior="height"
      style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}
    >
      <HeaderInfo />

      <CodeMirrorEditor ref={editorRef} value={exampleCode} />

      <KeyboardToolbar
        onInsertSymbol={handleInsertSymbol}
        onAction={handleAction}
      />
    </KeyboardAvoidingView>
  );
}

export default App;

import { redo, undo } from "@codemirror/commands";
import { javascript } from "@codemirror/lang-javascript";
import { EditorView } from "@codemirror/view";
import type { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import CodeMirror from "@uiw/react-codemirror";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

const BOTTOM_PADDING = 300;

const bottomPadding = EditorView.theme({
  ".cm-content": {
    paddingBottom: `${BOTTOM_PADDING}px`,
  },
});

interface CodeMirrorEditorProps {
  value: string;
  onChange?: (value: string) => void;
}

export interface CodeMirrorEditorHandle {
  insertText: (text: string) => void;
  executeAction: (action: string) => void;
}

const CodeMirrorEditor = forwardRef<
  CodeMirrorEditorHandle,
  CodeMirrorEditorProps
>(({ value, onChange}, ref) => {
  const editorRef = useRef<ReactCodeMirrorRef>(null);
  const hiddenInputRef = useRef<HTMLTextAreaElement>(null);

  //   const divRef = useRef<HTMLDivElement | null>(null);

  // useEffect(() => {
  //   if (divRef.current) {
  //     const rect = divRef.current.getBoundingClientRect();
  //     console.log("Posición X:", rect.x);
  //     console.log("Posición Y:", rect.y);
  //     console.log("Anchura:", rect.width);
  //     console.log("Altura:", rect.height);
  //   }
  // }, []);

  const insertText = useCallback((text: string) => {
    const view = editorRef.current?.view;
    if (!view) return;

    const scrollTop = view.scrollDOM.scrollTop;
    const { state } = view;
    const selection = state.selection.main;

    view.dispatch({
      changes: { from: selection.from, to: selection.to, insert: text },
      selection: { anchor: selection.from + text.length },
      scrollIntoView: false,
    });

    requestAnimationFrame(() => {
      view.scrollDOM.scrollTop = scrollTop;
    });

    view.focus();
  }, []);

  const executeAction = useCallback((action: string) => {
    const view = editorRef.current?.view;
    if (!view) return;

    const scrollTop = view.scrollDOM.scrollTop;
    const { state } = view;
    const selection = state.selection.main;

    const restoreScroll = () => {
      requestAnimationFrame(() => {
        view.scrollDOM.scrollTop = scrollTop;
      });
    };

    switch (action) {
      case "left":
        view.dispatch({
          selection: { anchor: Math.max(0, selection.head - 1) },
          scrollIntoView: false,
        });
        break;
      case "right":
        view.dispatch({
          selection: { anchor: Math.min(state.doc.length, selection.head + 1) },
          scrollIntoView: false,
        });
        break;
      case "up": {
        const line = state.doc.lineAt(selection.head);
        if (line.number > 1) {
          const prevLine = state.doc.line(line.number - 1);
          const col = selection.head - line.from;
          const newPos = Math.min(prevLine.from + col, prevLine.to);
          view.dispatch({
            selection: { anchor: newPos },
            scrollIntoView: false,
          });
        }
        break;
      }
      case "down": {
        const line = state.doc.lineAt(selection.head);
        if (line.number < state.doc.lines) {
          const nextLine = state.doc.line(line.number + 1);
          const col = selection.head - line.from;
          const newPos = Math.min(nextLine.from + col, nextLine.to);
          view.dispatch({
            selection: { anchor: newPos },
            scrollIntoView: false,
          });
        }
        break;
      }
      case "select-left":
        view.dispatch({
          selection: {
            anchor: selection.anchor,
            head: Math.max(0, selection.head - 1),
          },
          scrollIntoView: false,
        });
        break;
      case "select-right":
        view.dispatch({
          selection: {
            anchor: selection.anchor,
            head: Math.min(state.doc.length, selection.head + 1),
          },
          scrollIntoView: false,
        });
        break;
      case "select-word": {
        const wordRange = state.wordAt(selection.head);
        if (wordRange) {
          view.dispatch({
            selection: { anchor: wordRange.from, head: wordRange.to },
            scrollIntoView: false,
          });
        }
        break;
      }
      case "select-line": {
        const line = state.doc.lineAt(selection.head);
        view.dispatch({
          selection: { anchor: line.from, head: line.to },
          scrollIntoView: false,
        });
        break;
      }
      case "copy": {
        const selectedText = state.sliceDoc(selection.from, selection.to);
        if (selectedText) {
          view.focus();
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(selectedText).catch(() => {
              // Fallback: usar execCommand
              document.execCommand("copy");
            });
          } else {
            document.execCommand("copy");
          }
        }
        break;
      }
      case "paste": {
        // En móviles, usar un textarea oculto para capturar el paste nativo
        const textarea = hiddenInputRef.current;
        if (textarea) {
          textarea.value = "";
          textarea.focus();

          const handlePaste = (e: ClipboardEvent) => {
            e.preventDefault();
            const text = e.clipboardData?.getData("text/plain") || "";
            if (text) {
              view.dispatch({
                changes: { from: selection.from, to: selection.to, insert: text },
                selection: { anchor: selection.from + text.length },
                scrollIntoView: false,
              });
              restoreScroll();
            }
            view.focus();
            textarea.removeEventListener("paste", handlePaste);
          };

          textarea.addEventListener("paste", handlePaste);

          // Trigger paste con execCommand (funciona porque textarea tiene foco)
          document.execCommand("paste");

          // Timeout para limpiar si execCommand no dispara el evento
          setTimeout(() => {
            textarea.removeEventListener("paste", handlePaste);
            if (document.activeElement === textarea) {
              view.focus();
            }
          }, 100);
        }
        return;
      }
      case "undo":
        undo(view);
        break;
      case "redo":
        redo(view);
        break;
    }

    restoreScroll();
    view.focus();
  }, []);

  useImperativeHandle(
    ref,
    () => ({
      insertText,
      executeAction,
    }),
    [insertText, executeAction]
  );

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        overflowY: "auto",
        overscrollBehavior: "contain",
        position: "relative",
      }}
    >
      {/* Textarea oculto para capturar paste en móviles */}
      <textarea
        ref={hiddenInputRef}
        style={{
          position: "absolute",
          left: -9999,
          top: 0,
          width: 1,
          height: 1,
          opacity: 0,
        }}
        aria-hidden="true"
        tabIndex={-1}
      />
      <CodeMirror
        ref={editorRef}
        value={value}
        onChange={onChange}
        theme="dark"
        extensions={[javascript({ jsx: true, typescript: true }), bottomPadding]}
        basicSetup={{
          lineNumbers: true,
          highlightActiveLine: true,
          foldGutter: true,
          autocompletion: true,
          bracketMatching: true,
          closeBrackets: true,
          tabSize: 2,
        }}
        style={{
          height: "100%",
          width: "100%",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
        }}
      />
    </div>
  );
});

CodeMirrorEditor.displayName = "CodeMirrorEditor";

export default CodeMirrorEditor;

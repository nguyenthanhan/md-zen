import React, { Suspense, lazy } from "react";
import type { EditorRef } from "./Editor";

// Lazy load the Editor component since CodeMirror is large
const Editor = lazy(() => import("./Editor"));

interface LazyEditorProps {
  content: string;
  onContentChange: (content: string) => void;
  fontSize: number;
  isDarkMode: boolean;
}

const EditorSkeleton = () => (
  <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="text-center">
      <div className="animate-pulse">
        <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-4"></div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Loading editor...
        </div>
      </div>
    </div>
  </div>
);

const LazyEditor = React.forwardRef<EditorRef, LazyEditorProps>(
  (props, ref) => {
    return (
      <Suspense fallback={<EditorSkeleton />}>
        <Editor ref={ref} {...props} />
      </Suspense>
    );
  }
);

LazyEditor.displayName = "LazyEditor";

export default LazyEditor;

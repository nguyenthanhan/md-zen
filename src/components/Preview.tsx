import React, { useRef } from "react";
import { parseMarkdown } from "@lib/markdown";
import { ScrollSyncManager } from "@utils/scrollSync";
import { EDITOR_CONFIG } from "@utils/constants";

interface PreviewProps {
  content: string;
  isDarkMode?: boolean;
}

const Preview: React.FC<PreviewProps> = ({ content }) => {
  const [htmlContent, setHtmlContent] = React.useState<string>("");
  const previewRef = useRef<HTMLDivElement>(null);
  const debounceTimeoutRef = useRef<number | null>(null);
  const lastContentRef = useRef<string>("");
  const scrollSyncManager = useRef(new ScrollSyncManager());

  React.useEffect(() => {
    // Skip if content hasn't changed (memoization)
    if (content === lastContentRef.current) {
      return;
    }

    // Clear existing timeout
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Debounce markdown parsing to reduce lag
    debounceTimeoutRef.current = setTimeout(() => {
      // Update last content reference
      lastContentRef.current = content;

      // Use requestIdleCallback if available for better performance
      if (window.requestIdleCallback) {
        window.requestIdleCallback(() => {
          parseMarkdown(content).then(setHtmlContent);
        });
      } else {
        parseMarkdown(content).then(setHtmlContent);
      }
    }, EDITOR_CONFIG.debounce.preview);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      scrollSyncManager.current.cleanup();
    };
  }, [content]);

  // Handle reverse scroll synchronization (preview -> editor)
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const previewElement = event.target as HTMLDivElement;
    scrollSyncManager.current.syncPreviewToEditor(previewElement);
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      <div
        ref={previewRef}
        className="flex-1 overflow-auto preview"
        onScroll={handleScroll}
      >
        <div
          className="prose prose-sm max-w-none p-4 text-gray-900 dark:text-gray-100 dark:prose-invert"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </div>
  );
};

export default Preview;

import React, { useRef } from "react";
import { parseMarkdown } from "@lib/markdown";

interface PreviewProps {
  content: string;
  isDarkMode?: boolean;
}

const Preview: React.FC<PreviewProps> = ({ content }) => {
  const [htmlContent, setHtmlContent] = React.useState<string>("");
  const previewRef = useRef<HTMLDivElement>(null);
  const isScrollingSyncRef = useRef(false);
  const debounceTimeoutRef = useRef<number | null>(null);
  const scrollSyncTimeoutRef = useRef<number | null>(null);
  const lastContentRef = useRef<string>("");

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
    }, 100); // Reduced to 100ms for better responsiveness

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
      if (scrollSyncTimeoutRef.current) {
        clearTimeout(scrollSyncTimeoutRef.current);
      }
    };
  }, [content]);

  // Handle reverse scroll synchronization (preview -> editor) with throttling
  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (isScrollingSyncRef.current) return;

    // Throttle scroll events to reduce lag
    if (scrollSyncTimeoutRef.current) return;

    const previewElement = event.target as HTMLDivElement;
    const scrollTop = previewElement.scrollTop;
    const scrollHeight =
      previewElement.scrollHeight - previewElement.clientHeight;
    const scrollPercentage = scrollHeight > 0 ? scrollTop / scrollHeight : 0;

    // Throttle scroll sync to 30fps (33ms) for better performance
    scrollSyncTimeoutRef.current = setTimeout(() => {
      const editorScroller = document.querySelector(".cm-scroller");
      if (editorScroller && !isScrollingSyncRef.current) {
        isScrollingSyncRef.current = true;

        const editorScrollHeight =
          editorScroller.scrollHeight - editorScroller.clientHeight;
        const targetScrollTop = scrollPercentage * editorScrollHeight;

        // Use direct assignment for better performance
        editorScroller.scrollTop = targetScrollTop;

        // Reset sync flag quickly
        setTimeout(() => {
          isScrollingSyncRef.current = false;
        }, 10);
      }
      scrollSyncTimeoutRef.current = null;
    }, 33); // 30fps throttling for better performance
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

import React, { useRef } from "react";
import { parseMarkdown } from "../lib/markdown";

interface PreviewProps {
  content: string;
  isDarkMode?: boolean;
}

const Preview: React.FC<PreviewProps> = ({ content }) => {
  const [htmlContent, setHtmlContent] = React.useState<string>("");
  const previewRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    parseMarkdown(content).then(setHtmlContent);
  }, [content]);

  // Temporarily disable reverse scroll sync to prevent conflicts
  const handleScroll = () => {
    // Disabled to prevent scroll conflicts that cause white screen
    // This prevents the preview from trying to control the editor scroll
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

export function downloadFile(
  filename: string,
  content: string,
  contentType: string
) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Wrap plain body HTML into a complete HTML document for downloads
export function buildBaseHtmlDocument(body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>MDZen - Minimal Markdown Editor</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 800px; margin: 0 auto; padding: 2rem; line-height: 1.6; }
    code { background: #f4f4f4; padding: 0.2rem 0.4rem; border-radius: 3px; }
    pre { background: #f4f4f4; padding: 1rem; border-radius: 5px; overflow-x: auto; }
    blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 1rem; color: #666; }
  </style>
  </head>
  <body>
    ${body}
  </body>
  </html>`;
}

// Download HTML by accepting either a full document or body HTML
export function downloadHtml(filename: string, bodyOrFullHtml: string) {
  const looksLikeDoc =
    /^\s*<!DOCTYPE/i.test(bodyOrFullHtml) || /<html[\s>]/i.test(bodyOrFullHtml);
  const html = looksLikeDoc
    ? bodyOrFullHtml
    : buildBaseHtmlDocument(bodyOrFullHtml);
  // Use a standard HTML content type with UTF-8 charset
  downloadFile(filename, html, "text/html;charset=utf-8");
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);
      return successful;
    }
  } catch (error) {
    console.error("Could not copy text:", error);
    return false;
  }
}

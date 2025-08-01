import { marked } from "marked";
import DOMPurify from "dompurify";

// Configure marked with security settings
marked.setOptions({
  breaks: true,
  gfm: true,
});

// Configure DOMPurify to remove potentially dangerous elements
const sanitizeConfig = {
  ALLOWED_TAGS: [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "p",
    "br",
    "strong",
    "em",
    "u",
    "s",
    "del",
    "ul",
    "ol",
    "li",
    "blockquote",
    "a",
    "img",
    "pre",
    "code",
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    "hr",
    "div",
    "span",
  ],
  ALLOWED_ATTR: ["href", "src", "alt", "title", "class", "id"],
  ALLOWED_URI_REGEXP:
    /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  FORBID_TAGS: [
    "script",
    "object",
    "embed",
    "iframe",
    "form",
    "input",
    "button",
  ],
  FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover", "style"],
};

export async function parseMarkdown(markdown: string): Promise<string> {
  try {
    // Parse markdown to HTML
    const html = await marked(markdown);

    // Sanitize the HTML to prevent XSS
    const sanitizedHtml = DOMPurify.sanitize(html, sanitizeConfig);

    return sanitizedHtml;
  } catch (error) {
    console.error("Error parsing markdown:", error);
    return "<p>Error parsing markdown</p>";
  }
}

export function validateMarkdownLength(text: string): boolean {
  return text.length <= 10000;
}

// Auto-save functionality
export function saveToLocalStorage(content: string): void {
  try {
    localStorage.setItem("mdzen-content", content);
    localStorage.setItem("mdzen-timestamp", new Date().toISOString());
  } catch (error) {
    console.warn("Failed to save to localStorage:", error);
  }
}

export function loadFromLocalStorage(): string {
  try {
    return localStorage.getItem("mdzen-content") || "";
  } catch (error) {
    console.warn("Failed to load from localStorage:", error);
    return "";
  }
}

export function clearLocalStorage(): void {
  try {
    localStorage.removeItem("mdzen-content");
    localStorage.removeItem("mdzen-timestamp");
  } catch (error) {
    console.warn("Failed to clear localStorage:", error);
  }
}
